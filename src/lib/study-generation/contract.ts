import { z } from 'zod'

export const EDUCATIONAL_NOTICE = 'Material educacional. Conteúdo sintetizado a partir dos livros da Biblioteca Oficial do BK-CIRURGIA. Não substitui protocolos institucionais, diretrizes vigentes nem avaliação clínica individual.'
export const CASE_NOTICE = 'Caso fictício para fins educacionais.'
export const CASE_STEPS = ['motivo_consulta', 'historia', 'antecedentes', 'exame_fisico', 'hipoteses_diagnosticas', 'exames_complementares', 'diagnostico', 'conduta', 'evolucao_alta'] as const

const strings = z.array(z.string())
export const queriesSchema = z.object({ termos: strings }).strict()
export const planSchema = z.object({
  objetivos: strings,
  tempo_estimado_minutos: z.number(),
  abas: z.array(z.object({ id: z.string(), titulo: z.string(), objetivos: strings, fontes: strings }).strict()),
  matriz: z.array(z.object({ subtema: z.string(), fonte: z.string().nullable(), informacao_extraida: z.string(), status: z.enum(['coberto', 'parcial', 'nao_coberto', 'divergente']), abas_relacionadas: strings }).strict()),
  lacunas: strings, divergencias: strings, limitacoes: strings,
}).strict()
export const tabSchema = z.object({
  id: z.string(), titulo: z.string(),
  conteudo: z.array(z.object({
    id: z.string(), bloco: z.enum(['texto', 'lista', 'tabela', 'nota', 'lacuna']),
    tipo_visual: z.enum(['conceito', 'atencao', 'complicacao', 'referencia', 'conduta', 'nota', 'lacuna']),
    titulo: z.string(), texto: z.string(), itens: strings,
    tabela: z.object({ cabecalhos: strings, linhas: z.array(strings) }).strict().nullable(),
    fontes: strings,
  }).strict()),
  limitacoes: strings,
}).strict()
export const extrasSchema = z.object({
  caso_clinico: z.array(z.object({ etapa: z.enum(CASE_STEPS), texto: z.string(), fontes: strings, limitacao: z.string().nullable() }).strict()),
  mapa_mental: z.array(z.object({ id: z.string(), label: z.string(), pai: z.string().nullable(), fontes: strings }).strict()),
  flashcards: z.array(z.object({ id: z.string(), pergunta: z.string(), resposta: z.string(), subtema: z.string(), aba_relacionada: z.string(), fontes: strings }).strict()),
  quiz: z.array(z.object({ id: z.string(), pergunta: z.string(), alternativas: strings, correta: z.number(), justificativas: strings, aba_relacionada: z.string(), fontes: strings }).strict()),
  limitacoes: strings,
}).strict()
export const reviewSchema = z.object({ pendencias: strings, divergencias: strings, correcoes_necessarias: strings }).strict()

export type Evidence = { id: string; book_id: string; title: string; edition: string | null; locator: string; content: string }
export type BookInventory = { id: string; title: string; edition: string | null; index_status: string; chunk_count: number; total_chunks: number | null; mime_type: string | null; ready: boolean }
export type GenerationState = {
  priorities: string; edition_preference: string;
  inventory: BookInventory[]; queries: string[]; evidence: Evidence[];
  research_log: Array<{ book_id: string; query: string; matches: number }>;
  plan?: z.infer<typeof planSchema> | undefined;
  tabs: z.infer<typeof tabSchema>[];
  extras?: z.infer<typeof extrasSchema> | undefined;
  review?: z.infer<typeof reviewSchema> | undefined;
  limitations: string[];
}

export function validateState(state: GenerationState): string[] {
  const problems: string[] = []
  const p = planSchema.safeParse(state.plan)
  const e = extrasSchema.safeParse(state.extras)
  if (!p.success) return ['Plano pedagógico incompleto.']
  if (!e.success) return ['Caso clínico, mapa, flashcards ou quiz incompletos.']
  const tabs = state.tabs.map(t => tabSchema.safeParse(t))
  if (tabs.some(t => !t.success)) return ['Uma aba tem formato inválido.']
  const ids = new Set(p.data.abas.map(t => t.id))
  const sourceIds = new Set(state.evidence.map(s => s.id))
  if (!sourceIds.size) problems.push('Não existem fontes recuperadas.')
  if (ids.size !== p.data.abas.length || !ids.size) problems.push('IDs de abas repetidos ou plano vazio.')
  if (state.tabs.length !== ids.size || new Set(state.tabs.map(t => t.id)).size !== ids.size || state.tabs.some(t => !ids.has(t.id))) problems.push('Abas em falta ou repetidas.')
  const refs = (sources: string[], required = true) => {
    if (required && !sources.length) problems.push('Conteúdo clínico sem referência.')
    if (sources.some(s => !sourceIds.has(s))) problems.push('Referência inexistente nos trechos recuperados.')
  }
  for (const t of state.tabs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.id)) problems.push('ID de aba inválido.')
    if (!t.conteudo.length) problems.push('Aba vazia.')
    for (const b of t.conteudo) {
      refs(b.fontes, b.bloco !== 'lacuna')
      if (b.bloco === 'tabela' && (!b.tabela || b.tabela.cabecalhos.length < 2 || !b.tabela.linhas.length || b.tabela.linhas.some(r => r.length !== b.tabela?.cabecalhos.length))) problems.push('Tabela incompleta ou colunas incoerentes.')
    }
  }
  const stages = e.data.caso_clinico.map(s => s.etapa)
  if (stages.length !== 9 || CASE_STEPS.some(s => stages.filter(x => x === s).length !== 1)) problems.push('O caso deve conter exatamente as nove etapas previstas.')
  for (const s of e.data.caso_clinico) refs(s.fontes, !s.limitacao)
  const nodes = new Set(e.data.mapa_mental.map(n => n.id))
  if (!nodes.size || nodes.size !== e.data.mapa_mental.length) problems.push('Mapa mental vazio ou IDs repetidos.')
  for (const n of e.data.mapa_mental) {
    refs(n.fontes)
    if (n.pai !== null && !nodes.has(n.pai)) problems.push('Mapa com ramo sem origem.')
    let parent = n.pai; const seen = new Set([n.id])
    while (parent !== null) {
      if (seen.has(parent)) { problems.push('Mapa com ciclo.'); break }
      seen.add(parent); parent = e.data.mapa_mental.find(x => x.id === parent)?.pai ?? null
    }
  }
  for (const f of e.data.flashcards) { refs(f.fontes); if (!ids.has(f.aba_relacionada)) problems.push('Flashcard ligado a aba inexistente.') }
  for (const q of e.data.quiz) {
    refs(q.fontes)
    if (!ids.has(q.aba_relacionada)) problems.push('Quiz ligado a aba inexistente.')
    if (!Number.isInteger(q.correta) || q.correta < 0 || q.correta >= q.alternativas.length || q.alternativas.length < 2) problems.push('Resposta correta fora das alternativas.')
    if (q.justificativas.length !== q.alternativas.length || q.justificativas.some(j => !j.trim())) problems.push('Todas as alternativas precisam de justificação individual.')
  }
  for (const t of p.data.abas) {
    if (!e.data.quiz.some(q => q.aba_relacionada === t.id)) problems.push(`Quiz sem cobertura da aba ${t.id}.`)
  }
  for (const m of p.data.matriz) {
    refs(m.fonte ? [m.fonte] : [], m.status !== 'nao_coberto')
    if (m.abas_relacionadas.some(t => !ids.has(t))) problems.push('Matriz ligada a aba inexistente.')
    if (m.status !== 'nao_coberto' && !e.data.flashcards.some(f => f.subtema === m.subtema)) problems.push(`Flashcard em falta para ${m.subtema}.`)
  }
  return [...new Set(problems)]
}

const clean = (s: string) => s.replace(/\r/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/<[^>]*>/g, '')
const cell = (s: string) => clean(s).replace(/\|/g, '\\|').replace(/\n/g, '<br>'.replace(/<[^>]*>/g, ' '))
export function citation(source: Evidence): string { return `[Livro: ${source.title}, edição ${source.edition || 'não verificada'}, ano não verificado, ${source.locator}; trecho ${source.id}]` }
export function buildModule(title: string, state: GenerationState) {
  const p = planSchema.parse(state.plan); const e = extrasSchema.parse(state.extras)
  const refs = (ids: string[]) => ids.map(id => state.evidence.find(s => s.id === id)).filter((s): s is Evidence => Boolean(s)).map(citation).join(' ')
  const abas = state.tabs.map((tab, i) => {
    const text = ['## ' + clean(tab.titulo), ...tab.conteudo.map(b => {
      const parts = ['### ' + clean(b.titulo), clean(b.texto)]
      if (b.itens.length) parts.push(b.itens.map(x => '- ' + clean(x)).join('\n'))
      if (b.tabela) parts.push('| ' + b.tabela.cabecalhos.map(cell).join(' | ') + ' |\n| ' + b.tabela.cabecalhos.map(() => '---').join(' | ') + ' |\n' + b.tabela.linhas.map(r => '| ' + r.map(cell).join(' | ') + ' |').join('\n'))
      parts.push(refs(b.fontes)); return parts.filter(Boolean).join('\n\n')
    }), ...tab.limitacoes.map(l => 'Limitação: ' + clean(l))].join('\n\n')
    return { ...tab, tipo: 'conteudo', ordem: i + 1, objetivos: p.abas.find(a => a.id === tab.id)?.objetivos || [], fontes_consultadas: [...new Set(tab.conteudo.flatMap(b => b.fontes))], texto_copiavel_markdown: text }
  })
  const caseText = '## Caso clínico\n\n' + CASE_NOTICE + '\n\n' + CASE_STEPS.map(id => { const s = e.caso_clinico.find(x => x.etapa === id); return s ? `### ${id.replace(/_/g, ' ')}\n\n${clean(s.texto)}\n\n${refs(s.fontes)}${s.limitacao ? '\n\nLimitação: ' + clean(s.limitacao) : ''}` : '' }).join('\n\n')
  const mapText = '## Mapa mental\n\n' + e.mapa_mental.map(n => `${n.pai ? '  ' : ''}- ${clean(n.label)}${n.pai ? ' (ramo: ' + n.pai + ')' : ''} ${refs(n.fontes)}`).join('\n')
  const flashText = '## Flashcards\n\n' + e.flashcards.map(f => `P: ${clean(f.pergunta)}\n\nR: ${clean(f.resposta)} ${refs(f.fontes)}`).join('\n\n')
  const quizText = '## Quiz\n\n' + e.quiz.map((q, i) => `### ${i + 1}. ${clean(q.pergunta)}\n\n${q.alternativas.map((a, j) => `${String.fromCharCode(65+j)}. ${clean(a)}`).join('\n')}\n\nResposta: ${String.fromCharCode(65+q.correta)}\n\n${q.justificativas.map((j, k) => `${String.fromCharCode(65+k)}: ${clean(j)}`).join('\n')}\n\n${refs(q.fontes)}`).join('\n\n')
  const limits = [...new Set([...state.limitations, ...p.limitacoes, ...p.lacunas, ...e.limitacoes, ...(state.review?.pendencias || []), ...(state.review?.correcoes_necessarias || [])])]
  const traceText = '## Rastreabilidade\n\n| Subtema | Fonte | Estado | Informação |\n| --- | --- | --- | --- |\n' + p.matriz.map(m => `| ${cell(m.subtema)} | ${cell(refs(m.fonte ? [m.fonte] : []))} | ${m.status} | ${cell(m.informacao_extraida)} |`).join('\n') + '\n\n' + [...p.divergencias, ...(state.review?.divergencias || []), ...limits].map(s => '- ' + clean(s)).join('\n')
  const sourcesText = '## Referências\n\n' + state.evidence.map(s => '- ' + citation(s)).join('\n') + '\n\n' + abas.map(t => '### ' + clean(t.titulo) + '\n\n' + refs(t.fontes_consultadas)).join('\n\n')
  const full = ['# ' + clean(title), EDUCATIONAL_NOTICE, '## Objetivos\n\n' + p.objetivos.map(o => '- ' + clean(o)).join('\n') + `\n\nTempo estimado: ${p.tempo_estimado_minutos} minutos.`, ...abas.map(t => t.texto_copiavel_markdown), caseText, mapText, flashText, quizText, traceText, sourcesText].join('\n\n---\n\n')
  return {
    tema: title, versao_modulo: '3.0', aviso_educacional: EDUCATIONAL_NOTICE,
    objetivos_aprendizagem: p.objetivos, tempo_estimado_minutos: p.tempo_estimado_minutos,
    fontes_base: state.inventory.filter(b => state.evidence.some(s => s.book_id === b.id)).map(b => ({ livro: b.title, edicao: b.edition, ano: null, identificacao_verificada: false })),
    estado_validacao: { bibliografia_verificada: false, factualmente_revisado: false, cobertura_verificada: false, json_validado: validateState(state).length === 0, testes_copia_executados: false, limitacoes: limits },
    abas, fontes: state.evidence.map(({ content: _content, ...s }) => s),
    caso_clinico: { aviso: CASE_NOTICE, etapas: Object.fromEntries(CASE_STEPS.map(id => { const s = e.caso_clinico.find(x => x.etapa === id); return [id, s] })), texto_copiavel_markdown: caseText },
    mapa_mental: { nos: e.mapa_mental, texto_copiavel_markdown: mapText }, flashcards: e.flashcards, quiz: e.quiz,
    flashcards_texto_copiavel: flashText, quiz_texto_copiavel: quizText,
    rastreabilidade: { matriz_cobertura: p.matriz.map(m => { const s = state.evidence.find(x => x.id === m.fonte); return { ...m, livro: s?.title ?? 'Não localizado', edicao: s?.edition ?? null, ano: null, capitulo: null, pagina: s?.locator ?? null } }), divergencias: [...p.divergencias, ...(state.review?.divergencias || [])], lacunas: p.lacunas, limitacoes_declaradas: limits, fontes_consolidadas: state.evidence.map(citation), texto_copiavel_markdown: traceText },
    referencias_texto_copiavel: sourcesText, modulo_completo_texto_copiavel: full,
    checklist_final: { fontes_verificadas: false, citacoes_revisadas: false, cobertura_revisada: false, divergencias_revisadas: false, caso_clinico_revisado: false, flashcards_revisados: false, quiz_revisado: false, campos_copiaveis_revisados: false, json_validado: validateState(state).length === 0, acessibilidade_testada: false, responsividade_testada: false, teste_copia_executado: false, pendencias: limits },
  }
}