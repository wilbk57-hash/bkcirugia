// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      strategies: "generateSW",
      filename: "sw.js",
      outDir: "dist/client",
      manifest: false,
      injectRegister: null,
      registerType: "autoUpdate",
      devOptions: { enabled: false },
      integration: { closeBundleOrder: "post" },
      workbox: {
        cacheId: "bk-cirurgia",
        importScripts: ["/push-events.js"],
        globPatterns: ["assets/**/*.{js,css,woff,woff2}", "icons/*.png", "manifest.webmanifest"],
        globIgnores: ["**/*.html", "**/sw.js", "**/workbox-*.js"],
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request, url, sameOrigin }) =>
              sameOrigin && !url.pathname.startsWith("/api/") &&
              !url.pathname.startsWith("/~oauth") &&
              (request.mode === "navigate" || request.destination === "document"),
            handler: "NetworkFirst",
            options: {
              cacheName: "bk-cirurgia-documents",
              networkTimeoutSeconds: 4,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 12, maxAgeSeconds: 604800 },
            },
          },
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin &&
              !url.pathname.startsWith("/api/") &&
              /^\/assets\/.+-[\w-]{8,}\.(js|css|woff2?)$/.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "bk-cirurgia-assets",
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
            },
          },
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin &&
              /^(\/icons\/|\/manifest\.webmanifest$|\/(tutor-memory|tutor-stream|library-reader|push-events)\.(js|css)$)/.test(url.pathname),
            handler: "NetworkFirst",
            options: {
              cacheName: "bk-cirurgia-resources",
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 20, maxAgeSeconds: 604800 },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://cdn.jsdelivr.net" &&
              url.pathname === "/npm/@supabase/supabase-js@2/dist/umd/supabase.js",
            handler: "NetworkFirst",
            options: {
              cacheName: "bk-cirurgia-public-dependency",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 1, maxAgeSeconds: 604800 },
            },
          },
        ],
      },
    }),
  ],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
