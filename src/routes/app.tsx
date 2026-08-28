import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    void registerAppServiceWorker();

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => setInstallPrompt(null);

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <>
      <iframe
        src="/app.html"
        title="BK-CIRURGIA"
        className="fixed inset-0 h-full w-full border-0"
      />
      {installPrompt ? (
        <button
          type="button"
          onClick={installApp}
          className="fixed bottom-20 right-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Instalar BK-CIRURGIA"
          title="Instalar BK-CIRURGIA"
        >
          <Download aria-hidden="true" className="size-4" />
          Instalar app
        </button>
      ) : null}
    </>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

