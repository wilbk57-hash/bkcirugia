import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { preflight, withCors, subscriptionGate } from '@/lib/cors.server'
import { clientForRequest } from '@/lib/rag-auth.server'
import { advance, inventory } from '@/lib/study-generation/generator.server'
import { buildModule, validateState, type GenerationState } from '@/lib/study-generation/contract'
import type { Json } from '@/integrations/supabase/types'

const inputSchema = z.object({
  action: z.enum(['list', 'inventory', 'create', 'step', 'resume', 'save', 'publish', 'restore']),
  id: z.string().uuid().optional(), version: z.number().int().optional(),
  title: z.string().min(3).max(250).optional(), priorities: z.string().max(2000).optional(), edition: z.string().max(500).optional(),
  catalog_n: z.string().max(30).optional(), catalog_title: z.string().max(250).optional(),
  state: z.unknown().optional(), reviewed: z.boolean().optional(),
})
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
const asJson = (value: unknown) => JSON.parse(JSON.stringify(value)) as Json

export const Route = createFileRoute('/api/study-modules')({ server: { handlers: {
  OPTIONS: async ({ request }) => preflight(request),
  POST: withCors(async ({ request }) => {
    const caller = await clientForRequest(request)
    if (!caller) return json({ message: 'Inicia sessão novamente.' }, 401)
    const { data: admin, error: roleError } = await caller.supabase.rpc('is_platform_admin')
    if (roleError) return json({ message: 'Não foi possível verificar a autorização.' }, 503)
    let input: z.infer<typeof inputSchema>
    try { input = inputSchema.parse(await request.json()) } catch { return json({ message: 'Pedido inválido.' }, 400) }
    const client = caller.supabase
    if (input.action === 'list') {
      const gate = await subscriptionGate(client)
      if (gate !== 'ok') return json({ message: gate === 'error' ? 'Acesso temporariamente indisponível.' : 'Assinatura necessária.' }, gate === 'error' ? 503 : 402)
      const revisions = await client.from('study_module_revisions').select('*').eq('published', true).order('reviewed_at', { ascending: false })
      if (revisions.error) return json({ message: 'Não foi possível carregar os temas.' }, 503)
      const drafts = admin ? await client.from('study_module_drafts').select('*').order('updated_at', { ascending: false }) : { data: [], error: null }
      if (drafts.error) return json({ message: 'Não foi possível carregar os rascunhos.' }, 503)
      const history = admin ? await client.from('study_module_revisions').select('id,module_id,version,title,published,reviewed_at').order('reviewed_at', { ascending: false }) : { data: [], error: null }
      return json({ revisions: revisions.data, drafts: drafts.data, history: history.data, admin: admin === true })
    }
    if (admin !== true) return json({ message: 'Só o administrador pode gerar ou alterar temas.' }, 403)
    try {
      if (input.action === 'inventory') return json({ books: await inventory(client) })
      if (input.action === 'create') {
        if (!input.title) return json({ message: 'Indica o tema.' }, 400)
        const state: GenerationState = { priorities: input.priorities || '', edition_preference: input.edition || '', inventory: [], queries: [], evidence: [], research_log: [], tabs: [], limitations: [] }
        const row = await client.from('study_module_drafts').insert({ owner_id: caller.userId, title: input.title, catalog_n: input.catalog_n || 'GERADOS', catalog_title: input.catalog_title || 'Temas da Biblioteca Oficial', data_json: asJson(state) }).select('*').single()
        if (row.error) throw new Error('Não foi possível guardar o rascunho.')
        return json({ draft: row.data })
      }
      if (!input.id) return json({ message: 'Rascunho não indicado.' }, 400)
      if (input.action === 'restore') {
        const result = await client.rpc('study_module_restore', { p_id: input.id })
        if (result.error || !result.data) throw new Error('Não foi possível restaurar esta versão.')
        return json({ restored: true })
      }
      const row = await client.from('study_module_drafts').select('*').eq('id', input.id).eq('owner_id', caller.userId).single()
      if (row.error || !row.data) return json({ message: 'Rascunho indisponível.' }, 404)
      const draft = row.data
      if (input.version !== draft.version) return json({ message: 'O rascunho mudou. Recarrega antes de continuar.' }, 409)
      const state = draft.data_json as unknown as GenerationState
      if (input.action === 'publish') {
        if (!input.reviewed || draft.phase !== 'review') return json({ message: 'Confirma a revisão das fontes antes de disponibilizar.' }, 400)
        const errors = validateState(state)
        if (errors.length) return json({ message: errors.join(' ') }, 422)
        if (!state.review || state.review.correcoes_necessarias.length) return json({ message: 'Corrige as pendências da revisão antes de disponibilizar.' }, 422)
        const payload = buildModule(draft.title, state)
        const result = await client.rpc('study_module_publish', { p_id: draft.id, p_version: draft.version, p_payload: asJson(payload) })
        if (result.error) throw new Error('Não foi possível disponibilizar o tema; verifica se o rascunho mudou.')
        return json({ published: result.data, payload })
      }
      if (input.action === 'resume') {
        if (draft.error_message?.startsWith('provider_denied:')) return json({ message: 'A geração foi recusada pelo serviço de IA. Restaura o acesso antes de iniciar um novo pedido.' }, 403)
        const res = await client.from('study_module_drafts').update({ paused: false, error_message: null, version: draft.version + 1 }).eq('id', draft.id).eq('version', draft.version).is('lease_token', null).select('*').maybeSingle()
        if (res.error || !res.data) return json({ message: 'Existe trabalho em curso ou o rascunho mudou.' }, 409)
        return json({ draft: res.data })
      }
      if (input.action === 'save') {
        if (draft.phase !== 'review') return json({ message: 'Aguarda o fim da geração antes de rever.' }, 400)
        const edited = input.state as GenerationState
        // Sources and research evidence are server-owned, never replaced by edited JSON.
        const next = { ...state, plan: edited?.plan, tabs: edited?.tabs, extras: edited?.extras, review: edited?.review }
        const errors = validateState(next)
        if (errors.length) return json({ message: errors.join(' ') }, 422)
        const res = await client.from('study_module_drafts').update({ data_json: asJson(next), version: draft.version + 1, updated_at: new Date().toISOString() }).eq('id', draft.id).eq('version', draft.version).is('lease_token', null).select('*').maybeSingle()
        if (res.error || !res.data) return json({ message: 'O rascunho mudou; recarrega.' }, 409)
        return json({ draft: res.data, payload: buildModule(draft.title, next) })
      }
      if (input.action !== 'step') return json({ message: 'Ação indisponível.' }, 400)
      if (draft.paused) return json({ message: draft.error_message || 'Geração pausada. Retoma explicitamente para continuar.' }, 409)
      const apiKey = process.env['LOVABLE_API_KEY']
      if (!apiKey) return json({ message: 'A IA não está configurada.' }, 503)
      const token = crypto.randomUUID()
      const lock = await client.rpc('study_module_acquire', { p_id: draft.id, p_version: draft.version, p_token: token })
      if (lock.error || !lock.data) return json({ message: 'Já existe uma etapa em curso. Aguarda ou recarrega.' }, 409)
      const encoder = new TextEncoder()
      let cancelled = false
      const body = new ReadableStream<Uint8Array>({
        async start(controller) {
          const send = (value: unknown) => { if (!cancelled) controller.enqueue(encoder.encode(JSON.stringify(value) + '\n')) }
          const heartbeat = setInterval(() => send({ progress: 'A processar a etapa…' }), 10000)
          send({ progress: draft.phase })
          try {
            const next = await advance(request, client, draft.title, state, draft.phase, draft.step, apiKey)
            const result = await client.rpc('study_module_finish', { p_id: draft.id, p_token: token, p_data: asJson(next.state), p_phase: next.phase, p_step: next.step, p_error: null, p_paused: false })
            if (result.error || !result.data) throw new Error('A etapa não foi guardada: sessão ou rascunho mudou. Recarrega.')
            const saved = await client.from('study_module_drafts').select('*').eq('id', draft.id).single()
            if (saved.error) throw new Error('Não foi possível reler o rascunho guardado.')
            send({ draft: saved.data, payload: next.phase === 'review' ? buildModule(draft.title, next.state) : null })
          } catch (error) {
            const err = error as { statusCode?: number; status?: number; message?: string; name?: string }
            const status = err.statusCode || err.status || (request.signal.aborted ? 499 : 502)
            const message = status === 499 ? 'Geração interrompida. O progresso anterior foi preservado.' : err.message || 'A etapa falhou; o progresso anterior foi preservado.'
            const reason = status === 403 ? 'provider_denied: ' + message : message
            await client.rpc('study_module_finish', { p_id: draft.id, p_token: token, p_data: asJson(draft.data_json), p_phase: draft.phase, p_step: draft.step, p_error: reason, p_paused: true })
            send({ error: true, status, message })
          } finally { clearInterval(heartbeat); if (!cancelled) controller.close() }
        }, cancel() { cancelled = true },
      })
      return new Response(body, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' } })
    } catch (error) { return json({ message: error instanceof Error ? error.message : 'Operação indisponível.' }, 503) }
  }),
} } })