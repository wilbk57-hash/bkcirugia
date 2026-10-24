import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('carregamento separado ignora caminhos inválidos e não repete ficheiros', () => {
  const scripts = [];
  runInNewContext(read('public/study-topic-files.js'), {
    window: { BK_TOPIC_FILES: ['choque', '../app', 'asepsia', 'choque'] },
    document: { write: script => scripts.push(script) }
  });
  assert.equal(scripts.length, 2);
  assert.equal(scripts[0], '<script src="/temas/choque.js"></script>');
  assert.equal(scripts[1], '<script src="/temas/asepsia.js"></script>');
});

test('um ficheiro com erro não impede Asepsia e os espaços vazios preservam temas existentes', () => {
  const context = { window: {} };
  runInNewContext(read('public/temas/lista.js'), context);
  let failures = 0;
  for (const id of context.window.BK_TOPIC_FILES) {
    try { runInNewContext(id === 'choque' ? 'window.BK_CONTENT[ = {' : read(`public/temas/${id}.js`), context); }
    catch { failures++; }
  }
  assert.equal(failures, 1);
  assert.equal(context.window.BK_CONTENT.asepsia.topic.tabs.length, 12);
  assert.equal(Object.keys(context.window.BK_CONTENT.asepsia.terms).length, 23);
  assert.deepEqual(Object.keys(context.window.BK_CONTENT), ['asepsia']);
});