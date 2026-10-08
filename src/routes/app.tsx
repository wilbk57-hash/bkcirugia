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
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

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
  const [isIOS, setIsIOS] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Evita o "flash branco" no iOS/Safari enquanto o iframe (app.html) ainda
  // está a carregar: pinta a página por trás com a mesma cor de fundo do
  // manifest, em vez de deixar o branco padrão do navegador aparecer.
  useEffect(() => {
    const root = document.documentElement;
    const previousRootBg = root.style.backgroundColor;
    const previousBodyBg = document.body.style.backgroundColor;
    root.style.backgroundColor = "#0b1220";
    document.body.style.backgroundColor = "#0b1220";
    return () => {
      root.style.backgroundColor = previousRootBg;
      document.body.style.backgroundColor = previousBodyBg;
    };
  }, []);

  useEffect(() => {
    void registerAppServiceWorker();

    const ua = window.navigator.userAgent;
    setIsAndroid(/Android/i.test(ua));
    // iPadOS 13+ identifica-se como "Macintosh" mas tem ecrã tátil — sem
    // isto, um iPad seria tratado (erradamente) como um Mac de secretária.
    const isAppleTouchDevice =
      /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    setIsIOS(isAppleTouchDevice);
    setIsMac(/Macintosh/i.test(ua) && !isAppleTouchDevice);

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

  // Login social: o iframe pede, esta página corre o OAuth e devolve a sessão.
  useEffect(() => {
    const post = (msg: Record<string, unknown>) => {
      const frame = document.querySelector("iframe");
      frame?.contentWindow?.postMessage(msg, window.location.origin);
    };
    const sendSession = async () => {
      const { data } = await supabase.auth.getSession();
      const s = data.session;
      if (s) post({ type: "bk-oauth-session", access_token: s.access_token, refresh_token: s.refresh_token, user_id: s.user.id });
    };
    const onMessage = async (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin || !ev.data) return;
      if (ev.data.type === "bk-frame-ready") void sendSession();
      if (ev.data.type === "bk-signout") void supabase.auth.signOut();
      if (ev.data.type === "bk-oauth-start") {
        const provider = ev.data.provider as "google" | "apple" | "microsoft";
        if (!["google", "apple", "microsoft"].includes(provider)) return;
        const result = await lovable.auth.signInWithOAuth(provider, {
          redirect_uri: `${window.location.origin}/app`,
        });
        if (result.error) {
          post({ type: "bk-oauth-error", message: "Não foi possível entrar. Tente novamente." });
          return;
        }
        if (result.redirected) return;
        void sendSession();
      }
    };
    window.addEventListener("message", onMessage);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") void sendSession();
    });
    return () => {
      window.removeEventListener("message", onMessage);
      sub.subscription.unsubscribe();
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

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const inAppBrowser = /; wv\)|FBAN|FBAV|Instagram|Line\/|WhatsApp|Telegram|MiuiBrowser|GSA\//i.test(ua);
  const installHelpText = isAndroid
    ? inAppBrowser
      ? "Esta página está aberta dentro de outra aplicação, que não permite instalar. Toque em “Abrir no Chrome” e depois instale pelo menu ⋮."
      : "Toque no menu ⋮ (canto superior direito do Chrome) e escolha “Instalar app” ou “Adicionar ao ecrã principal” → “Instalar”. Se já instalou antes, procure o ícone BK-Cirurgia no telemóvel."
    : isIOS
      ? "No iPhone ou iPad, abra esta página no Safari, toque em Partilhar e depois em “Adicionar ao ecrã principal”."
      : isMac
        ? "No Mac, abra esta página no Safari, Chrome ou Edge e procure a opção “Instalar” ou o ícone de instalação na barra de endereço."
        : "No Windows, abra esta página no Chrome ou Edge e clique no ícone de instalar (⊕ ou monitor) na barra de endereço.";

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
            <DialogDescription>{installHelpText}</DialogDescription>
          </DialogHeader>
          {isAndroid && inAppBrowser ? (
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
