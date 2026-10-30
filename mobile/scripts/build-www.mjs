// Monta mobile/www a partir de public/ para o Capacitor.
// Não altera nada em public/: trabalha numa cópia.
//  - embute as bibliotecas que hoje vêm de CDN (funcionam offline);
//  - embute as fontes do Google;
//  - injeta o mobile-shim.js (API publicada, links externos, botão voltar);
//  - ajusta 2 trechos do app.html que não funcionam fora de um navegador comum.
  const report = {};
  const appFiles = ['app.html', 'library-reader.js', 'tutor-memory.js'];
  for (const dir of ['js', 'css']) {
    if (existsSync(path.join(www, dir))) for (const f of await readdir(path.join(www, dir))) appFiles.push(dir + '/' + f);
  }
  for (const name of appFiles) {
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEFAULT_API_BASE = 'https://project--b951eaff-f66b-4dd3-896d-302004fcc7f8.lovable.app';

const CDN = 'https://cdn.jsdelivr.net/npm/';
export const RULES = [
  { id: 'fontes do Google', find: /@import url\('https:\/\/fonts\.googleapis\.com\/css2[^']*'\);/g, to: "@import url('/fonts.css');" },
  { id: 'supabase-js', find: CDN + '@supabase/supabase-js@2/dist/umd/supabase.js', to: '/vendor/supabase.js' },
  { id: 'pdf.js', find: CDN + 'pdfjs-dist@3.11.174/build/pdf.min.js', to: '/vendor/pdf.min.js' },
  { id: 'pdf.js worker', find: CDN + 'pdfjs-dist@3.11.174/build/pdf.worker.min.js', to: '/vendor/pdf.worker.min.js' },
  { id: 'jszip', find: CDN + 'jszip@3.10.1/dist/jszip.min.js', to: '/vendor/jszip.min.js' },
  { id: 'epub.js', find: CDN + 'epubjs@0.3.93/dist/epub.min.js', to: '/vendor/epub.min.js' },
  {
    id: 'login social',
    find: "if (window.parent === window) { window.location.href = '/app'; return; }",
    to: "if (window.parent === window) { if (window.BK_NATIVE) { window.BK_NATIVE_OAUTH(provider); return; } window.location.href = '/app'; return; }",
  },
  {
    id: 'recuperar senha',
    find: "redirectTo: window.location.href.split('#')[0]",
    to: "redirectTo: (window.BK_WEB_URL || window.location.href.split('#')[0])",
  },
];

export function patchText(text) {
  const counts = {};
  for (const rule of RULES) {
    if (typeof rule.find === 'string') {
      const parts = text.split(rule.find);
      if (parts.length > 1) { counts[rule.id] = parts.length - 1; text = parts.join(rule.to); }
    } else {
      const found = text.match(rule.find);
      if (found) { counts[rule.id] = found.length; text = text.replace(rule.find, () => rule.to); }
    }
  }
  return { text, counts };
}

export function injectShim(html) {
  if (!html.includes('<head>')) throw new Error('app.html sem <head>: não foi possível injetar o mobile-shim.js');
  return html.replace('<head>', () => '<head>\n<script src="/mobile-shim.js"></script>');
}

async function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const mobile = path.resolve(here, '..');
  const repo = path.resolve(mobile, '..');
  const pub = path.join(repo, 'public');
  const www = path.join(mobile, 'www');
  const nm = path.join(mobile, 'node_modules');
  const apiBase = (process.env.BK_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, '');

  if (!existsSync(path.join(pub, 'app.html'))) throw new Error('public/app.html não encontrado. Rode a partir da raiz do repositório do projeto.');
  const need = (p) => { if (!existsSync(p)) throw new Error('Arquivo ausente (npm install rodou?): ' + p); return p; };

  await rm(www, { recursive: true, force: true });
  await mkdir(www, { recursive: true });

  // 1. Cópia de public/ (sem páginas de SEO).
  const skip = new Set(['resumos', 'robots.txt', 'sitemap.xml']);
  await cp(pub, www, { recursive: true, filter: (src) => !skip.has(path.relative(pub, src).split(path.sep)[0]) });

  // 2. Bibliotecas locais.
  await mkdir(path.join(www, 'vendor'), { recursive: true });
  const vendor = [
    ['@supabase/supabase-js/dist/umd/supabase.js', 'supabase.js'],
    ['pdfjs-dist/build/pdf.min.js', 'pdf.min.js'],
    ['pdfjs-dist/build/pdf.worker.min.js', 'pdf.worker.min.js'],
    ['jszip/dist/jszip.min.js', 'jszip.min.js'],
    ['epubjs/dist/epub.min.js', 'epub.min.js'],
  ];
  for (const [from, to] of vendor) await cp(need(path.join(nm, from)), path.join(www, 'vendor', to));

  // 3. Fontes locais (subconjunto latino cobre português, inglês e espanhol).
  const fonts = [
    ['inter', 'Inter', [400, 500, 600, 700]],
    ['space-grotesk', 'Space Grotesk', [500, 600, 700]],
    ['ibm-plex-mono', 'IBM Plex Mono', [500, 600]],
  ];
  await mkdir(path.join(www, 'fonts'), { recursive: true });
  let css = '';
  for (const [slug, family, weights] of fonts) {
    for (const w of weights) {
      const file = `${slug}-latin-${w}-normal.woff2`;
      await cp(need(path.join(nm, '@fontsource', slug, 'files', file)), path.join(www, 'fonts', file));
      css += `@font-face{font-family:'${family}';font-style:normal;font-weight:${w};font-display:swap;src:url('/fonts/${file}') format('woff2');}\n`;
    }
  }
  await writeFile(path.join(www, 'fonts.css'), css);

  // 4. Ajustes nos arquivos do app.
  const report = {};
  for (const name of ['app.html', 'library-reader.js', 'tutor-memory.js']) {
    const file = path.join(www, name);
    if (!existsSync(file)) continue;
    const { text, counts } = patchText(await readFile(file, 'utf8'));
    report[name] = counts;
    await writeFile(file, name === 'app.html' ? injectShim(text) : text);
  }

  // 5. Nada pode continuar apontando para fora (senão não funciona offline).
   for (const name of appFiles.filter((n) => n !== 'tutor-memory.js')) {
    const text = await readFile(path.join(www, name), 'utf8');
    const left = text.match(/cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/g);
    if (left) throw new Error(`${name} ainda referencia ${[...new Set(left)].join(', ')}. O app mudou; atualize as regras em build-www.mjs.`);
  }
  for (const id of ['login social', 'recuperar senha', 'supabase-js']) {
    if (!Object.values(report).some((c) => c[id])) throw

  // 6. Shim + entrada do Capacitor (index.html).
  const shim = await readFile(path.join(mobile, 'www-extra', 'mobile-shim.js'), 'utf8');
  const config = `window.BK_API_BASE=${JSON.stringify(apiBase)};window.BK_WEB_URL=${JSON.stringify(apiBase + '/app.html')};\n`;
  await writeFile(path.join(www, 'mobile-shim.js'), config + shim);
  await cp(path.join(www, 'app.html'), path.join(www, 'index.html'));
  await rm(path.join(www, 'app.html'));

  console.log('API publicada:', apiBase);
  console.log('Trocas feitas:', JSON.stringify(report, null, 2));
  console.log('www pronto em', www);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error('ERRO:', error.message); process.exit(1); });
}
