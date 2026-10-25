import { test } from 'node:test'
import assert from 'node:assert/strict'
import { runInNewContext } from 'node:vm'
import { readFileSync } from 'node:fs'
import { buildModule, validateState, CASE_STEPS, type GenerationState } from '../src/lib/study-generation/contract'

function fixture(): GenerationState {
  return { priorities:'', edition_preference:'', inventory:[], queries:[], research_log:[], limitations:['Paginação impressa não verificada.'],
    evidence:[{id:'s1',book_id:'b1',title:'Livro disponível',edition:null,locator:'posição PDF 8',content:'Fonte clínica'}],
    plan:{objetivos:['Conceito'],tempo_estimado_minutos:10,abas:[{id:'conceito',titulo:'Conceito',objetivos:[],fontes:['s1']}],matriz:[{subtema:'Conceito',fonte:'s1',informacao_extraida:'Síntese',status:'coberto',abas_relacionadas:['conceito']}],lacunas:[],divergencias:[],limitacoes:[]},
    tabs:[{id:'conceito',titulo:'Conceito',conteudo:[{id:'b1',bloco:'tabela',tipo_visual:'conceito',titulo:'Tabela',texto:'Síntese',itens:[],tabela:{cabecalhos:['A','B'],linhas:[['1','2']]},fontes:['s1']}],limitacoes:[]}],
    extras:{caso_clinico:CASE_STEPS.map(etapa=>({etapa,texto:'Dado fictício fundamentado',fontes:['s1'],limitacao:null})),mapa_mental:[{id:'root',label:'Conceito',pai:null,fontes:['s1']}],flashcards:[{id:'f1',pergunta:'P?',resposta:'R',subtema:'Conceito',aba_relacionada:'conceito',fontes:['s1']}],quiz:[{id:'q1',pergunta:'P?',alternativas:['A','B'],correta:0,justificativas:['Correta','Incorreta'],aba_relacionada:'conceito',fontes:['s1']}],limitacoes:[]},
    review:{pendencias:[],divergencias:[],correcoes_necessarias:[]},
  }
}
test('um módulo completo aceita exatamente nove etapas clínicas',()=>{const s=fixture();assert.deepEqual(validateState(s),[]);s.extras?.caso_clinico.pop();assert.ok(validateState(s).some(p=>p.includes('nove etapas')))})
test('fontes plausíveis mas não recuperadas são rejeitadas',()=>{const s=fixture();const block=s.tabs[0]?.conteudo[0];if(!block)throw Error('fixture');block.fontes=['inventada'];assert.ok(validateState(s).some(p=>p.includes('Referência inexistente')))})
test('resposta correta é índice zero e nunca pode sair das alternativas',()=>{const s=fixture();const q=s.extras?.quiz[0];if(!q)throw Error('fixture');q.correta=2;assert.ok(validateState(s).some(p=>p.includes('fora das alternativas')))})
test('cada alternativa exige a sua própria justificação',()=>{const s=fixture();s.extras?.quiz[0]?.justificativas.pop();assert.ok(validateState(s).some(p=>p.includes('justificação individual')))})
test('um flashcard por subtema coberto é obrigatório',()=>{const s=fixture();if(s.extras)s.extras.flashcards=[];assert.ok(validateState(s).some(p=>p.includes('Flashcard em falta')))})
test('quiz cobre cada aba avaliável',()=>{const s=fixture();if(s.extras)s.extras.quiz=[];assert.ok(validateState(s).some(p=>p.includes('Quiz sem cobertura')))})
test('as validações médicas não podem ser afirmadas pelo modelo',()=>{const module=buildModule('Tema',fixture());assert.equal(module.estado_validacao.factualmente_revisado,false);assert.equal(module.estado_validacao.bibliografia_verificada,false);assert.equal(module.checklist_final.teste_copia_executado,false);assert.equal(module.estado_validacao.json_validado,true)})
test('exportação mantém tabela, nove etapas, quiz e referências sem HTML',()=>{const module=buildModule('Tema',fixture());const text=module.modulo_completo_texto_copiavel;assert.ok(text.includes('| A | B |'));for(const id of CASE_STEPS)assert.ok(text.includes(id.replace(/_/g,' ')));assert.ok(text.includes('B: Incorreta'));assert.ok(text.includes('posição PDF 8'));assert.equal(/<[^>]+>/.test(text),false);assert.ok(text.indexOf('## Caso clínico')<text.indexOf('## Flashcards'));assert.ok(text.indexOf('## Quiz')<text.indexOf('## Referências'))})
test('mapas com ciclos são rejeitados',()=>{const s=fixture();const root=s.extras?.mapa_mental[0];if(!root)throw Error('fixture');root.pai='root';assert.ok(validateState(s).some(p=>p.includes('ciclo')))})
test('renderizador trata HTML da IA como texto e não como instruções',()=>{const context={window:{}} as {window:{BKGeneratedStudy?:{views:(m:unknown)=>Array<{html:string}>}}};runInNewContext(readFileSync(new URL('../public/study-generated.js',import.meta.url),'utf8'),context);const m=buildModule('<img src=x onerror=alert(1)>',fixture());const html=context.window.BKGeneratedStudy?.views(m)[0]?.html;assert.ok(html?.includes('&lt;img'));assert.equal(html?.includes('<img src=x'),false)})