// CORS for the Android (Capacitor) app and the published site. Never '*'.
export const ALLOWED_ORIGINS = [
  'https://localhost',
  'capacitor://localhost',
  'https://bkcirugia.lovable.app',
] as const

export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || ''
  const h: Record<string, string> = {
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
  if ((ALLOWED_ORIGINS as readonly string[]).includes(origin)) h['Access-Control-Allow-Origin'] = origin
  return h
}

export function preflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) })
}

/** Wraps a handler so every response carries the CORS headers. */
export function withCors(handler: (ctx: { request: Request }) => Promise<Response>) {
  return async (ctx: { request: Request }) => {
    const res = await handler(ctx)
    const headers = new Headers(res.headers)
    for (const [k, v] of Object.entries(corsHeaders(ctx.request))) headers.set(k, v)
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  }
}

/** Subscription gate: false → 402, RPC failure → 503 (never block on technical errors). */
export async function subscriptionGate(supabase: {
  rpc: (fn: 'has_access') => PromiseLike<{ data: unknown; error: unknown }>
}): Promise<'ok' | 'denied' | 'error'> {
  const { data, error } = await supabase.rpc('has_access')
  if (error) return 'error'
  return data === true ? 'ok' : 'denied'
}
