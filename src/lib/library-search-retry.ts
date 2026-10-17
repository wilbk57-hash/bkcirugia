type SearchError = { code?: string; message?: string } | null

/** Retry only transient read failures; never retry rejected permissions. */
export async function readLibraryWithRetry<T>(
  read: () => PromiseLike<{ data: T; error: SearchError }>,
) {
  const first = await read()
  if (!first.error) return first
  const code = first.error.code ?? ''
  const transient = ['57014', '53300', '57P01', '57P03', '40001'].includes(code)
    || code.startsWith('08')
    || /fetch failed|failed to fetch|network|connection reset|timeout/i.test(first.error.message ?? '')
  if (!transient) return first
  return read()
}