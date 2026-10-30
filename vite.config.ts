
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// ============================================================
// BK-CIRURGIA — VITE + TANSTACK START + PWA
// ============================================================

// A configuração Lovable já inclui os plugins principais.
// Não os adicionar novamente.

const CACHE_PREFIX = "bk-cirurgia-v3";

const CACHE_NAMES = {
  documents: `${CACHE_PREFIX}-documents`,
  assets: `${CACHE_PREFIX}-assets`,
  resources: `${CACHE_PREFIX}-resources`,
  external: `${CACHE_PREFIX}-external`,
} as const;

// ============================================================
// 1. POLÍTICA DE SEGURANÇA DOS DOCUMENTOS
// ============================================================

const PRIVATE_ROUTES = [
  /^\/api(?:\/|$)/,
  /^\/~oauth(?:\/|$)/,
  /^\/login(?:\/|$)/,
  /^\/logout(?:\/|$)/,
  /^\/auth(?:\/|$)/,
  /^\/account(?:\/|$)/,
  /^\/profile(?:\/|$)/,
  /^\/dashboard(?:\/|$)/,
  /^\/admin(?:\/|$)/,
  /^\/settings(?:\/|$)/,
  /^\/history(?:\/|$)/,
  /^\/private(?:\/|$)/,
];

// Por segurança, nenhum documento é armazenado
// até que a respetiva rota seja explicitamente autorizada.
const PUBLIC_DOCUMENT_PATHS: string[] = [];

function isPublicDocument(pathname: string): boolean {
  if (PRIVATE_ROUTES.some((pattern) => pattern.test(pathname))) {
    return false;
  }

  return PUBLIC_DOCUMENT_PATHS.some((path) => {
    if (path === "/") return pathname === "/";

    const prefix = path.endsWith("/") ? path : `${path}/`;

    return pathname === path || pathname.startsWith(prefix);
  });
}

// ============================================================
// 2. PADRÕES DE RECURSOS
// ============================================================

const HASHED_ASSET_PATTERN =
  /^\/assets\/.+-[\w-]{8,}\.(?:js|css|woff2?|png|jpe?g|webp|avif|svg|gif)$/i;

const RESOURCE_FILE_PATTERN =
  /^\/(?:tutor-memory|tutor-stream|library-reader|study-topics|study-topics-loader|study-topic-files|study-reading|study-generated)\.(?:js|css)$/;

// ============================================================
// 3. CONFIGURAÇÃO PRINCIPAL
// ============================================================

export default defineConfig({
  plugins: [
    VitePWA({
      strategies: "generateSW",

      filename: "sw.js",

      outDir: "dist/client",

      manifest: false,

      // Registo manual através de virtual:pwa-register.
      injectRegister: null,

      // Atualização controlada pelo utilizador.
      registerType: "prompt",

      devOptions: {
        enabled: false,
      },

      integration: {
        closeBundleOrder: "post",
      },

      workbox: {
        cacheId: CACHE_PREFIX,

        // Eventos de notificações Push.
        importScripts: ["/push-events.js"],

        // Recursos incluídos no pré-cache.
        globPatterns: [
          "assets/**/*.{js,css,woff,woff2}",
          "icons/**/*.{png,svg,webp}",
          "manifest.webmanifest",
          "hero-banner.webp",
          "offline.html",
        ],

        globIgnores: [
          "**/*.map",
          "**/sw.js",
          "**/workbox-*.js",
        ],

        navigateFallback: null,

        cleanupOutdatedCaches: true,

        // Evita ativação automática durante operações.
        skipWaiting: false,
        clientsClaim: false,

        runtimeCaching: [
          // ==================================================
          // 1. DOCUMENTOS HTML PÚBLICOS
          // ==================================================

          {
            urlPattern: ({ request, url, sameOrigin }) =>
              sameOrigin &&
              (request.mode === "navigate" ||
                request.destination === "document") &&
              url.pathname !== "/sw.js",

            handler: "NetworkFirst",

            options: {
              cacheName: CACHE_NAMES.documents,

              networkTimeoutSeconds: 4,

              plugins: [
                {
                  cacheWillUpdate: async ({ request, response }) => {
                    if (!response || response.status !== 200) {
                      return null;
                    }

                    const pathname = new URL(request.url).pathname;

                    return isPublicDocument(pathname)
                      ? response
                      : null;
                  },

                  handlerDidError: async () => {
                    return (
                      (await caches.match("/offline.html")) ??
                      Response.error()
                    );
                  },
                },
              ],

              expiration: {
                maxEntries: 12,
                maxAgeSeconds: 604800,
                purgeOnQuotaError: true,
              },
            },
          },

          // ==================================================
          // 2. RECURSOS ESTÁTICOS COM HASH
          // ==================================================

          {
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && HASHED_ASSET_PATTERN.test(url.pathname),

            handler: "CacheFirst",

            options: {
              cacheName: CACHE_NAMES.assets,

              cacheableResponse: {
                statuses: [200],
              },

              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 2592000,
                purgeOnQuotaError: true,
              },
            },
          },

          // ==================================================
          // 3. MÓDULOS E RECURSOS INTERNOS
          // ==================================================

          {
            urlPattern: ({ url, sameOrigin }) => {
              if (!sameOrigin) return false;

              const pathname = url.pathname;

              const isIcon =
                /^\/icons\/.+\.(?:png|svg|webp|ico)$/i.test(pathname);

              const isManifest =
                pathname === "/manifest.webmanifest";

              const isStudyTopic =
                /^\/temas\/[a-z0-9-]+\.js$/i.test(pathname);

              const isApplicationModule =
                RESOURCE_FILE_PATTERN.test(pathname);

              return (
                isIcon ||
                isManifest ||
                isStudyTopic ||
                isApplicationModule
              );
            },

            handler: "NetworkFirst",

            options: {
              cacheName: CACHE_NAMES.resources,

              networkTimeoutSeconds: 4,

              cacheableResponse: {
                statuses: [200],
              },

              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 604800,
                purgeOnQuotaError: true,
              },
            },
          },

          // ==================================================
          // 4. DEPENDÊNCIA EXTERNA SUPABASE
          // ==================================================

          {
            urlPattern: ({ url }) =>
              url.origin === "https://cdn.jsdelivr.net" &&
              url.pathname ===
                "/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js",

            handler: "CacheFirst",

            options: {
              cacheName: CACHE_NAMES.external,

              cacheableResponse: {
                statuses: [200],
              },

              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 2592000,
                purgeOnQuotaError: true,
              },
            },
          },
        ],
      },
    }),
  ],

  // ==========================================================
  // 4. TANSTACK START — SERVIDOR PERSONALIZADO
  // ==========================================================

  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});
