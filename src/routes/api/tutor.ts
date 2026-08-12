import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { streamText } from 'ai'
import { z } from 'zod'
import {
  createLovableChatProvider,
  createLovableResponsesProvider,
} from '@/lib/ai-gateway.server'

const BodySchema = z.object({
  provider: z.enum(['gemini', 'openai']),
  system: z.string().max(40000).optional(),
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
  gemini: 'google/gemini-3.6-flash',
  openai: 'openai/gpt-5.4-mini',
} as const

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

async function verifyCaller(request: Request) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  if (!token) return null
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!
  const supabase = createClient(process.env['SUPABASE_URL']!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers)
        if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization')
        h.set('apikey', key)
        return fetch(input, { ...init, headers: h })
      },
    },
  })
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user.id
}

export const Route = createFileRoute('/api/tutor')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await verifyCaller(request)
        if (!userId) return json({ error: 'unauthorized' }, 401)

        let parsed
        try {
          parsed = BodySchema.parse(await request.json())
        } catch {
          return json({ error: 'invalid_request' }, 400)
        }

        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return json({ error: 'unavailable', message: 'AI not configured' }, 503)

        const modelId = MODELS[parsed.provider]
        try {
          const result =
            parsed.provider === 'openai'
              ? streamText({
                  model: createLovableResponsesProvider(apiKey).responses(modelId),
                  system: parsed.system,
                  messages: parsed.messages,
                  maxOutputTokens: parsed.maxTokens ?? 1500,
                  providerOptions: { openai: { store: false } },
                })
              : streamText({
                  model: createLovableChatProvider(apiKey)(modelId),
                  system: parsed.system,
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
