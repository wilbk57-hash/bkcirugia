import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

/**
 * Builds a Supabase client acting as the caller. RLS applies, so every read is
 * already scoped to the signed-in student. Returns null when the token is absent
 * or invalid.
 */
export async function clientForRequest(
  request: Request,
): Promise<{ supabase: SupabaseClient<Database>; userId: string } | null> {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  if (!token) return null

  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!
  const supabase = createClient<Database>(process.env['SUPABASE_URL']!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const h = new Headers(init?.headers)
        h.set('apikey', key)
        h.set('Authorization', `Bearer ${token}`)
        return fetch(input, { ...init, headers: h })
      },
    },
  })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return { supabase, userId: data.user.id }
}

/** True when the caller is a platform administrator signed in with the TOTP second factor (aal2). */
export async function callerIsAdmin(
  supabase: SupabaseClient<Database>,
  _userId: string,
): Promise<boolean> {
  const { data } = await supabase.rpc('is_platform_admin')
  return data === true
}
