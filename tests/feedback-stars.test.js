import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function extract(name) {
  const html = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');
  const re = new RegExp(`function ${name}\\(.*?\\n\\}`, 's');
  const m = html.match(re);
  if (!m) throw new Error(`function ${name} not found`);
  return m[0];
}

function fbBody() {
  const sandbox = { Math, Number, escapeHtml: undefined };
  runInNewContext(`${extract('escapeHtml')}\n${extract('fbBodyHtml')}`, sandbox);
  return sandbox.fbBodyHtml;
}

const starsHtml = html => {
  const m = html.match(/★(.*?)☆/);
  return [...html.matchAll(/★|☆/g)].length;
};

test('fbBodyHtml não lança erro com stars fora do intervalo', () => {
  const fn = fbBody();
  for (const stars of [100, -3, 'x', null, undefined]) {
    const html = fn({ event: 'app_rating', detail: { stars } });
    assert.equal([...html.matchAll(/★|☆/g)].length, 5, `stars=${String(stars)}`);
  }
});

test('fbBodyHtml com stars válidas mantém a contagem de 5 símbolos', () => {
  const fn = fbBody();
  const html = fn({ event: 'app_rating', detail: { stars: 4 } });
  assert.equal([...html.matchAll(/★|☆/g)].length, 5);
  assert.equal((html.match(/★/g) || []).length, 4);
  assert.equal((html.match(/☆/g) || []).length, 1);
});

test('fbBodyHtml mantém o texto do feedback escapado', () => {
  const fn = fbBody();
  const html = fn({ event: 'feedback_bug', detail: { text: '<b>x</b>' } });
  assert.ok(html.includes('&lt;b&gt;'));
});
