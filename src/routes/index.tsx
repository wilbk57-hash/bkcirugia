import { createFileRoute, Link } from "@tanstack/react-router";

const FEATURES = [
  {
    title: "Módulos de estudo estruturados",
    text: "Conteúdo organizado por temas cirúrgicos — do pré-operatório às complicações pós-operatórias — com casos clínicos e questões de revisão.",
  },
  {
    title: "Tutor de IA",
    text: "Tire dúvidas a qualquer momento e peça explicações sobre qualquer trecho do conteúdo, com respostas baseadas também nos seus próprios livros.",
  },
  {
    title: "Mapas mentais gerados por IA",
    text: "Transforme um tema em mapa mental interativo, com modos de foco, apresentação e memorização.",
  },
  {
    title: "Biblioteca pessoal",
    text: "Carregue os seus PDFs e EPUBs, leia dentro da própria plataforma e pesquise por título, autor ou categoria.",
  },
  {
    title: "Progresso real e plano do dia",
    text: "Acompanhe o desempenho por tema, receba sugestões de revisão e organize provas e prazos na tela Hoje.",
  },
  {
    title: "Notas presas ao conteúdo",
    text: "Escreva notas dentro de cada lição e reveja-as agrupadas por tema, com exportação de eventos para o calendário.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BK-CIRURGIA — Plataforma de estudos em cirurgia" },
      {
        name: "description",
        content:
          "BK-CIRURGIA: plataforma de estudos em cirurgia com módulos estruturados, tutor de IA, mapas mentais, biblioteca pessoal e acompanhamento de progresso.",
      },
      { property: "og:title", content: "BK-CIRURGIA — Plataforma de estudos em cirurgia" },
      {
        property: "og:description",
        content:
          "Estude cirurgia com conteúdo estruturado, tutor de IA, mapas mentais e acompanhamento de progresso.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://trypixelperfect.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://trypixelperfect.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "BK-CIRURGIA",
          url: "https://trypixelperfect.app/",
          description:
            "Plataforma de estudos em cirurgia com módulos estruturados, tutor de IA, mapas mentais e acompanhamento de progresso.",
          inLanguage: "pt",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            BK-CIRURGIA
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Plataforma de estudos em cirurgia
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Estude cirurgia com conteúdo estruturado, tutor de inteligência artificial, mapas
            mentais interativos, biblioteca pessoal de livros e acompanhamento real do seu
            progresso.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entrar na plataforma
            </Link>
            <Link
              to="/app"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
            >
              Criar conta
            </Link>
          </div>
        </header>

        <section className="mt-16" aria-labelledby="recursos">
          <h2 id="recursos" className="text-2xl font-semibold tracking-tight">
            O que encontra na plataforma
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="rounded-xl border border-border p-6">
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="resumos">
          <h2 id="resumos" className="text-2xl font-semibold tracking-tight">
            Resumos abertos
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Alguns resumos de estudo estão disponíveis publicamente, sem necessidade de conta.
          </p>
          <ul className="mt-6 space-y-3">
            <li>
              <Link
                to="/resumos/cirurgia-geral"
                className="font-medium text-primary hover:underline"
              >
                Resumo de cirurgia geral: pré-operatório
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                Classificação por urgência, fases mediata e imediata e estresse cirúrgico — base
                para provas de residência.
              </p>
            </li>
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="para-quem">
          <h2 id="para-quem" className="text-2xl font-semibold tracking-tight">
            Para quem é
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Estudantes de medicina, internos e médicos em preparação para provas de cirurgia que
            precisam de rever grandes volumes de conteúdo com método: revisão espaçada por tema,
            questões de consolidação e material próprio sempre à mão.
          </p>
          <div className="mt-8">
            <Link
              to="/app"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Começar a estudar
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
