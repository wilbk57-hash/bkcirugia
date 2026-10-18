# Impor a assinatura no servidor

Objetivo: só quem é admin, ou tem assinatura válida e conta ativa, consegue ler livros, trechos e ficheiros, e usar o Tutor e a pesquisa, mesmo chamando a API diretamente. O pagamento continua acessível a todos.

## O que muda

1. **Nova função `public.has_access(_uid uuid default auth.uid())`**: devolve true quando `is_platform_admin()` é verdadeiro, ou quando há uma linha em `subscriptions` com `user_id = _uid` e `paid_until > now()` e o perfil desse utilizador tem `status = 'active'`.
   - É `SECURITY DEFINER`, `STABLE`, com `search_path = public`.
   - Retira o EXECUTE a `PUBLIC` e a `anon` e dá-o só a `authenticated` e `service_role`.
   - Se `_uid` for diferente de `auth.uid()`, devolve false, exceto para o admin. Assim um aluno não consegue saber se outro aluno pagou.
2. **Leitura protegida no banco**. Os comandos `ALTER POLICY` só mudam a cláusula USING:
   - `user_books_select_published_or_admin` passa a `is_platform_admin() OR (published AND has_access())`.
   - `book_chunks_select_published_or_admin` passa a `(select is_platform_admin()) OR ((select has_access()) AND EXISTS(livro publicado))`. O `(select ...)` faz o resultado ficar em cache na consulta, para a pesquisa não ficar mais lenta.
   - Em `storage.objects`, `official_books_read` passa a `bucket 'user-books' AND (is_platform_admin() OR (has_access() AND EXISTS(livro publicado e não removido)))`.
   - `match_library_chunks`: confirmei que é SECURITY INVOKER, porque não tem `SECURITY DEFINER`. Por isso já obedece às regras de leitura de `book_chunks` e de `user_books`, e passa a devolver 0 linhas a quem não tem acesso. `match_book_chunks` também é INVOKER e fica protegida da mesma forma. Nenhuma das duas precisa de mudar.
3. **Servidor (`/api/tutor` e `/api/books/search`)**: depois de autenticar e verificar a suspensão, chama `caller.supabase.rpc('has_access')`.
   - Se der false, responde 402 `{"error":"subscription_required"}`.
   - Se a chamada falhar, responde 503 e não 402. Uma falha técnica nunca bloqueia o aluno.
4. **App (`public/app.html`)**:
   - Quando o Tutor recebe 402 `subscription_required`, chama `bkAccessCheck()` para abrir a tela `#bkPayGate`, em vez de mostrar o erro genérico.
   - Quando a pesquisa (`fetchMyBooksContext`) recebe 402, abre o mesmo bloqueio e não envia a pergunta ao Tutor.
   - Quando o leitor falha no `createSignedUrl` com "Object not found" ou 400/403, e o aluno não é admin, chama `bkAccessCheck()`. Se o aluno tiver acesso, mostra o erro de leitura atual.
   - Para isso há uma função pequena, `bkShowPayGate()`, que reutiliza o bloqueio existente sem mudar o seu aspeto.
5. **CORS** em `/api/tutor`, `/api/books/search`, `/api/books/ocr` e `/api/books/reindex`:
   - Origens permitidas, numa lista fixa: `https://localhost`, `capacitor://localhost` e `https://bkcirugia.lovable.app`. Nunca `*`.
   - Há um handler `OPTIONS` que responde 204.
   - Todas as respostas levam `Access-Control-Allow-Origin` com a origem pedida, só se ela estiver na lista, mais `Vary: Origin`, `Allow-Headers: Authorization, Content-Type` e `Allow-Methods: POST, OPTIONS`.
   - Fica tudo num ficheiro novo, `src/lib/cors.server.ts`, partilhado pelas quatro rotas.

## (a) Ficheiros e migrações

- Migração nova `0014_enforce_subscription_access`: cria `has_access` e os GRANTs e faz 3 `ALTER POLICY`.
- `src/routes/api/tutor.ts` e `src/routes/api/books/search.ts`: verificação de acesso e CORS.
- `src/routes/api/books/ocr.ts` e `src/routes/api/books/reindex.ts`: só CORS, porque já são exclusivas do admin.
- `src/lib/cors.server.ts`: ficheiro novo.
- `public/app.html`: tratamento do 402 no Tutor, na pesquisa e no leitor.
- `tests/subscription-access.test.js` (novo), mais `AGENTS.md` e `roadmap.md`.

## (b) Riscos de bloquear alguém indevidamente

- **Admin**: o primeiro teste de `has_access` é `is_platform_admin()`, que não depende de `subscriptions` nem de `status`. As regras de escrita e as rotas de OCR e reindexação não mudam.
- **Pagamento**: nada do fluxo de pagamento usa `has_access`. Isso inclui `payment_submissions`, os comprovativos em `payment-receipts`, `get_payment_info` e a leitura de `subscriptions`. Um aluno com o teste vencido continua a conseguir pagar e a carregar o comprovativo. Quando o admin aprova, grava `paid_until` em `subscriptions`, e o acesso volta logo no pedido seguinte, porque nada fica em cache entre pedidos.
- **Alunos com o teste vencido (3 a 4)**: deixam de ver os livros e de usar o Tutor pela API. Isto é o que se pretende, e o ecrã já os bloqueia hoje.
- **Aluno com assinatura mensal**: mantém o acesso enquanto `paid_until > now()` e a conta estiver ativa. Antes de aplicar, vou confirmar os dados reais desse aluno com uma consulta só de leitura.
- **Contas novas**: o gatilho que dá 1 dia de teste cria a linha em `subscriptions` no momento do registo, por isso essas contas têm acesso logo.
- **Aluno sem linha em `subscriptions`**: fica sem acesso. Antes de aplicar, vou listar estes casos (só leitura) e avisar se houver algum.
- **Fuso horário e relógio**: a comparação usa `now()` no banco, e não o relógio do telemóvel.
- **Falhas técnicas**: devolvem 503, nunca 402. O Tutor já responde sem os livros quando a pesquisa falha. No caso do 402 não responde, porque a falta de acesso é intencional.

## (c) Leitura de livros no leitor

- Continua a funcionar para quem tem acesso. `createSignedUrl` corre com o token do aluno, e a regra `official_books_read` só deixa passar quem tem `has_access()` true.
- Depois de criado, o link assinado é válido durante 2 minutos, independentemente das regras. É um risco pequeno e aceitável.
- O índice de capítulos (`contents` em `user_books`) também passa a exigir acesso.

## (d) Testes, sem contas de teste permanentes

- Testes unitários com o padrão atual (`node --test`, cliente simulado):
  - O servidor responde 402 quando `has_access` é false e 503 quando o RPC falha.
  - O CORS só aceita as 3 origens da lista.
  - O `OPTIONS` responde 204.
  - O app abre `#bkPayGate` quando recebe 402.
- Testes no banco, dentro de uma transação com `ROLLBACK`: simular cada utilizador com `set local role authenticated` e `request.jwt.claims` e verificar estes casos:
  - O admin vê os livros, os trechos e os ficheiros.
  - O aluno com assinatura mensal vê tudo.
  - Um aluno com o teste vencido vê 0 linhas e `match_library_chunks` devolve 0 linhas.
  - Um aluno suspenso, simulado com um UPDATE dentro da mesma transação, vê 0 linhas.
  - `has_access` não pode ser executada por `anon`.
  - Depois do `ROLLBACK` não fica nada gravado.
- Testes no navegador com Playwright e sessões existentes, iniciadas com `lovable auth-session`:
  - Sessão do admin: o Tutor responde com fontes e o leitor abre um livro.
  - Sessão de um aluno com o teste vencido (pedindo a tua aprovação): aparece o bloqueio, e a chamada direta a `/api/tutor` devolve 402.
  - Não se cria nem se apaga nenhuma conta.
- Medir de novo o tempo da pesquisa, para confirmar que continua abaixo de cerca de 0,5 s.
