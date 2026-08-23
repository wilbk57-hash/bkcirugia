import { createFileRoute, Link } from "@tanstack/react-router";

const URL = "https://trypixelperfect.app/resumos/cirurgia-geral";
const TITLE = "Resumo de cirurgia geral: pré-operatório | BK-CIRURGIA";
const DESCRIPTION =
  "Resumo de cirurgia geral para residência: definição de pré-operatório, cirurgia eletiva, de urgência e emergência, fases mediata e imediata e estresse cirúrgico.";

const SECTIONS = [
  {
    id: "o-que-e",
    title: "O que é o pré-operatório",
    paragraphs: [
      "O pré-operatório é o tempo entre uma decisão e uma ação: a decisão de operar e o momento em que a operação de facto começa.",
      "Clinicamente é muito mais do que uma fila de espera — é a janela em que a equipa médica pode reduzir o risco antes de o doente entrar na sala de cirurgia.",
    ],
    example:
      "Um doente descobre uma hérnia inguinal em consulta e a cirurgia é marcada para 4 semanas depois. Esse intervalo inteiro é o pré-operatório, mesmo que o doente esteja em casa.",
    takeaway: "Pré-operatório = do momento da decisão até ao início real da cirurgia.",
  },
  {
    id: "classificacao-urgencia",
    title: "Eletiva, urgência e emergência",
    paragraphs: [
      "O tempo disponível para preparar o doente depende inteiramente da urgência clínica, e é isso que define as três categorias clássicas.",
      "Eletiva: dias a semanas de preparo. Urgência: minutos a horas. Emergência: segundos a minutos, muitas vezes direto para a sala.",
    ],
    example:
      "Colecistectomia eletiva (semanas de preparo) vs. apendicite aguda (poucas horas) vs. rotura de aneurisma da aorta (minutos).",
    takeaway:
      "Quanto menos tempo disponível, maior o risco assumido e menor a hipótese de corrigir problemas antes da cirurgia.",
  },
  {
    id: "mediato-imediato",
    title: "Pré-operatório mediato e imediato",
    paragraphs: [
      "Mediato: da decisão até 24 h antes da cirurgia. É quando se investiga cada sistema e se corrigem problemas — por exemplo, controlar a pressão arterial de um hipertenso.",
      "Imediato: as últimas 24 h. Já não há tempo para grandes correções; é a fase de preparo final (jejum, higiene, sedação).",
    ],
    example:
      "Numa doente hipertensa, a fase mediata serviu para controlar a pressão antes de confirmar a data; a fase imediata foi apenas jejum e higiene na véspera.",
    takeaway:
      "Mediato = investigar e corrigir · Imediato = preparo final, sem mais correções grandes.",
  },
  {
    id: "estresse-cirurgico",
    title: "Estresse cirúrgico: o corpo reage antes do corte",
    paragraphs: [
      "Assim que o doente ouve “vamos precisar de operar”, o corpo já começa a reagir. Esse fenómeno chama-se estresse cirúrgico.",
      "O mecanismo passa pelo eixo hipotálamo-hipófise-suprarrenal e pelo sistema nervoso simpático, com libertação de citocinas (TNF, IL-1, IL-6) que preparam o corpo para o trauma que se aproxima.",
    ],
    example:
      "É comum um doente chegar à consulta pré-operatória com a pressão mais alta do que a habitual, apenas pela ansiedade da cirurgia marcada — é fisiologia mensurável, não “só nervosismo”.",
    takeaway:
      "O estresse cirúrgico começa no anúncio da cirurgia, não no corte — e tem base hormonal, não apenas emocional.",
  },
];

const NUMBERS = [
  { value: "3", label: "Fases: mediato, imediato e urgência" },
  { value: "16", label: "Sistemas e aspetos avaliados" },
  { value: "10 g/dL", label: "Hemoglobina mínima aceitável" },
  { value: "12 h", label: "Jejum antes da cirurgia" },
];

const KEYWORDS = [
  "Pré-operatório",
  "Eletivo",
  "Urgência",
  "Emergência",
  "Mediato",
  "Imediato",
  "Estresse cirúrgico",
  "Eixo HHA",
  "Citocinas",
];

export const Route = createFileRoute("/resumos/cirurgia-geral")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Resumo de cirurgia geral: pré-operatório",
          description: DESCRIPTION,
          inLanguage: "pt",
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "BK-CIRURGIA" },
          publisher: { "@type": "Organization", name: "BK-CIRURGIA" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
              item: "https://trypixelperfect.app/",
            },
            { "@type": "ListItem", position: 2, name: "Resumo de cirurgia geral", item: URL },
          ],
        }),
      },
    ],
  }),
  component: ResumoCirurgiaGeral,
});

function ResumoCirurgiaGeral() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <nav aria-label="Trilho de navegação" className="text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">
            Início
          </Link>
          <span aria-hidden="true"> · </span>
          <span>Resumo de cirurgia geral</span>
        </nav>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Tema I · Princípios gerais de tratamento
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Resumo de cirurgia geral: pré-operatório
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Resumo de estudo para provas de residência em cirurgia geral: o que é o período
            pré-operatório, como classificar a urgência da cirurgia, a diferença entre fase mediata
            e imediata e por que o corpo reage antes do primeiro corte.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="numeros">
          <h2 id="numeros" className="sr-only">
            Números-chave
          </h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {NUMBERS.map((n) => (
              <div key={n.label} className="rounded-xl border border-border p-4">
                <dt className="sr-only">{n.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold">{n.value}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{n.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {SECTIONS.map((section) => (
          <section key={section.id} className="mt-12" aria-labelledby={section.id}>
            <h2 id={section.id} className="text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            <p className="mt-4 rounded-xl border border-border p-4 text-sm">
              <strong className="font-semibold">Exemplo clínico: </strong>
              <span className="text-muted-foreground">{section.example}</span>
            </p>
            <p className="mt-3 rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm">
              <strong className="font-semibold">Em resumo: </strong>
              <span className="text-muted-foreground">{section.takeaway}</span>
            </p>
          </section>
        ))}

        <section className="mt-12" aria-labelledby="palavras-chave">
          <h2 id="palavras-chave" className="text-2xl font-semibold tracking-tight">
            Palavras-chave para revisão
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {KEYWORDS.map((k) => (
              <li key={k} className="rounded-full border border-border px-3 py-1 text-sm">
                {k}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-12 rounded-2xl border border-border p-6 sm:p-8"
          aria-labelledby="cta"
        >
          <h2 id="cta" className="text-2xl font-semibold tracking-tight">
            Continue o módulo completo no BK-CIRURGIA
          </h2>
          <p className="mt-4 text-muted-foreground">
            Este resumo cobre apenas a introdução do módulo de pré-operatório. Na plataforma tem a
            avaliação sistema a sistema, preparos especiais, casos clínicos, questões comentadas por
            nível de dificuldade, mapas mentais e um tutor de IA para tirar dúvidas enquanto estuda.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Criar conta gratuita
            </Link>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
            >
              Conhecer a plataforma
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
