import { createFileRoute } from "@tanstack/react-router";

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
    ],
  }),
  component: AppShell,
});

function AppShell() {
  return (
    <iframe
      src="/app.html"
      title="BK-CIRURGIA"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
