// Plain UTF-8 deltas plus an RS-delimited terminal record: EOF alone is not success.
type TutorPart = { type: string; text?: string; error?: unknown; finishReason?: string }

export async function tutorStreamResponse(parts: AsyncIterable<TutorPart>) {
  const encoder = new TextEncoder()
  async function* chunks() {
    let completed = false
    for await (const part of parts) {
      if (part.type === 'error') throw part.error || new Error('AI error')
      if (part.type === 'text-delta' && part.text) yield part.text
      if (part.type === 'finish') {
        if (part.finishReason === 'error') throw new Error('AI error')
        completed = true
      }
    }
    if (!completed) throw new Error('A resposta foi interrompida. Tenta novamente.')
    yield '\u001e' + JSON.stringify({ done: true }) + '\n'
  }
  const iterator = chunks()
  // Failure before the first text still reaches the route's JSON error handler.
  const first = await iterator.next()
  let pending = first
  return new Response(new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (pending.done) { controller.close(); return }
        controller.enqueue(encoder.encode(pending.value))
        pending = await iterator.next()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'A resposta foi interrompida. Tenta novamente.'
        controller.enqueue(encoder.encode('\u001e' + JSON.stringify({ error: 'failed', message }) + '\n'))
        controller.close()
      }
    },
    async cancel() { await iterator.return() },
  }), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-BK-Tutor-Stream': 'v1',
      'Access-Control-Expose-Headers': 'X-BK-Tutor-Stream',
    },
  })
}