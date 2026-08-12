# Tutor de IA com múltiplos provedores (Claude, Gemini, ChatGPT)

## Como está hoje (verificado no `public/app.html`)

- O tutor é um chat próprio (`iaView` + barra `iaInputBar`), com histórico local, voz e leitura em voz alta.
- Toda a chamada de IA está em duas funções: `sendIaMessage()` (chat principal, linha ~4392) e a explicação de termo selecionado durante a leitura (~linha 2063).
- Ambas chamam **diretamente** `https://api.anthropic.com/v1/messages`, modelo fixo `claude-sonnet-5`, com o cabeçalho `anthropic-dangerous-direct-browser-access: true`.
- A chave é da Anthropic, colada pelo próprio aluno nas Definições e guardada em `localStorage` (`bkcirurgia_api_key`). Ou seja: hoje **a chave vive no navegador do aluno** e cada aluno paga/gasta a sua própria quota.
- A busca na web usa a ferramenta nativa da Anthropic (`web_search_20250305`), e as respostas mostram "Fontes".

## O que proponho

### 1. Passar as chamadas de IA para o servidor deste projeto
Criar um endpoint no backend do próprio app (mesma origem do `app.html`, por isso funciona sem CORS nem alterações visuais) que recebe: provedor escolhido, mensagens, system prompt e a opção de busca web. O `app.html` deixa de falar diretamente com a Anthropic e passa a falar só com o nosso servidor.

Vantagens: nenhuma chave fica no frontend, podemos trocar de provedor sem mexer no app, e conseguimos fazer *fallback* automático.

### 2. Seletor de provedor na interface do tutor
- Um seletor discreto no topo do chat do tutor com três opções: **Claude**, **Gemini**, **ChatGPT**, mais a opção **Automático**.
- Usa exatamente os estilos já existentes (mesmo padrão dos controlos "segmented" já usados nas Definições) — sem novo design, sem novas cores.
- A escolha fica guardada nas definições do aluno (mesma mecânica de `SETTINGS_STATE`), e também aparece como item na secção "Tutor de IA" das Definições.
- **Automático** (recomendado como padrão): tenta o provedor preferido e, se esse devolver limite atingido (429/quota), passa sozinho para o seguinte — que é precisamente o problema dos limites diários que queres resolver. Nesse caso a resposta indica discretamente qual modelo respondeu.

### 3. Comportamento por provedor
- **Gemini** e **ChatGPT**: passam a funcionar **sem o aluno ter de colar chave nenhuma**, através da IA integrada da plataforma Lovable (já incluída neste projeto, sem chaves para configurar).
- **Claude**: a IA integrada da plataforma não inclui modelos Anthropic. Duas hipóteses:
  - (a) manter o caminho atual, com a chave Anthropic do aluno guardada no navegador — funciona já, sem custos para ti;
  - (b) tu forneceres uma chave Anthropic única do projeto, guardada como segredo no servidor, e todos os alunos usarem-na.
  Por omissão implemento (a) + deixo (b) pronto para ligar depois.
- A busca web nativa continua no Claude; para Gemini/ChatGPT indico ao modelo que não tem busca em tempo real (ou desligo o aviso "Fontes"), para não prometer o que não faz.

### 4. Chaves de API e segurança
- **Gemini / ChatGPT**: **nenhuma chave necessária** — a IA da plataforma já está disponível no backend e a credencial nunca sai do servidor.
- **Anthropic (Claude)**, só se escolheres a opção (b): a chave é adicionada por ti em **Definições do Projeto → Secrets** e lida apenas no servidor. Nunca é escrita no `app.html`, nunca aparece no HTML/JS enviado ao navegador, nunca é devolvida em respostas.
- Regra que mantenho em todo o caso: nenhuma chave de projeto no frontend; o navegador só envia o texto da pergunta.
- Protejo o endpoint para exigir sessão iniciada (só alunos autenticados podem gastar IA) e limito o tamanho do pedido.

## Detalhes técnicos
- Endpoint: server function TanStack (`src/lib/tutor.functions.ts`) com `requireSupabaseAuth`, chamada pelo `app.html` via `fetch` same-origin para uma rota `src/routes/api/tutor.ts` (o `app.html` é HTML estático, por isso precisa de rota HTTP, não de RPC).
- Modelos: `google/gemini-3-flash` e `openai/gpt-5.2` (nomes finais confirmados no catálogo no momento da implementação) via AI Gateway; Claude via `api.anthropic.com` com `claude-sonnet-5`.
- Normalizo pedido/resposta num formato único `{ text, sources[], provider }` para não duplicar a lógica de render já existente.
- Alterações no `app.html`: substituir o corpo das duas funções de chamada, adicionar o seletor e as strings de tradução (PT/EN/ES). Zero alterações de CSS ou de layout.

## A confirmar
1. Para o Claude: manter a chave do aluno (a) ou passares a fornecer uma chave do projeto (b)?
2. O padrão do seletor deve ser **Automático** (com fallback entre provedores) ou um provedor fixo?
