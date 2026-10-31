
// Monta mobile/www a partir de public/ para o Capacitor.
// Não altera nada em public/: trabalha numa cópia.
// - embute as bibliotecas que hoje vêm de CDN;
// - embute as fontes do Google;
// - injeta o mobile-shim.js;
// - ajusta trechos do app.html para o ambiente móvel.

import { existsSync } from 'node:fs';
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEFAULT_API_BASE =
  'https://project--b951eaff-f66b-4dd3-896d-302004fcc7f8.lovable.app';

const CDN = 'https://cdn.jsdelivr.net/npm/';

export const RULES = [
  {
    id: 'fontes do Google',
    find: /@import url\('https:\/\/fonts\.googleapis\.com\/css2[^']*'\);/g,
    to: "@import url('/fonts.css');",
  },
  {
    id: 'supabase-js',
    find: CDN + '@supabase/supabase-js@2/dist/umd/supabase.js',
    to: '/vendor/supabase.js',
  },
  {
    id: 'pdf.js',
    find: CDN + 'pdfjs-dist@3.11.174/build/pdf.min.js',
    to: '/vendor/pdf.min.js',
  },
  {
    id: 'pdf.js worker',
    find: CDN + 'pdfjs-dist@3.11.174/build/pdf.worker.min.js',
    to: '/vendor/pdf.worker.min.js',
  },
  {
    id: 'jszip',
    find: CDN + 'jszip@3.10.1/dist/jszip.min.js',
    to: '/vendor/jszip.min.js',
  },
  {
    id: 'epub.js',
    find: CDN + 'epubjs@0.3.93/dist/epub.min.js',
    to: '/vendor/epub.min.js',
  },
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

export function patchText(source) {
  let text = source;
  const counts = {};

  for (const rule of RULES) {
    if (typeof rule.find === 'string') {
      const parts = text.split(rule.find);
      const count = parts.length - 1;

      if (count > 0) {
        counts[rule.id] = count;
        text = parts.join(rule.to);
      }
    } else {
      const found = text.match(rule.find);

      if (found) {
        counts[rule.id] = found.length;
        text = text.replace(rule.find, () => rule.to);
      }
    }
  }

  return { text, counts };
}

export function injectShim(html) {
  if (!html.includes('<head>')) {
    throw new Error(
      'app.html sem <head>: não foi possível injetar o mobile-shim.js',
    );
  }

  if (html.includes('<script src="/mobile-shim.js"></script>')) {
    return html;
  }

  return html.replace(
    '<head>',
    '<head>\n<script src="/mobile-shim.js"></script>',
  );
}

// Recolhe ficheiros de uma pasta, incluindo subpastas.
async function collectFiles(directory, baseDirectory = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolutePath, baseDirectory));
    } else if (entry.isFile()) {
      files.push(path.relative(baseDirectory, absolutePath));
    }
  }

  return files;
}

async function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const mobile = path.resolve(here, '..');
  const repo = path.resolve(mobile, '..');
  const pub = path.join(repo, 'public');
  const www = path.join(mobile, 'www');
  const nm = path.join(mobile, 'node_modules');

  const apiBase = (
    process.env.BK_API_BASE || DEFAULT_API_BASE
  ).replace(/\/+$/, '');

  if (!existsSync(path.join(pub, 'app.html'))) {
    throw new Error(
      'public/app.html não encontrado. Rode a partir da raiz do repositório.',
    );
  }

  const need = (filePath) => {
    if (!existsSync(filePath)) {
      throw new Error(
        'Arquivo ausente (verifique se npm install foi executado): ' + filePath,
      );
    }

    return filePath;
  };

  // 1. Limpa e recria a pasta de destino.
  await rm(www, { recursive: true, force: true });
  await mkdir(www, { recursive: true });

  // 2. Copia public/ sem páginas de SEO.
  const skip = new Set(['resumos', 'robots.txt', 'sitemap.xml']);

  await cp(pub, www, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(pub, source);
      const firstPart = relative.split(path.sep)[0];

      return !skip.has(firstPart);
    },
  });

  // 3. Copia as bibliotecas para uso offline.
  await mkdir(path.join(www, 'vendor'), { recursive: true });

  const vendor = [
    ['@supabase/supabase-js/dist/umd/supabase.js', 'supabase.js'],
    ['pdfjs-dist/build/pdf.min.js', 'pdf.min.js'],
    ['pdfjs-dist/build/pdf.worker.min.js', 'pdf.worker.min.js'],
    ['jszip/dist/jszip.min.js', 'jszip.min.js'],
    ['epubjs/dist/epub.min.js', 'epub.min.js'],
  ];

  for (const [from, to] of vendor) {
    await cp(
      need(path.join(nm, from)),
      path.join(www, 'vendor', to),
    );
  }

  // 4. Copia as fontes para uso offline.
  const fonts = [
    ['inter', 'Inter', [400, 500, 600, 700]],
    ['space-grotesk', 'Space Grotesk', [500, 600, 700]],
    ['ibm-plex-mono', 'IBM Plex Mono', [500, 600]],
  ];

  await mkdir(path.join(www, 'fonts'), { recursive: true });

  let fontCss = '';

  for (const [slug, family, weights] of fonts) {
    for (const weight of weights) {
      const file = `${slug}-latin-${weight}-normal.woff2`;

      await cp(
        need(path.join(nm, '@fontsource', slug, 'files', file)),
        path.join(www, 'fonts', file),
      );

      fontCss +=
        `@font-face{font-family:'${family}';` +
        `font-style:normal;font-weight:${weight};` +
        `font-display:swap;src:url('/fonts/${file}') format('woff2');}\n`;
    }
  }

  await writeFile(path.join(www, 'fonts.css'), fontCss);

  // 5. Identifica todos os ficheiros relevantes.
  const appFiles = new Set([
    'app.html',
    'library-reader.js',
    'tutor-memory.js',
  ]);

  for (const directory of ['js', 'css']) {
    const absoluteDirectory = path.join(www, directory);

    if (existsSync(absoluteDirectory)) {
      const files = await collectFiles(absoluteDirectory);

      for (const file of files) {
        appFiles.add(path.posix.join(directory, file.split(path.sep).join('/')));
      }
    }
  }

  // 6. Aplica as substituições necessárias.
  const report = {};

  for (const name of appFiles) {
    const file = path.join(www, name);

    if (!existsSync(file)) {
      continue;
    }

    const source = await readFile(file, 'utf8');
    const { text, counts } = patchText(source);

    report[name] = counts;

    const output = name === 'app.html'
      ? injectShim(text)
      : text;

    await writeFile(file, output);
  }

  // 7. Confirma que não restaram referências às CDNs.
  for (const name of appFiles) {
    if (name === 'tutor-memory.js') {
      continue;
    }

    const file = path.join(www, name);

    if (!existsSync(file)) {
      continue;
    }

    const content = await readFile(file, 'utf8');

    const remaining = content.match(
      /cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/g,
    );

    if (remaining) {
      const domains = [...new Set(remaining)];

      throw new Error(
        `${name} ainda referencia ${domains.join(', ')}. ` +
        'Atualize as regras em build-www.mjs.',
      );
    }
  }

  // 8. Confirma que as substituições críticas aconteceram.
  const requiredRules = [
    'login social',
    'recuperar senha',
    'supabase-js',
  ];

  for (const id of requiredRules) {
    const wasApplied = Object.values(report).some(
      (counts) => Boolean(counts[id]),
    );

    if (!wasApplied) {
      throw new Error(
        `A regra "${id}" não foi aplicada. ` +
        'O app.html pode ter mudado; verifique a regra antes de continuar.',
      );
    }
  }

  // 9. Injeta a configuração e o shim do ambiente móvel.
  const shimSource = await readFile(
    need(path.join(mobile, 'www-extra', 'mobile-shim.js')),
    'utf8',
  );

  const config =
    `window.BK_API_BASE=${JSON.stringify(apiBase)};` +
    `window.BK_WEB_URL=${JSON.stringify(apiBase + '/app.html')};\n`;

  await writeFile(
    path.join(www, 'mobile-shim.js'),
    config + shimSource,
  );

  // 10. Cria a entrada esperada pelo Capacitor.
  await cp(
    need(path.join(www, 'app.html')),
    path.join(www, 'index.html'),
  );

  await rm(path.join(www, 'app.html'));

  console.log('API publicada:', apiBase);
  console.log('Trocas feitas:', JSON.stringify(report, null, 2));
  console.log('Ficheiros processados:', appFiles.size);
  console.log('www pronto em', www);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error('ERRO:', error.message);
    process.exit(1);
  });
}
