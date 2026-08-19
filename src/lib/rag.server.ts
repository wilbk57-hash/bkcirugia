import { extractText, getDocumentProxy } from 'unpdf'
import { unzipSync, strFromU8 } from 'fflate'

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

function stripHtml(html: string) {
  return clean(
    html
      .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, ' ')
      .replace(/<\s*(p|div|br|h[1-6]|li|tr)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'"),
  )
}

function resolvePath(base: string, href: string) {
  const parts = base.split('/').slice(0, -1)
  for (const seg of decodeURIComponent(href.split('#')[0]!).split('/')) {
    if (seg === '.' || seg === '') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return parts.join('/')
}

/**
 * Extracts text from an EPUB, one entry per spine document ("page" equivalent).
 * Pure JS (fflate), so it runs in the edge runtime.
 */
export async function extractEpubPages(buffer: ArrayBuffer): Promise<string[]> {
  const files = unzipSync(new Uint8Array(buffer))
  const read = (p: string) => (files[p] ? strFromU8(files[p]!) : '')

  const container = read('META-INF/container.xml')
  const opfPath =
    /full-path="([^"]+)"/i.exec(container)?.[1] ||
    Object.keys(files).find((f) => f.toLowerCase().endsWith('.opf')) ||
    ''
  if (!opfPath) return []
  const opf = read(opfPath)

  const manifest = new Map<string, string>()
  for (const m of opf.matchAll(/<item\b[^>]*>/gi)) {
    const tag = m[0]
    const id = /\sid="([^"]+)"/i.exec(tag)?.[1]
    const href = /\shref="([^"]+)"/i.exec(tag)?.[1]
    if (id && href) manifest.set(id, resolvePath(opfPath, href))
  }

  let paths: string[] = []
  for (const m of opf.matchAll(/<itemref\b[^>]*>/gi)) {
    const idref = /\sidref="([^"]+)"/i.exec(m[0])?.[1]
    const p = idref ? manifest.get(idref) : undefined
    if (p) paths.push(p)
  }
  if (!paths.length) {
    paths = Object.keys(files).filter((f) => /\.x?html?$/i.test(f)).sort()
  }

  return paths
    .slice(0, MAX_PAGES)
    .map((p) => (files[p] ? stripHtml(strFromU8(files[p]!)) : ''))
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
