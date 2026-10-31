import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'
import { z } from 'zod'

import { preflight, withCors, subscriptionGate } from '@/lib/cors.server'
import {
  createGeminiProvider,
  createLovableResponsesProvider,
} from '@/lib/ai-gateway.server'
import { clientForRequest } from '@/lib/rag-auth.server'
import { buildTutorSystemPrompt } from '@/lib/tutor-prompt.server'
import { tutorStreamResponse } from '@/lib/tutor-stream.server'
import { withLovableAiGatewayRunIdHeader } from '@/lib/ai-run-id.server'

const BodySchema = z.object({
  provider: z.enum(['gemini', 'openai']),
  stream: z.boolean().optional(),
  context: z.string().max(60000).optional(),
  maxTokens: z.number().int().min(64).max(4000).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(20000),
      }),
    )
    .min(1)
    .max(40),
})

const MODELS = {
  gemini: 'gemini-3.5-flash-lite',
  openai: 'openai/gpt-5.6-luna',
} as const

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

export const Route = createFileRoute('/api/tutor')({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),

      POST: withCors(async ({ request }) => {
        // 1. Autenticação
        const caller = await clientForRequest(request)

        if (!caller) {
          return json({ error: 'unauthorized' }, 401)
        }

        // 2. Verificação do estado da conta
        const { data: profile, error: profileError } =
          await caller.supabase
            .from('profiles')
            .select('status')
            .eq('id', caller.userId)
            .single()

        if (profileError || !profile) {
          return json({ error: 'unavailable' }, 503)
        }

        if (profile.status === 'suspended') {
          return json({ error: 'account_suspended' }, 403)
        }

        // 3. Verificação da subscrição
        const gate = await subscriptionGate(caller.supabase as never)

        if (gate === 'error') {
          return json({ error: 'unavailable' }, 503)
        }

        if (gate === 'denied') {
          return json({ error: 'subscription_required' }, 402)
        }

        // 4. Validação dos dados recebidos
        let parsed

        try {
          parsed = BodySchema.parse(await request.json())
        } catch (err) {
          const issues =
            err instanceof z.ZodError
              ? err.issues
                  .map(
                    (i) =>
                      `${i.path.join('.') || 'body'}: ${i.message}`,
                  )
                  .join('; ')
              : 'malformed JSON body'

          return json(
            { error: 'invalid_request', message: issues },
            400,
          )
        }

        // 5. Construção do prompt oficial no servidor
        // O contexto enviado pelo navegador é tratado como informação auxiliar.
        const system = buildTutorSystemPrompt(parsed.context)

        const modelId = MODELS[parsed.provider]
        const maxOutputTokens = parsed.maxTokens ?? 1500

        try {
          // 6. Gemini — ligação direta à API Google
          if (parsed.provider === 'gemini') {
            const geminiApiKey = process.env['GEMINI_API_KEY']

            if (!geminiApiKey) {
              return json(
                {
                  error: 'unavailable',
                  message: 'Gemini não está configurado no servidor.',
                },
                503,
              )
            }

            const gemini = createGeminiProvider(geminiApiKey)

            const result = streamText({
              model: gemini(modelId),
              system,
              messages: parsed.messages,
              maxOutputTokens,
            })

            if (parsed.stream) {
              return tutorStreamResponse(result.stream)
            }

            return json({
              text: await result.text,
              provider: 'gemini',
              model: modelId,
            })
          }

          // 7. OpenAI — mantém a integração Lovable existente
          const lovableApiKey = process.env['LOVABLE_API_KEY']

          if (!lovableApiKey) {
            return json(
              {
                error: 'unavailable',
                message: 'OpenAI não está configurado no servidor.',
              },
              503,
            )
          }

          const openai =
            createLovableResponsesProvider(lovableApiKey)

          const result = streamText({
            model: openai.responses(modelId),
            system,
            messages: parsed.messages,
            maxOutputTokens,
            providerOptions: {
              openai: { store: false },
            },
          })

          if (parsed.stream) {
            return withLovableAiGatewayRunIdHeader(
              await tutorStreamResponse(result.stream),
              openai,
            )
          }

          return json({
            text: await result.text,
            provider: 'openai',
            model: modelId,
          })
        } catch (err: unknown) {
          const e = err as {
            statusCode?: number
            status?: number
            message?: string
          }

          const status = e?.statusCode ?? e?.status ?? 0
          const message = e?.message || 'AI error'

          if (status === 429) {
            return json({ error: 'limit', message }, 429)
          }

          if (status === 402) {
            return json({ error: 'credits', message }, 402)
          }

          if (status >= 500) {
            return json({ error: 'overloaded', message }, 503)
          }

          return json({ error: 'failed', message }, 502)
        }
      }),
    },
  },
})