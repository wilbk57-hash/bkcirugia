import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'
import { z } from 'zod'
import {
  createLovableChatProvider,
  createLovableResponsesProvider,
} from '@/lib/ai-gateway.server'
import { clientForRequest } from '@/lib/rag-auth.server'
import { consumeAiQuota, rateLimitResponse } from '@/lib/rate-limit.server'

const BodySchema = z.object({
  provider: z.enum(['gemini', 'openai']),
  system: z.string().max(60000).optional(),
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
  gemini: 'google/gemini-3.1-flash-lite',
  openai: 'openai/gpt-5.6-luna',
} as const

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const Route = createFileRoute('/api/tutor')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const caller = await clientForRequest(request)
        if (!caller) return json({ error: 'unauthorized' }, 401)

        // Limite por aluno e por hora — evita custos de IA descontrolados.
        if (!(await consumeAiQuota(caller.supabase, 'tutor'))) return rateLimitResponse('tutor')

        let parsed
        try {
          parsed = BodySchema.parse(await request.json())
        } catch (err) {
          const issues =
            err instanceof z.ZodError
              ? err.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`).join('; ')
              : 'malformed JSON body'
          return json({ error: 'invalid_request', message: issues }, 400)
        }

        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return json({ error: 'unavailable', message: 'AI not configured' }, 503)

        const modelId = MODELS[parsed.provider]
        const system = parsed.system ?? 'You are a helpful assistant.'
        try {
          const result =
            parsed.provider === 'openai'
              ? streamText({
                  model: createLovableResponsesProvider(apiKey).responses(modelId),
                  system,
                  messages: parsed.messages,
                  maxOutputTokens: parsed.maxTokens ?? 1500,
                  providerOptions: { openai: { store: false } },
                })
              : streamText({
                  model: createLovableChatProvider(apiKey)(modelId),
                  system,
                  messages: parsed.messages,
                  maxOutputTokens: parsed.maxTokens ?? 1500,
                })

          const text = await result.text
          return json({ text, provider: parsed.provider, model: modelId })
        } catch (err: unknown) {
          const e = err as { statusCode?: number; responseBody?: string; message?: string }
          const status = e?.statusCode ?? 0
          const message = e?.message || 'AI error'
          if (status === 429) return json({ error: 'limit', message }, 429)
          if (status === 402) return json({ error: 'credits', message }, 402)
          if (status >= 500) return json({ error: 'overloaded', message }, 503)
          return json({ error: 'failed', message }, 502)
        }
      },
    },
  },
})
