import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { preflight, withCors } from '@/lib/cors.server'
import { callerIsAdmin, clientForRequest } from '@/lib/rag-auth.server'
import { chunkPages, embedTexts } from '@/lib/rag.server'

export const OCR_MAX_PAGES = 1000
const OCR_MODEL = 'google/gemini-3.1-flash-lite'
const CHUNKS_PER_PAGE = 50

const BodySchema = z.object({
  bookId: z.string().uuid(),
  page: z.number().int().min(1).max(OCR_MAX_PAGES),
  totalPages: z.number().int().min(1).max(OCR_MAX_PAGES),
  image: z.string().min(100).max(8_000_000), // data:image/jpeg;base64,...
  finish: z.boolean().optional(),
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

const OCR_PROMPT =
  'Transcreve fielmente TODO o texto visível nesta página digitalizada de um livro. ' +
  'Mantém a ordem de leitura e os parágrafos. Não traduzas, não resumas e não comentes. ' +
  'Descreve tabelas em texto corrido. Se a página não tiver texto legível, responde exatamente: [SEM TEXTO]'

async function ocrPage(dataUrl: string, apiKey: string): Promise<string> {
  const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Lovable-API-Key': apiKey,
      'X-Lovable-AIG-SDK': 'fetch',
    },
    body: JSON.stringify({
      model: OCR_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: OCR_PROMPT },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  })
  if (!resp.ok) {
    let message = `HTTP ${resp.status}`
    try {
      const body = (await resp.json()) as { error?: { message?: string }; message?: string }
      message = body?.error?.message || body?.message || message
    } catch {
      /* keep default */
    }
    const err = new Error(message) as Error & { status?: number }
    err.status = resp.status
    throw err
  }
  const body = (await resp.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const text = (body.choices?.[0]?.message?.content || '').trim()
  return /^\[?SEM TEXTO\]?$/i.test(text) ? '' : text
}

export const Route = createFileRoute('/api/books/ocr')({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      POST: withCors(async ({ request }) => {
        const caller = await clientForRequest(request)
        if (!caller) return json({ error: 'unauthorized' }, 401)
        const { supabase, userId } = caller

        let parsed
        try {
          parsed = BodySchema.parse(await request.json())
        } catch {
          return json({ error: 'invalid_request' }, 400)
        }

        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return json({ error: 'unavailable', message: 'AI not configured' }, 503)

        // Shared official library book.
        const { data: book, error: bookErr } = await supabase
          .from('user_books')
          .select('id, user_id, chunk_count')
          .eq('id', parsed.bookId)
          .maybeSingle()
        if (bookErr || !book) return json({ error: 'not_found' }, 404)
        // Official library: only administrators may (re)index shared books.
        if (!(await callerIsAdmin(supabase, userId))) return json({ error: 'forbidden' }, 403)

        try {
          if (parsed.page === 1) {
            await supabase.from('book_chunks').delete().eq('book_id', book.id)
            await supabase
              .from('user_books')
              .update({
                index_status: 'ocr',
                index_error: null,
                chunk_count: 0,
                ocr_pages_done: 0,
                ocr_total_pages: parsed.totalPages,
              })
              .eq('id', book.id)
          }

          const text = await ocrPage(parsed.image, apiKey)
          const chunks = chunkPages([text]).slice(0, CHUNKS_PER_PAGE)

          if (chunks.length) {
            const vectors = await embedTexts(
              chunks.map((c) => c.content),
              apiKey,
            )
            const rows = chunks.map((c, i) => ({
              user_id: book.user_id,
              book_id: book.id,
              chunk_index: (parsed.page - 1) * CHUNKS_PER_PAGE + i,
              content: c.content,
              page: parsed.page,
              embedding: JSON.stringify(vectors[i]),
            }))
            const { error: insErr } = await supabase
              .from('book_chunks')
              .upsert(rows as never, { onConflict: 'book_id,chunk_index' })
            if (insErr) return json({ error: 'failed', message: insErr.message }, 502)
          }

          const { count } = await supabase
            .from('book_chunks')
            .select('id', { count: 'exact', head: true })
            .eq('book_id', book.id)

          const done = parsed.finish === true || parsed.page >= parsed.totalPages
          const total = count ?? 0
          await supabase
            .from('user_books')
            .update({
              index_status: done ? (total > 0 ? 'ready' : 'no_text') : 'ocr',
              chunk_count: total,
              ocr_pages_done: parsed.page,
              ocr_total_pages: parsed.totalPages,
              ...(done
                ? {
                    indexed_at: new Date().toISOString(),
                    index_error:
                      total > 0 ? null : 'No readable text found while reading the scanned pages.',
                  }
                : {}),
            })
            .eq('id', book.id)

          return json({
            status: done ? (total > 0 ? 'ready' : 'no_text') : 'ocr',
            done,
            page: parsed.page,
            chunks: total,
            pageChunks: chunks.length,
          })
        } catch (err: unknown) {
          const e = err as { status?: number; message?: string }
          if (e?.status === 429) return json({ error: 'limit', message: e.message }, 429)
          if (e?.status === 402) return json({ error: 'credits', message: e.message }, 402)
          if (e?.status === 403) return json({ error: 'blocked', message: e.message }, 403)
          await supabase
            .from('user_books')
            .update({ index_status: 'failed', index_error: (e?.message || 'OCR failed').slice(0, 500) })
            .eq('id', book.id)
          return json({ error: 'failed', message: e?.message || 'OCR failed' }, 502)
        }
      }),
    },
  },
})
