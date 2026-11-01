
// ============================================================
// BK-CIRURGIA — BUILD MOBILE (CAPACITOR)
// ============================================================
// Objetivos:
// - Construir mobile/www a partir de public/.
// - Nunca modificar os ficheiros originais de public/.
// - Copiar bibliotecas e fontes para utilização offline.
// - Aplicar as adaptações móveis já existentes.
// - Processar JavaScript e CSS da raiz e das subpastas.
// - Validar dependências e referências externas.
// - Construir numa pasta temporária para proteger o build anterior.
//
// NOTA:
// As alterações específicas de fontes e estrutura do app.html
// que dependem da modularização ficam para a próxima fase.
// ============================================================

import { existsSync } from 'node:fs';

import {
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ------------------------------------------------------------
// 1. CONFIGURAÇÃO
// ------------------------------------------------------------

export const DEFAULT_API_BASE =
  'https://project--b951eaff-f66b-4dd3-896d-302004fcc7f8.lovable.app';

const CDN = 'https://cdn.jsdelivr.net/npm/';

const EXCLUDED_PUBLIC_ROOTS = new Set([
  'resumos',
  'robots.txt',
  'sitemap.xml',
]);

// ------------------------------------------------------------
// 2. REGRAS DE ADAPTAÇÃO
// ------------------------------------------------------------

export const RULES = [
  {
    id: 'fontes do Google',
    find: /@import url\('https:\/\/fonts\.googleapis\.com\/css2[^']*'\);/g,
    to: "@import url('/fonts.css');",
  },

    {
    id: 'supabase-js',
    find: /https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@[\d.]+\/dist\/umd\/supabase\.js/g,
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

// ------------------------------------------------------------
// 3. APLICAÇÃO DAS REGRAS
// ------------------------------------------------------------

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

      continue;
    }

    const found = text.match(rule.find);

    if (found) {
      counts[rule.id] = found.length;
      text = text.replace(rule.find, () => rule.to);
    }
  }

  return { text, counts };
}

// ------------------------------------------------------------
// 4. INJEÇÃO DO SHIM
// ------------------------------------------------------------

export function injectShim(html) {
  if (!html.includes('<head>')) {
    throw new Error(
      'app.html sem <head>: não foi possível injetar o mobile-shim.js.',
    );
  }

  const shimTag = '<script src="/mobile-shim.js"></script>';

  // Evita injetar o mesmo script duas vezes.
  if (html.includes(shimTag)) {
    return html;
  }

  return html.replace(
    '<head>',
    `<head>\n${shimTag}`,
  );
}

// ------------------------------------------------------------
// 5. DESCOBERTA RECURSIVA DOS FICHEIROS
// ------------------------------------------------------------

async function collectFiles(
  directory,
  baseDirectory = directory,
) {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(
      baseDirectory,
      absolutePath,
    );

    const rootName = relativePath.split(path.sep)[0];

    // Mantém a mesma exclusão utilizada na cópia de public/.
    if (EXCLUDED_PUBLIC_ROOTS.has(rootName)) {
      continue;
    }

    if (entry.isDirectory()) {
      const nestedFiles = await collectFiles(
        absolutePath,
        baseDirectory,
      );

      files.push(...nestedFiles);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    // Inclui JavaScript, módulos JavaScript e CSS.
    if (!/\.(?:js|mjs|css)$/i.test(entry.name)) {
      continue;
    }

    files.push(relativePath);
  }

  return files;
}

// ------------------------------------------------------------
// 6. VERIFICAÇÃO DE REFERÊNCIAS EXTERNAS
// ------------------------------------------------------------

function prepareForDeferredHtmlChecks(content, fileName) {
  if (fileName !== 'app.html') {
    return content;
  }

  // Estas referências serão tratadas durante a modularização.
  // São removidas apenas da verificação, não do HTML original.

  return content
    .replace(
      /<link\b(?=[^>]*\brel\s*=\s*["']preconnect["'])[^>]*>\s*/gi,
      '',
    )
    .replace(
      /<noscript\b[^>]*>\s*<link\b(?=[^>]*fonts\.googleapis\.com)[^>]*>\s*<\/noscript>/gi,
      '',
    )
    .replace(
      /<link\b(?=[^>]*fonts\.googleapis\.com)[^>]*>\s*/gi,
      '',
    );
}

async function validateExternalReferences(
  outputDirectory,
  appFiles,
) {
  const problems = [];

  for (const name of appFiles) {
    const file = path.join(outputDirectory, name);

    if (!existsSync(file)) {
      problems.push(`${name}: ficheiro não encontrado.`);
      continue;
    }

    const original = await readFile(file, 'utf8');

    const content = prepareForDeferredHtmlChecks(
      original,
      name,
    );

    const remaining = content.match(
      /cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/g,
    );

    if (remaining) {
      const domains = [...new Set(remaining)];

      problems.push(
        `${name}: referências externas restantes: ${domains.join(', ')}`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(
      'Foram encontradas referências externas não tratadas:\n- ' +
      problems.join('\n- '),
    );
  }
}

// ------------------------------------------------------------
// 7. FUNÇÃO PRINCIPAL
// ------------------------------------------------------------

async function main() {
  const here = path.dirname(
    fileURLToPath(import.meta.url),
  );

  const mobile = path.resolve(here, '..');
  const repo = path.resolve(mobile, '..');

  const pub = path.join(repo, 'public');
  const nm = path.join(mobile, 'node_modules');

  const www = path.join(mobile, 'www');
  const staging = path.join(mobile, '.www-build');

  const apiBase = (
    process.env.BK_API_BASE || DEFAULT_API_BASE
  ).replace(/\/+$/, '');

  // ----------------------------------------------------------
  // 7.1. VERIFICAÇÕES INICIAIS
  // ----------------------------------------------------------

  if (Number(process.versions.node.split('.')[0]) < 22) {
    throw new Error(
      `Node.js 22 ou superior é necessário. Versão atual: ${process.versions.node}`,
    );
  }

  if (!existsSync(path.join(pub, 'app.html'))) {
    throw new Error(
      'public/app.html não encontrado. Verifique a localização do projeto.',
    );
  }

  const need = (filePath) => {
    if (!existsSync(filePath)) {
      throw new Error(
        `Dependência ou ficheiro ausente: ${filePath}\n` +
        'Verifique se npm install foi executado corretamente.',
      );
    }

    return filePath;
  };

  // ----------------------------------------------------------
  // 7.2. PREPARAÇÃO DAS BIBLIOTECAS
  // ----------------------------------------------------------

  const vendor = [
    [
      '@supabase/supabase-js/dist/umd/supabase.js',
      'supabase.js',
    ],
    [
      'pdfjs-dist/build/pdf.min.js',
      'pdf.min.js',
    ],
    [
      'pdfjs-dist/build/pdf.worker.min.js',
      'pdf.worker.min.js',
    ],
    [
      'jszip/dist/jszip.min.js',
      'jszip.min.js',
    ],
    [
      'epubjs/dist/epub.min.js',
      'epub.min.js',
    ],
  ];

  // Verifica todos os ficheiros antes de iniciar a construção.
  const vendorSources = vendor.map(([from, to]) => ({
    source: need(path.join(nm, from)),
    destination: to,
  }));

  // ----------------------------------------------------------
  // 7.3. PREPARAÇÃO DAS FONTES
  // ----------------------------------------------------------

  const fonts = [
    ['inter', 'Inter', [400, 500, 600, 700]],
    ['space-grotesk', 'Space Grotesk', [500, 600, 700]],
    ['ibm-plex-mono', 'IBM Plex Mono', [500, 600]],
  ];

  const fontSources = [];

  for (const [slug, family, weights] of fonts) {
    for (const weight of weights) {
      const file = `${slug}-latin-${weight}-normal.woff2`;

      fontSources.push({
        family,
        weight,
        file,
        source: need(
          path.join(
            nm,
            '@fontsource',
            slug,
            'files',
            file,
          ),
        ),
      });
    }
  }

  // ----------------------------------------------------------
  // 7.4. PREPARAÇÃO DO SHIM
  // ----------------------------------------------------------

  const shimSource = await readFile(
    need(
      path.join(
        mobile,
        'www-extra',
        'mobile-shim.js',
      ),
    ),
    'utf8',
  );

  // ----------------------------------------------------------
  // 7.5. DESCOBERTA DOS FICHEIROS DA APLICAÇÃO
  // ----------------------------------------------------------

  const discoveredFiles = await collectFiles(pub);

  const appFiles = [
    'app.html',
    ...discoveredFiles,
  ];

  // Remove duplicados e mantém ordem determinística.
  const uniqueAppFiles = [...new Set(appFiles)].sort();

  // ----------------------------------------------------------
  // 7.6. INÍCIO DA CONSTRUÇÃO TEMPORÁRIA
  // ----------------------------------------------------------

  await rm(staging, {
    recursive: true,
    force: true,
  });

  try {
    await mkdir(staging, {
      recursive: true,
    });

    // --------------------------------------------------------
    // 7.7. CÓPIA DO PUBLIC
    // --------------------------------------------------------

    await cp(pub, staging, {
      recursive: true,

      filter: (source) => {
        const relative = path.relative(pub, source);

        if (!relative) {
          return true;
        }

        const firstPart = relative.split(path.sep)[0];

        return !EXCLUDED_PUBLIC_ROOTS.has(firstPart);
      },
    });

    // --------------------------------------------------------
    // 7.8. CÓPIA DAS BIBLIOTECAS
    // --------------------------------------------------------

    const vendorDirectory = path.join(
      staging,
      'vendor',
    );

    await mkdir(vendorDirectory, {
      recursive: true,
    });

    for (const item of vendorSources) {
      await cp(
        item.source,
        path.join(vendorDirectory, item.destination),
      );
    }

    // --------------------------------------------------------
    // 7.9. CÓPIA DAS FONTES
    // --------------------------------------------------------

    const fontsDirectory = path.join(
      staging,
      'fonts',
    );

    await mkdir(fontsDirectory, {
      recursive: true,
    });

    let fontCss = '';

    for (const item of fontSources) {
      await cp(
        item.source,
        path.join(fontsDirectory, item.file),
      );

      fontCss +=
        `@font-face{` +
        `font-family:'${item.family}';` +
        `font-style:normal;` +
        `font-weight:${item.weight};` +
        `font-display:swap;` +
        `src:url('/fonts/${item.file}') format('woff2');` +
        `}\n`;
    }

    await writeFile(
      path.join(staging, 'fonts.css'),
      fontCss,
      'utf8',
    );

    // --------------------------------------------------------
    // 7.10. APLICAÇÃO DAS REGRAS
    // --------------------------------------------------------

    const report = {};

    for (const name of uniqueAppFiles) {
      const file = path.join(staging, name);

      if (!existsSync(file)) {
        throw new Error(
          `Ficheiro esperado não encontrado após a cópia: ${name}`,
        );
      }

      const source = await readFile(file, 'utf8');

      const result = patchText(source);

      report[name] = result.counts;

      const output = name === 'app.html'
        ? injectShim(result.text)
        : result.text;

      await writeFile(
        file,
        output,
        'utf8',
      );
    }

    // --------------------------------------------------------
    // 7.11. VALIDAÇÃO DAS REFERÊNCIAS EXTERNAS
    // --------------------------------------------------------

    await validateExternalReferences(
      staging,
      uniqueAppFiles,
    );

    // --------------------------------------------------------
    // 7.12. VALIDAÇÃO DAS REGRAS OBRIGATÓRIAS
    // --------------------------------------------------------

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
          `A regra obrigatória "${id}" não foi aplicada. ` +
          'Verifique se o código-fonte mudou antes de continuar.',
        );
      }
    }

    // --------------------------------------------------------
    // 7.13. INJEÇÃO DA CONFIGURAÇÃO E DO SHIM
    // --------------------------------------------------------

    const config =
      `window.BK_API_BASE=${JSON.stringify(apiBase)};` +
      `window.BK_WEB_URL=${JSON.stringify(apiBase + '/app.html')};\n`;

    await writeFile(
      path.join(staging, 'mobile-shim.js'),
      config + shimSource,
      'utf8',
    );

    // --------------------------------------------------------
    // 7.14. CRIAÇÃO DO INDEX.HTML
    // --------------------------------------------------------

    const appHtml = path.join(
      staging,
      'app.html',
    );

    const indexHtml = path.join(
      staging,
      'index.html',
    );

    if (!existsSync(appHtml)) {
      throw new Error(
        'app.html desapareceu durante a construção.',
      );
    }

    await cp(appHtml, indexHtml);

    await rm(appHtml);

    // --------------------------------------------------------
    // 7.15. VALIDAÇÃO DOS ARQUIVOS FINAIS
    // --------------------------------------------------------

    const requiredOutputs = [
      'index.html',
      'mobile-shim.js',
      'fonts.css',
      'vendor/supabase.js',
      'vendor/pdf.min.js',
      'vendor/pdf.worker.min.js',
      'vendor/jszip.min.js',
      'vendor/epub.min.js',
    ];

    for (const relativePath of requiredOutputs) {
      if (!existsSync(path.join(staging, relativePath))) {
        throw new Error(
          `Ficheiro final obrigatório ausente: ${relativePath}`,
        );
      }
    }

    for (const item of fontSources) {
      if (!existsSync(path.join(fontsDirectory, item.file))) {
        throw new Error(
          `Fonte não foi copiada corretamente: ${item.file}`,
        );
      }
    }

    // --------------------------------------------------------
    // 7.16. PUBLICAÇÃO DO BUILD
    // --------------------------------------------------------

    
    // Publica o novo build preservando a versão anterior para rollback.
    // A pasta de backup fica no mesmo diretório para manter rename no mesmo volume.
    const backup = path.join(mobile, '.www-backup');
    let previousBuildMoved = false;

    // Um backup antigo não deve ser apagado automaticamente:
    // pode conter a única cópia recuperável de um build anterior.
    if (existsSync(backup)) {
      throw new Error(
        'Foi encontrada a pasta .www-backup. Verifique o seu conteúdo e ' +
        'remova-a ou renomeie-a manualmente antes de publicar um novo build.',
      );
    }

    // Preserva o build atual antes de publicar o novo.
    if (existsSync(www)) {
      await rename(www, backup);
      previousBuildMoved = true;
    }

    try {
      await rename(staging, www);
    } catch (publishError) {
      // Se a publicação falhar, tenta restaurar o build anterior.
      if (previousBuildMoved) {
        try {
          await rename(backup, www);
        } catch (restoreError) {
          throw new AggregateError(
            [publishError, restoreError],
            'A publicação falhou e também não foi possível restaurar o build anterior. ' +
            'A versão anterior permanece na pasta .www-backup; não a apague.',
          );
        }
      }

      throw publishError;
    }

    // O novo www já está publicado.
    // Se a limpeza falhar, preserva o backup e apenas apresenta um aviso.
    if (previousBuildMoved) {
      try {
        await rm(backup, {
          recursive: true,
          force: true,
        });
      } catch (cleanupError) {
        console.warn(
          'Aviso: o novo build foi publicado, mas não foi possível remover .www-backup:',
          cleanupError.message,
        );
      }
    }


    // --------------------------------------------------------
    // 7.17. RELATÓRIO
    // --------------------------------------------------------

    console.log('\n========================================');
    console.log(' BK-CIRURGIA — BUILD MOBILE CONCLUÍDO');
    console.log('========================================\n');

    console.log('API publicada:', apiBase);
    console.log('Ficheiros processados:', uniqueAppFiles.length);
    console.log('Bibliotecas locais:', vendorSources.length);
    console.log('Ficheiros de fontes:', fontSources.length);
    console.log('Destino:', www);

    console.log(
      '\nRelatório de substituições:',
      JSON.stringify(report, null, 2),
    );

    console.log('\nBuild concluído com sucesso.\n');

  } catch (error) {
    // Remove apenas a construção temporária.
    // O build anterior permanece intacto se ainda não foi substituído.
    await rm(staging, {
      recursive: true,
      force: true,
    });

    throw error;
  }
}

// ------------------------------------------------------------
// 8. EXECUÇÃO DIRETA
// ------------------------------------------------------------

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(
    path.resolve(process.argv[1]),
  ).href;

if (isDirectExecution) {
  main().catch((error) => {
    console.error('\n========================================');
    console.error(' ERRO NO BUILD DO BK-CIRURGIA');
    console.error('========================================\n');

    console.error(error.message);

    process.exitCode = 1;
  });
}
