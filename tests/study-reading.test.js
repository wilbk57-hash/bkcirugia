import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function reading() {
  const context = { window: {} };
  runInNewContext(readFileSync(new URL('../public/study-reading.js', import.meta.url), 'utf8'), context);
  return context.window.BKStudyReading;
}

test('resolver a imagem não altera o conteúdo curado nem as suas fontes', () => {
  const section = { title: 'Classificação de Spaulding', image: 'Três círculos',
    explanation: '<ul><li>Crítico: tecido estéril</li><li>Semicrítico: mucosas</li></ul><p><em>Fonte: T-I, Cap. 28, p. 421.</em></p>' };
  const before = JSON.stringify(section);
  reading().image(section);
  assert.equal(JSON.stringify(section), before);
});

test('uma sugestão sem dados clínicos nem imagem existente não inventa um visual', () => {
  assert.equal(reading().image({ title: 'Tema futuro', image: 'Faça uma imagem', explanation: '' }), '');
});