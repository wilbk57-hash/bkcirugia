# Análise técnica do BK-CIRURGIA

Análise apenas de leitura. Nada foi alterado. No fim ficam as recomendações por prioridade — se aprovar, executo-as pela ordem indicada.

## 1. Arquitetura

- Site público em React/TanStack Start: `src/routes/index.tsx` (landing com H1 e dados estruturados), `src/routes/resumos/cirurgia-geral.tsx`, `src/routes/sitemap[.]xml.ts`, `src/routes/__root.tsx` (metadados + verificação Google).
- A aplicação real é um único ficheiro `public/app.html` com **12.142 linhas / ~981 KB** (HTML + CSS + JS numa só página), carregado dentro de um iframe por `src/routes/app.tsx`.
- Endpoints de servidor: `api/tutor.ts` (Gemini/OpenAI via gateway), `api/books/search.ts` (pesquisa RAG), `api/books/ocr.ts`, `api/books/reindex.ts`, `api/public/hooks/study-reminders.ts` (lembretes push, chamado por cron às 08:00 UTC).
- Base de dados: 11 tabelas. `book_chunks` com 4.392 registos e **82 MB** (índice HNSW sobre vetores 1536), 4 livros ocupando ~69 MB no armazenamento privado.
- PWA: `public/manifest.json` (`start_url: /app`), `public/sw.js` v4 (só faz cache de ícones/manifest — nada funciona offline), registo centralizado em `src/lib/register-sw.ts`.

## 2. Segurança

Pontos críticos encontrados:

- **O "código de segurança (2FA)" do administrador é decorativo.** Os campos existem no formulário (`public/app.html:1684`, `:1702`) mas nenhum código do app os lê ou valida. O acesso admin depende apenas de email+password e da linha em `admin_roles`.
- **Falha de XSS por escapar na biblioteca**: título e autor dos livros entram em `innerHTML` sem escape (`public/app.html:8678-8679`), ao contrário do resto do app que usa `escapeHtml`.
- **Sem qualquer limitação de uso do Tutor** — nem no cliente nem em `api/tutor.ts`, `api/books/search.ts` ou `api/books/ocr.ts`. Um utilizador autenticado pode gerar custos ilimitados de IA. O OCR aceita imagens até 8 MB por chamada.
- **Chave da Anthropic usada diretamente no browser** (`anthropic-dangerous-direct-browser-access`), exposta a qualquer script na página.
- **Endpoint de lembretes protegido apenas pela chave pública** do projeto, que também está embutida no comando do cron — qualquer pessoa pode disparar o envio de notificações.
- Confirmação de email desativada: qualquer email inventado cria conta ativa.
- Gatilho `grant_primary_admin` promove automaticamente por email fixo — funciona, mas é lógica sensível codificada na base de dados.

Pontos corretos: RLS ativa em todas as 11 tabelas com políticas por utilizador; `admin_roles` sem insert/update/delete; biblioteca e ficheiros só graváveis por admin; verificador de base de dados sem erros críticos (2 avisos: extensão no schema público e `is_platform_admin` executável por utilizadores autenticados — este último é intencional).

## 3. Qualidade de código

- Toda a aplicação num só ficheiro, com **450 funções globais** e sem módulos, testes ou verificação de tipos. É hoje o maior risco de manutenção.
- Duplicação clara: carregamento do leitor de PDF repetido três vezes (`:8606`, `:8712`, `:8812`); cartão de glossário repetido em cinco blocos (`:2198`–`:2493`).
- Bibliotecas de leitura (pdf.js, epub.js) carregadas de CDN externo em tempo de execução, sem alternativa se o CDN falhar.
- Duas abordagens paralelas de tradução: o dicionário `STRINGS` e chamadas `T(...)`/`myLibT(...)` com texto embutido.
- Erros: muitos `catch` genéricos com mensagem única ("Não foi possível abrir este PDF"), sem distinguir causas.
- Dependências: várias por usar (recharts, embla-carousel, vaul, react-day-picker, input-otp, cmdk e a maioria dos componentes Radix) — o app real não usa React.

## 4. Desempenho e custo

- Consultas sem limite no painel admin: `user_books` (`:9221`), `profiles` (`:9228`), `study_progress` (`:9317`, `:9824`) trazem tudo, sem paginação.
- Relatórios fazem um cruzamento em memória com `.find()` dentro de um ciclo (`:9838`) — custo cresce com alunos × temas.
- Leitor de PDF renderiza o documento inteiro a cada mudança de zoom, sem virtualização de páginas.
- Índices de base de dados estão bem cobertos (HNSW nos vetores, chaves compostas nas tabelas de estudo). Falta índice em `audit_events(created_at)`.
- Escala do RAG: ~82 MB de vetores para apenas 4 livros. A 50 livros o custo passa a ser relevante; não há política de limpeza de `book_chunks` órfãos nem limite de páginas por livro além de 400/1000.

## 5. Funcionalidades incompletas

- **Login social (Google/Apple/Microsoft)**: botões existem mas só mostram "em breve" (`oauthStub`, `:7746`).
- **Termos de Uso**: link e item das definições apenas mostram "Recurso ilustrativo neste protótipo" (`:1519`, `:1616`, `:6241`).
- **Traduções em falta**: seis cartões do painel admin usam chaves inexistentes (`admin.mgmt.videos/images/content/questions/tutor/library`, `:9105-9109`) e aparecem no ecrã como texto técnico bruto em todos os idiomas.
- **Textos desatualizados**: os subtítulos "Em breve" de Casos Clínicos, Tutor e Perfil (`:5307-5311`) contradizem funcionalidades que já estão implementadas.
- **Casos Clínicos está completo** (geração por IA, 10 passos, registo em `clinical_cases`) — apenas 1 caso registado até agora.
- **Secção "Biblioteca dos alunos"** nos relatórios está funcional, mas com traduções embutidas em vez do dicionário.
- Sem dados reais ainda em `study_progress`, `study_events`, `push_subscriptions` e `pwa_installs` (0 registos) — as funcionalidades existem mas nunca foram usadas em produção.

## 6. Bugs em aberto

- Lista da biblioteca: `refreshMyBooks` (`:8650`) só mostra livros com estado `ready`, pelo que um livro acabado de carregar (ainda a indexar/OCR) desaparece da lista até terminar — é a causa provável do "só atualiza depois de recarregar".
- Leitor de PDF: depende de CDN externo, sem plano B, e bloqueia em documentos grandes.
- Sem tratamento visível para livros cujo processamento falha (`index_error` fica na base de dados sem aviso ao admin).

## 7. Recomendações priorizadas

**Crítico**
1. Validar mesmo o código de 2FA do admin, ou remover os campos para não dar falsa segurança.
2. Escapar título/autor na lista da biblioteca (`:8678-8679`).
3. Limitar o uso do Tutor, pesquisa e OCR por utilizador e por hora nos endpoints do servidor.
4. Deixar de usar a chave Anthropic no browser: encaminhar o Claude pelo mesmo endpoint dos outros modelos.
5. Proteger o endpoint de lembretes com um segredo próprio em vez da chave pública.

**Importante**

6. Definir as seis traduções em falta do painel admin e atualizar os textos "em breve".
7. Mostrar livros em processamento na lista (estados "a indexar"/"falhou") e avisar o admin quando a indexação falha.
8. Paginar as consultas do painel admin e substituir o cruzamento em memória por um mapa único.
9. Ativar confirmação de email (ou decidir explicitamente manter desativada).
10. Concluir ou remover login social e Termos de Uso.

**Desejável**

11. Dividir `public/app.html` em ficheiros por área (auth, biblioteca, tutor, casos, admin) para tornar a manutenção viável.
12. Servir pdf.js/epub.js a partir do próprio site e virtualizar páginas no leitor.
13. Remover dependências não usadas para reduzir o tamanho do site público.
14. Definir política de limpeza e limites para os vetores da biblioteca à medida que cresce.

## Notas técnicas

Nenhuma alteração de código foi feita. Os números de linha referem-se ao estado atual de `public/app.html`. Os dados de tabelas, índices, políticas RLS, cron e armazenamento foram lidos diretamente da base de dados de produção.
