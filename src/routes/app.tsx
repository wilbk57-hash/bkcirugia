import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { registerAppServiceWorker } from "@/lib/register-sw";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Entrar — BK-CIRURGIA" },
      {
        name: "description",
        content:
            "Aceda à plataforma BK-CIRURGIA: módulos de estudo, tutor de IA, mapas mentais e biblioteca oficial.",
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
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    void registerAppServiceWorker();
    setIsAndroid(/Android/i.test(window.navigator.userAgent));

    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const notifyAppFrame = (displayMode: string) => {
      const frame = document.querySelector("iframe");
      frame?.contentWindow?.postMessage({ type: "bk-pwa-installed", displayMode }, window.location.origin);
    };
    const updateInstalledState = () => {
      const installed = standaloneQuery.matches || window.navigator.standalone === true;
      setIsInstalled(installed);
      if (installed) {
        notifyAppFrame(standaloneQuery.matches ? "standalone" : "ios-standalone");
      }
    };
    updateInstalledState();
    const initialPing = window.setTimeout(updateInstalledState, 2500);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setShowInstallHelp(false);
      notifyAppFrame("installed");
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    standaloneQuery.addEventListener("change", updateInstalledState);

    return () => {
      window.clearTimeout(initialPing);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      standaloneQuery.removeEventListener("change", updateInstalledState);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setIsInstalled(true);
    setInstallPrompt(null);
  };

  const openInChrome = () => {
    const chromeUrl = `${window.location.host}${window.location.pathname}${window.location.search}`;
    window.location.href = `intent://${chromeUrl}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end`;
  };

  return (
    <>
      <iframe
        src="/app.html"
        title="BK-CIRURGIA"
        className="fixed inset-0 h-full w-full border-0"
      />
      {!isInstalled ? (
        <Button
          type="button"
          onClick={installApp}
          variant="outline"
          className="fixed bottom-20 right-4 z-50 min-h-11 bg-background px-4 font-semibold shadow-lg"
          aria-label="Instalar BK-CIRURGIA"
          title="Instalar BK-CIRURGIA"
        >
          <Download aria-hidden="true" className="size-4" />
          Instalar app
        </Button>
      ) : null}
      <Dialog open={showInstallHelp} onOpenChange={setShowInstallHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instalar BK-CIRURGIA</DialogTitle>
            <DialogDescription>
              {isAndroid
                ? "Esta página está aberta num navegador interno, que não permite instalar aplicações. Abra-a no Chrome e depois escolha “Instalar app” no menu ⋮."
                : "No iPhone ou iPad, abra esta página no Safari, toque em Partilhar e depois em “Adicionar ao ecrã principal”."}
            </DialogDescription>
          </DialogHeader>
          {isAndroid ? (
            <Button type="button" onClick={openInChrome} className="w-full font-semibold">
              <ExternalLink aria-hidden="true" className="size-4" />
              Abrir no Chrome
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

