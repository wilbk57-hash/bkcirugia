import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function setup() {
  const context = { window: {} };
  runInNewContext(readFileSync(new URL('../public/study-topics-loader.js', import.meta.url), 'utf8'), context);
  return context.window.BKStudyTopics.apply;
}
function entry(id = 'asepsia') {
  return { topic: { id, title: 'Asepsia', eyebrow: 'Tema III', sub: 'Introdução', tags: [], stats: [],
    tabs: [{ id: 'inicio', label: 'Início', type: 'hero' }] }, terms: {} };
}
function catalog() { return [{ n: 'III', title: 'Procedimentos', subs: [{ id: 'asepsia', title: 'Asepsia', status: 'soon' }] }]; }

test('tema completo torna o subtema pronto sem modificar temas antigos e integra termos', () => {
  const old = { title: 'Pré-operatório' };
  const topics = { 'pre-operatorio': old };
  const terms = { antigo: { name: 'Antigo' } };
  const data = entry();
  data.terms.assepsia = { name: 'Assepsia', defSimple: 'A', defAcademic: 'B', example: 'C' };
  const groups = catalog();
  assert.equal(setup()({ asepsia: data }, topics, terms, groups).loaded.length, 1);
  assert.equal(topics.asepsia, data.topic);
  assert.equal(topics['pre-operatorio'], old);
  assert.equal(terms.assepsia, data.terms.assepsia);
  assert.equal(terms.antigo.name, 'Antigo');
  assert.equal(groups[0].subs[0].status, 'ready');
});

test('tema incompleto não fica pronto nem impede outro tema completo', () => {
  const groups = catalog();
  groups[0].subs.push({ id: 'outro', status: 'soon' });
  const topics = {};
  setup()({ asepsia: { topic: { id: 'asepsia' } }, outro: entry('outro') }, topics, {}, groups);
  assert.equal(groups[0].subs[0].status, 'soon');
  assert.equal(topics.asepsia, undefined);
  assert.equal(groups[0].subs[1].status, 'ready');
});

test('subtema novo exige posição explícita e não duplica ao aplicar novamente', () => {
  const apply = setup();
  const groups = catalog();
  const data = entry('novo');
  const topics = {};
  assert.equal(apply({ novo: data }, topics, {}, groups).rejected.length, 1);
  data.catalog = { n: 'III', title: 'Procedimentos' };
  apply({ novo: data }, topics, {}, groups);
  apply({ novo: data }, topics, {}, groups);
  assert.equal(groups[0].subs.filter(sub => sub.id === 'novo').length, 1);
  assert.equal(topics.novo, data.topic);
});

test('módulo das quatro partes de Asepsia mantém todas as abas e termos ao integrar', () => {
  const context = { window: {} };
  for (const part of [1, 2, 3, 4]) runInNewContext(readFileSync(new URL(`../public/topic-asepsia-${part}.js`, import.meta.url), 'utf8'), context);
  const parts = context.window.BK_CONTENT_PARTS;
  const data = { topic: { ...parts[0].topic, tabs: parts.flatMap(part => part.topic.tabs) },
    terms: Object.assign({}, ...parts.map(part => part.terms)) };
  const topics = {};
  const terms = {};
  const result = setup()({ asepsia: data }, topics, terms, catalog());
  assert.equal(result.loaded.length, 1);
  assert.equal(topics.asepsia.tabs.length, 12);
  assert.equal(Object.keys(terms).length, 23);
});

test('IDs incompatíveis e respostas de quiz fora das opções são rejeitados', () => {
  const apply = setup();
  const bad = entry();
  bad.topic.id = 'outro';
  assert.equal(apply({ asepsia: bad }, {}, {}, catalog()).loaded.length, 0);
  const quiz = entry();
  quiz.topic.tabs.push({ id: 'quiz', label: 'Quiz', type: 'quiz', questions: [{ q: 'Q', options: ['A', 'B'], correct: 2, explain: 'E' }] });
  assert.equal(apply({ asepsia: quiz }, {}, {}, catalog()).loaded.length, 0);
});