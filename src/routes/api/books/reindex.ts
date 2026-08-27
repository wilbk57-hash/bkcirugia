import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { callerIsAdmin, clientForRequest } from '@/lib/rag-auth.server'
import { MAX_PAGES, chunkPages, embedTexts, extractEpubPages, extractPdfPages } from '@/lib/rag.server'

const BUCKET = 'user-books'
const BATCH_SIZE = 24
const TIME_BUDGET_MS = 20000

const BodySchema = z.object({
  bookId: z.string().uuid(),
  offset: z.number().int().min(0).max(20000).optional(),
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const Route = createFileRoute('/api/books/reindex')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const caller = await clientForRequest(request)
        if (!caller) return json({ error: 'unauthorized' }, 401)
        const { supabase, userId } = caller

        let parsed
        try {
          parsed = BodySchema.parse(await request.json())
        } catch {
          return json({ error: 'invalid_request' }, 400)
        }
        const offset = parsed.offset ?? 0

        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return json({ error: 'unavailable', message: 'AI not configured' }, 503)

        // Shared official library book.
        const { data: book, error: bookErr } = await supabase
          .from('user_books')
          .select('id, user_id, file_path, mime_type')
          .eq('id', parsed.bookId)
          .maybeSingle()
        if (bookErr || !book) return json({ error: 'not_found' }, 404)
        // Official library: only administrators may (re)index shared books.
        if (!(await callerIsAdmin(supabase, userId))) return json({ error: 'forbidden' }, 403)

        const isPdf = book.mime_type === 'application/pdf'
        const isEpub =
          (book.mime_type || '').includes('epub') || /\.epub$/i.test(book.file_path || '')
        if (!isPdf && !isEpub) {
          await supabase
            .from('user_books')
            .update({ index_status: 'unsupported', index_error: 'Only PDF and EPUB books are supported.' })
            .eq('id', book.id)
          return json({ status: 'unsupported', done: true })
        }

        const fail = async (message: string) => {
          await supabase
            .from('user_books')
            .update({ index_status: 'failed', index_error: message.slice(0, 500) })
            .eq('id', book.id)
          return json({ status: 'failed', message, done: true })
        }

        try {
          if (offset === 0) {
            await supabase
              .from('user_books')
              .update({ index_status: 'indexing', index_error: null, chunk_count: 0 })
              .eq('id', book.id)
            await supabase.from('book_chunks').delete().eq('book_id', book.id)
          }

          const { data: file, error: dlErr } = await supabase.storage.from(BUCKET).download(book.file_path)
          if (dlErr || !file) return await fail(dlErr?.message || 'download failed')

          const bytes = await file.arrayBuffer()
          const pages = isPdf ? await extractPdfPages(bytes) : await extractEpubPages(bytes)
          const chunks = chunkPages(pages)

          if (!chunks.length) {
            await supabase
              .from('user_books')
              .update({
                index_status: 'no_text',
                index_error: isPdf
                  ? 'No text layer found (scanned PDF).'
                  : 'No readable text found in this EPUB.',
                page_count: pages.length,
              })
              .eq('id', book.id)
            return json({ status: 'no_text', done: true })
          }

          const started = Date.now()
          let cursor = offset
          while (cursor < chunks.length && Date.now() - started < TIME_BUDGET_MS) {
            const slice = chunks.slice(cursor, cursor + BATCH_SIZE)
            const vectors = await embedTexts(
              slice.map((c) => c.content),
              apiKey,
            )
            const rows = slice.map((c, i) => ({
              user_id: book.user_id,
              book_id: book.id,
              chunk_index: c.index,
              content: c.content,
              page: c.page,
              embedding: JSON.stringify(vectors[i]),
            }))
            const { error: insErr } = await supabase
              .from('book_chunks')
              .upsert(rows as never, { onConflict: 'book_id,chunk_index' })
            if (insErr) return await fail(insErr.message)
            cursor += slice.length
          }

          const done = cursor >= chunks.length
          await supabase
            .from('user_books')
            .update({
              index_status: done ? 'ready' : 'indexing',
              chunk_count: cursor,
              page_count: Math.min(pages.length, MAX_PAGES),
              ...(done ? { indexed_at: new Date().toISOString(), index_error: null } : {}),
            })
            .eq('id', book.id)

          return json({
            status: done ? 'ready' : 'indexing',
            done,
            nextOffset: done ? null : cursor,
            total: chunks.length,
            processed: cursor,
          })
        } catch (err: unknown) {
          const e = err as { status?: number; message?: string }
          if (e?.status === 429) return json({ error: 'limit', message: e.message || 'rate limited' }, 429)
          if (e?.status === 402) return json({ error: 'credits', message: e.message || 'no credits' }, 402)
          return await fail(e?.message || 'indexing failed')
        }
      },
    },
  },
})
