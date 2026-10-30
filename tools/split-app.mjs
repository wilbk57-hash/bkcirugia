#!/usr/bin/env node
// tools/split-app.mjs — separa public/app.html em ficheiros por área, SEM reescrever código.
//
//   node tools/split-app.mjs           simulação (não escreve nada, só verifica)
//   node tools/split-app.mjs --write   aplica
//
// Como funciona: corta o <script> grande nas linhas de cabeçalho de cada secção
// (ex.: "TUTOR DE IA — chat com a API da Anthropic"), na MESMA ordem em que o código
// já corria. Cada ficheiro é um <script src> clássico, por isso as funções globais,
// os onclick="..." e as variáveis de topo continuam a funcionar como antes.
// Antes de escrever, o script prova que (1) cada pedaço tem sintaxe válida e
// (2) reconstruir o app.html a partir dos ficheiros devolve o original byte a byte.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');
const fail = (m) => { console.error('\nERRO: ' + m); process.exit(1); };

const appPath = path.join(root, 'public', 'app.html');
const html = readFileSync(appPath, 'utf8');
if (/<script src="\/js\/\d\d-/.test(html)) fail('public/app.html já foi dividido.');

// ---------- onde cortar (por ordem de execução) ----------
const MAIN = [
  { file: '01-temas-indice' },
  { file: '02-glossario',               title: 'GLOSSÁRIO DE TERMOS TÉCNICOS (PEDAGOGICAL ENGINE)' },
  { file: '03-explicar-selecao',        title: 'SELECT-TO-EXPLAIN — glossário instantâneo por seleção de texto' },
  { file: '04-temas-embutidos',         line: 'const TOPIC_PREOP = {' },
  { file: '05-pesquisa',                title: 'PESQUISA GLOBAL — índice + engine' },
  { file: '06-tutor',                   title: 'TUTOR DE IA — chat com a API da Anthropic' },
  { file: '07-i18n',                    title: 'I18N — pt / en / es' },
  { file: '08-definicoes-progresso',    title: 'SETTINGS — state, data model, engine' },
  { file: '09-estudo-ui',               title: 'RENDER: HOME' },
  { file: '10-auth',                    title: 'AUTH SYSTEM' },
  { file: '11-biblioteca',              title: 'MINHA BIBLIOTECA — upload de livros pelo estudante' },
  { file: '12-pwa-instalacao',          line: '/* ---- REGISTO DE INSTALAÇÕES (PWA) ---- */' },
  { file: '13-admin',                   line: '/* ---- ADMIN DASHBOARD (post-login) ---- */' },
  { file: '14-chat',                    line: '/* ---------- Conversas diretas aluno <-> admin ---------- */' },
  { file: '15-inicio-progresso-agenda', title: 'INIT' },
  { file: '16-boot',                    line: '/* ---- BOOT ----' },
];
const PUSH = [{ file: '17-push-lembretes' }];
const MM = [
  { file: '18-mapa-mental' },
  { file: '19-casos-clinicos', title: 'CASOS CLÍNICOS SIMULADOS (MÓDULO IA)' },
];

// ---------- localizar os blocos inline ----------
function only(re, test, what) {
  const hits = [...html.matchAll(re)].filter((m) => test(m[1]));
  if (hits.length !== 1) fail(`esperava 1 bloco "${what}" no app.html e encontrei ${hits.length}.`);
  return hits[0];
}
const blocks = [
  { kind: 'script', m: only(/<script>([\s\S]*?)<\/script>/g, (s) => s.includes('const TEMAS = ['), 'script principal'), parts: MAIN },
  { kind: 'script', m: only(/<script>([\s\S]*?)<\/script>/g, (s) => s.includes('VAPID_PUBLIC_KEY'), 'push'), parts: PUSH },
  { kind: 'script', m: only(/<script>([\s\S]*?)<\/script>/g, (s) => s.includes('const MM_STORAGE'), 'mapa mental'), parts: MM },
  { kind: 'style',  m: only(/<style>([\s\S]*?)<\/style>/g, (s) => s.length > 50000, 'style'), parts: [{ file: 'app' }] },
];

function findCut(code, spec, file) {
  const lines = code.split('\n');
  let off = 0;
  const offs = lines.map((l) => { const o = off; off += l.length + 1; return o; });
  const hits = [];
  lines.forEach((l, i) => {
    if (spec.title !== undefined) {
      if (l.trim() === spec.title && i > 0 && lines[i - 1].startsWith('/* ====')) hits.push(offs[i - 1]);
    } else if (l.startsWith(spec.line)) hits.push(offs[i]);
  });
  if (hits.length !== 1) fail(`âncora de ${file}: esperava 1 ocorrência e encontrei ${hits.length}. O app mudou — ajusta a lista MAIN no topo deste script.`);
  return hits[0];
}
function slice(code, parts) {
  const cuts = parts.map((p, i) => (i === 0 ? 0 : findCut(code, p, p.file)));
  cuts.forEach((c, i) => { if (i > 0 && c <= cuts[i - 1]) fail(`ordem das âncoras inválida em ${parts[i].file}`); });
  return parts.map((p, i) => ({ file: p.file, text: code.slice(cuts[i], i + 1 < cuts.length ? cuts[i + 1] : code.length) }));
}

// ---------- gerar ----------
const out = [];
let newHtml = html;
const expand = new Map();
for (const b of blocks) {
  const ext = b.kind === 'style' ? 'css' : 'js';
  const dir = ext;
  const chunks = slice(b.m[1], b.parts);
  if (chunks.map((c) => c.text).join('') !== b.m[1]) fail('os pedaços não reconstroem o bloco ' + b.parts[0].file);
  const tags = chunks.map((c) => {
    const v = createHash('sha1').update(c.text).digest('hex').slice(0, 8);
    const url = `/${dir}/${c.file}.${ext}?v=${v}`;
    out.push({ rel: `public/${dir}/${c.file}.${ext}`, text: c.text, kind: b.kind });
    return b.kind === 'style' ? `<link rel="stylesheet" href="${url}">` : `<script src="${url}"></script>`;
  });
  const replacement = tags.join('\n');
  expand.set(replacement, b.kind === 'style' ? `<style>${b.m[1]}</style>` : `<script>${b.m[1]}</script>`);
  if (newHtml.split(b.m[0]).length !== 2) fail('bloco duplicado no HTML: ' + b.parts[0].file);
  newHtml = newHtml.replace(b.m[0], () => replacement);
}

// ---------- provas ----------
let rebuilt = newHtml;
for (const [tagText, original] of expand) rebuilt = rebuilt.replace(tagText, () => original);
if (rebuilt !== html) fail('prova falhou: reconstruir o app.html a partir dos ficheiros NÃO devolve o original.');
for (const f of out.filter((o) => o.kind === 'script')) {
  try { new vm.Script(f.text, { filename: f.rel }); }
  catch (e) { fail(`${f.rel} não tem sintaxe válida isolada (${e.message}). O corte caiu a meio de uma construção.`); }
}

console.log(`app.html: ${(html.length / 1024) | 0} KB -> ${(newHtml.length / 1024) | 0} KB\n`);
for (const f of out) console.log(`  ${f.rel.padEnd(46)} ${String((f.text.length / 1024) | 0).padStart(4)} KB  ${f.text.split('\n').length} linhas`);
console.log('\nProvas OK: sintaxe de cada ficheiro + reconstrução byte a byte do app.html original.');

// ---------- edições auxiliares (testes, build mobile, cache offline) ----------
const edits = [];
function edit(file, find, replace, why) { edits.push({ file, find, replace, why }); }

edit('vite.config.ts',
  String.raw`/^(\/icons\/|\/temas\/`,
  String.raw`/^(\/icons\/|\/js\/[0-9a-z-]+\.js$|\/css\/[0-9a-z-]+\.css$|\/temas\/`,
  'cache offline (NetworkFirst) também para js/ e css/');

edit('mobile/scripts/build-www.mjs',
  "import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';",
  "import { cp, mkdir, readFile, readdir, writeFile, rm } from 'node:fs/promises';",
  'build mobile: ler js/ e css/');
edit('mobile/scripts/build-www.mjs',
  ["  const report = {};", "  for (const name of ['app.html', 'library-reader.js', 'tutor-memory.js']) {"].join('\n'),
  ["  const report = {};",
   "  const appFiles = ['app.html', 'library-reader.js', 'tutor-memory.js'];",
   "  for (const dir of ['js', 'css']) {",
   "    if (existsSync(path.join(www, dir))) for (const f of await readdir(path.join(www, dir))) appFiles.push(dir + '/' + f);",
   "  }",
   "  for (const name of appFiles) {"].join('\n'),
  'build mobile: aplicar as trocas também nos novos ficheiros');
edit('mobile/scripts/build-www.mjs',
  "  for (const name of ['app.html', 'library-reader.js']) {",
  "  for (const name of appFiles.filter((n) => n !== 'tutor-memory.js')) {",
  'build mobile: verificar CDN em todos os ficheiros');
edit('mobile/scripts/build-www.mjs',
  "if (!report['app.html'][id]) throw",
  "if (!Object.values(report).some((c) => c[id])) throw",
  'build mobile: regra pode estar em qualquer ficheiro');

const helper = [
  "// Devolve o app.html com <script src=\"/js/..\"> e <link href=\"/css/..\"> expandidos de volta,",
  "// para os testes que procuram funções pelo texto continuarem a funcionar sem mudanças.",
  "import { readFileSync } from 'node:fs';",
  "const pub = new URL('../../public/', import.meta.url);",
  "const read = (p) => readFileSync(new URL(p, pub), 'utf8');",
  "export function readAppSource() {",
  "  let html = read('app.html');",
  "  html = html.replace(/<link rel=\"stylesheet\" href=\"\\/(css\\/[^\"?]+)(?:\\?[^\"]*)?\">/g, (_, p) => '<style>' + read(p) + '</style>');",
  "  html = html.replace(/(?:<script src=\"\\/js\\/[^\"]+\"><\\/script>\\s*)+/g, (run) =>",
  "    '<script>' + [...run.matchAll(/src=\"\\/(js\\/[^\"?]+)/g)].map((m) => read(m[1])).join('') + '</script>\\n');",
  "  return html;",
  "}",
  ""].join('\n');

if (!WRITE) {
  console.log('\nSimulação concluída. Para aplicar:  node tools/split-app.mjs --write');
  process.exit(0);
}

// ---------- escrever ----------
for (const f of out) {
  const abs = path.join(root, f.rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, f.text);
}
writeFileSync(appPath, newHtml);
mkdirSync(path.join(root, 'tests', 'helpers'), { recursive: true });
writeFileSync(path.join(root, 'tests', 'helpers', 'app-source.js'), helper);

console.log('\nEdições auxiliares:');
for (const e of edits) {
  const abs = path.join(root, e.file);
  if (!existsSync(abs)) { console.log(`  ✗ ${e.file} não existe — ${e.why}`); continue; }
  const src = readFileSync(abs, 'utf8');
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.log(`  ✗ ${e.file}: não apliquei (${n} ocorrências) — ${e.why}. Faz à mão.`); continue; }
  writeFileSync(abs, src.replace(e.find, () => e.replace));
  console.log(`  ✓ ${e.file}: ${e.why}`);
}

const testsDir = path.join(root, 'tests');
const re = /readFileSync\(\s*new URL\('\.\.\/public\/app\.html', import\.meta\.url\)\s*,\s*'utf8'\s*\)/g;
for (const name of existsSync(testsDir) ? readdirSync(testsDir) : []) {
  if (!/\.test\.[jt]s$/.test(name)) continue;
  const p = path.join(testsDir, name);
  const src = readFileSync(p, 'utf8');
  if (!src.includes('app.html')) continue;
  const next = src.replace(re, 'readAppSource()');
  if (next !== src) {
    const imp = "import { readAppSource } from './helpers/app-source.js';";
    const lastImport = [...next.matchAll(/^import .*;\s*$/gm)].pop();
    const at = lastImport ? lastImport.index + lastImport[0].length : 0;
    writeFileSync(p, next.slice(0, at) + '\n' + imp + next.slice(at));
    console.log(`  ✓ tests/${name}: passa a usar readAppSource()`);
  }
  if (readFileSync(p, 'utf8').replace(/readAppSource\(\)/g, '').includes('app.html'))
    console.log(`  ! tests/${name}: ainda menciona app.html — confirma à mão`);
}
console.log('\nPronto. Corre os testes e abre a app antes de fazer commit.');
