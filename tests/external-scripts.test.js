import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');
const start = html.indexOf('function myLibLoadScript(');
const end = html.indexOf('async function myLibOpenReader(', start);

function loader() {
  const scripts = [];
  const context = { document: {
    querySelector: () => null,
    createElement: () => ({ dataset: {} }),
    head: { appendChild: script => scripts.push(script) },
  } };
  runInNewContext(html.slice(start, end), context);
  return { load: context.myLibLoadScript, scripts };
}

test('dynamic scripts apply the supplied integrity and anonymous CORS before loading', async () => {
  const { load, scripts } = loader();
  const pending = load('https://cdn.example/script.js', 'sha384-real-hash');
  assert.equal(scripts[0].integrity, 'sha384-real-hash');
  assert.equal(scripts[0].crossOrigin, 'anonymous');
  scripts[0].onload();
  await pending;
});

test('a blocked dynamic dependency rejects instead of leaving its caller waiting', async () => {
  const { load, scripts } = loader();
  const pending = load('https://cdn.example/script.js', 'sha384-real-hash');
  scripts[0].onerror();
  await assert.rejects(pending, { message: 'load_fail' });
});