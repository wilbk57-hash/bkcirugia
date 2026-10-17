import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { clientForRequest } from '@/lib/rag-auth.server'
import { embedQuery } from '@/lib/rag.server'
import { readLibraryWithRetry } from '@/lib/library-search-retry'

const BodySchema = z.object({
  query: z.string().min(3).max(2000),
  matchCount: z.number().int().min(1).max(12).optional(),
  bookId: z.string().uuid().nullable().optional(),
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const Route = createFileRoute('/api/books/search')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const caller = await clientForRequest(request)
        if (!caller) return json({ error: 'unauthorized' }, 401)

        let parsed
        try {
          parsed = BodySchema.parse(await request.json())
        } catch {
          return json({ error: 'invalid_request' }, 400)
        }

        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return json({ error: 'unavailable' }, 503)

        try {
          const vector = await embedQuery(parsed.query, apiKey)
          // Search the complete shared library, keeping several books represented.
          const { data, error } = await readLibraryWithRetry(() => caller.supabase.rpc('match_library_chunks', {
            query_embedding: JSON.stringify(vector) as unknown as string,
            match_count: parsed.matchCount ?? 12,
          }))
          if (error) {
            console.error('[library-search]', error.code)
            return json({ error: 'unavailable', message: 'A pesquisa dos livros está temporariamente indisponível.' }, 503)
          }

          const rows = (data ?? []).filter((r) => (r.similarity ?? 0) >= 0.25)
          const bookIds = [...new Set(rows.map((r) => r.book_id))]
          let titles: Record<string, string> = {}
          let editions: Record<string, string> = {}
          if (bookIds.length) {
            const { data: books } = await caller.supabase
              .from('user_books')
              .select('id, title, edition')
              .in('id', bookIds)
            titles = Object.fromEntries((books ?? []).map((b) => [b.id, b.title]))
            editions = Object.fromEntries((books ?? []).map((b) => [b.id, b.edition ?? '']))
          }

          return json({
            chunks: rows.map((r) => ({
              bookId: r.book_id,
              title: titles[r.book_id] ?? '',
              edition: editions[r.book_id] ?? '',
              page: r.page,
              content: r.content,
              similarity: r.similarity,
            })),
          })
        } catch (err: unknown) {
          const e = err as { status?: number; message?: string }
          if (e?.status === 429) return json({ error: 'limit' }, 429)
          if (e?.status === 402 || e?.status === 403 || e?.status === 404) return json({ error: 'unavailable', message: e.message || 'Pesquisa indisponível' }, e.status)
          console.error('[library-search] request failed', e?.status ?? 'network')
          return json({ error: 'unavailable', message: 'A pesquisa dos livros está temporariamente indisponível.' }, 503)
        }
      },
    },
  },
})
