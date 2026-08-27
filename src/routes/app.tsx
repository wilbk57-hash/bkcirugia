import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { registerAppServiceWorker } from "@/lib/register-sw";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Entrar — BK-CIRURGIA" },
      {
        name: "description",
        content:
          "Aceda à plataforma BK-CIRURGIA: módulos de estudo, tutor de IA, mapas mentais e biblioteca pessoal.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Entrar — BK-CIRURGIA" },
      {
        property: "og:description",
        content: "Aceda à sua conta BK-CIRURGIA e continue os seus estudos em cirurgia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0b1220" },
      { name: "application-name", content: "BK-CIRURGIA" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "BK-Cirurgia" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png", sizes: "192x192" },
      { rel: "icon", href: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  }),
  component: AppShell,
});

function AppShell() {
  useEffect(() => {
    void registerAppServiceWorker();
  }, []);

  return (
    <iframe
      src="/app.html"
      title="BK-CIRURGIA"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}

