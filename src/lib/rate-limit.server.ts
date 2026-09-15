import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

/**
 * Limites por aluno e por hora. Evitam que uma sessão (ou um script) gere
 * custos ilimitados de IA. Ajustar aqui é suficiente — todos os endpoints
 * usam a mesma função da base de dados (`consume_ai_quota`).
 */
export const AI_LIMITS = {
  tutor: 60,
  search: 120,
  ocr: 400,
  reindex: 20,
} as const

export type AiQuotaKind = keyof typeof AI_LIMITS

/**
 * Consome uma unidade de quota da hora corrente para o utilizador autenticado.
 * Devolve false quando o limite foi atingido. Em caso de erro inesperado na
 * base de dados devolve true (não bloqueia o aluno por uma falha do contador).
 */
export async function consumeAiQuota(
  supabase: SupabaseClient<Database>,
  kind: AiQuotaKind,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('consume_ai_quota', {
    _kind: kind,
    _limit: AI_LIMITS[kind],
  })
  if (error) {
    console.error('[rate-limit] consume_ai_quota failed', error.message)
    return true
  }
  return data !== false
}

export function rateLimitResponse(kind: AiQuotaKind) {
  return new Response(
    JSON.stringify({
      error: 'rate_limited',
      message: `Limite de ${AI_LIMITS[kind]} pedidos por hora atingido. Tente novamente mais tarde.`,
    }),
    {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    },
  )
}
