import { extractText, getDocumentProxy } from 'unpdf'

export const MAX_PAGES = 400
export const EMBED_MODEL = 'openai/text-embedding-3-small'
export const EMBED_DIMS = 1536
const CHUNK_CHARS = 1200
const CHUNK_OVERLAP = 150
const EMBED_BATCH = 32

export type Chunk = { index: number; content: string; page: number | null }

function clean(text: string) {
  return text.replace(/\u0000/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

/** Extracts per-page text from a text-layer PDF. Returns [] when there is no usable text. */
export async function extractPdfPages(buffer: ArrayBuffer): Promise<string[]> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const total = Math.min(pdf.numPages, MAX_PAGES)
  const { text } = await extractText(pdf, { mergePages: false })
  const pages = Array.isArray(text) ? text : [String(text)]
  return pages.slice(0, total).map((p) => clean(String(p ?? '')))
}

/** Splits page text into overlapping chunks, keeping the source page number. */
export function chunkPages(pages: string[]): Chunk[] {
  const chunks: Chunk[] = []
  let index = 0
  pages.forEach((pageText, i) => {
    const t = pageText.trim()
    if (t.length < 40) return
    let start = 0
    while (start < t.length) {
      const end = Math.min(t.length, start + CHUNK_CHARS)
      const slice = t.slice(start, end).trim()
      if (slice.length >= 40) chunks.push({ index: index++, content: slice, page: i + 1 })
      if (end >= t.length) break
      start = end - CHUNK_OVERLAP
    }
  })
  return chunks
}

type GatewayError = Error & { status?: number }

async function embedBatch(inputs: string[], apiKey: string): Promise<number[][]> {
  const resp = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Lovable-API-Key': apiKey,
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: inputs }),
  })
  if (!resp.ok) {
    let message = `HTTP ${resp.status}`
    try {
      const body = (await resp.json()) as { error?: { message?: string }; message?: string }
      message = body?.error?.message || body?.message || message
    } catch {
      /* keep default message */
    }
    const err: GatewayError = new Error(message)
    err.status = resp.status
    throw err
  }
  const data = (await resp.json()) as { data: Array<{ index: number; embedding: number[] }> }
  const out: number[][] = new Array(inputs.length)
  data.data.forEach((d) => {
    out[d.index] = d.embedding
  })
  return out
}

/** Embeds a list of texts, respecting the provider batch limits. */
export async function embedTexts(texts: string[], apiKey: string): Promise<number[][]> {
  const result: number[][] = []
  for (let i = 0; i < texts.length; i += EMBED_BATCH) {
    const batch = await embedBatch(texts.slice(i, i + EMBED_BATCH), apiKey)
    result.push(...batch)
  }
  return result
}

export async function embedQuery(text: string, apiKey: string): Promise<number[]> {
  const [vector] = await embedTexts([text.slice(0, 4000)], apiKey)
  return vector!
}
