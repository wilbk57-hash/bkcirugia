import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

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
            "Aceda à plataforma de estudo BK-CIRURGIA: módulos de estudo, tutor de IA, mapas mentais e biblioteca oficial.",
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
    ],
    links: [
      { rel: "icon", href: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  }),
  component: AppShell,
});

function AppShell() {
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

  // O service worker continua ativo para as páginas de estudo já abertas
  // ficarem disponíveis offline — mas a plataforma já não pede instalação.
  useEffect(() => {
    void registerAppServiceWorker();
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

  return (
    <iframe
      src="/app.html"
      title="BK-CIRURGIA"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
