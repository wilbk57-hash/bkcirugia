import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BK-CIRURGIA — Plataforma de estudos em cirurgia" },
      {
        name: "description",
        content:
          "BK-CIRURGIA: plataforma de estudos em cirurgia com conteúdo estruturado, revisão e acompanhamento do seu progresso.",
      },
      { property: "og:title", content: "BK-CIRURGIA — Plataforma de estudos em cirurgia" },
      {
        property: "og:description",
        content:
          "Estude cirurgia com conteúdo estruturado, revisão guiada e acompanhamento de progresso.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://trypixelperfect.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://trypixelperfect.app/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <h1 className="sr-only">BK-CIRURGIA — Plataforma de estudos em cirurgia</h1>
      <iframe
        src="/app.html"
        title="BK-CIRURGIA"
        className="fixed inset-0 h-full w-full border-0"
      />
    </>
  );
}

