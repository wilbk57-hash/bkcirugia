# Ligar a autenticação do BK-CIRURGIA ao backend deste projeto

## Situação atual (verificada)

O app é o ficheiro estático `public/app.html`, carregado num iframe pela página inicial. Ele **já contém toda a lógica de autenticação escrita** (login, registo em 3 passos, recuperação de senha, login de administrador, painel admin, biblioteca do utilizador). O problema é que aponta para um backend **externo/antigo** (`lcmfpvnahmzhekaobsqw`) e não para a base de dados deste projeto, que está vazia (sem tabelas, funções, triggers ou buckets).

Logo, não é preciso reescrever nada de UI: basta apontar o app para este backend e criar o esquema que o código já espera.

## O que vai ser feito

### 1. Base de dados (migração)
- **`profiles`** — ligada ao utilizador autenticado: nome, email, telefone, país, role (`aluno` / `professor` / `admin`), instituição, curso, ano, estado (`active` / `suspended`).
- **`admin_roles`** — tabela separada que define quem é administrador (com nível). As permissões nunca ficam guardadas no perfil, por segurança.
- **`user_books`** — livros carregados por cada utilizador (título, autor, edição, categoria, idioma, ficheiro, tamanho).
- **`audit_events`** + função `log_event` — registo de eventos (login, registo, ações de admin) que o app já chama.
- **Trigger de criação automática de perfil** quando alguém se regista.
- **Regras de acesso**: cada utilizador só vê e edita o seu próprio perfil e os seus próprios livros; administradores podem ver todos os perfis e bloquear/desbloquear utilizadores.
- **Espaço de ficheiros privado** `user-books`, onde cada utilizador só acede aos seus ficheiros.

### 2. Ligação do app ao backend
- Substituir no `public/app.html` o endereço e a chave pública do backend antigo pelos deste projeto. É a única alteração ao ficheiro do app — **zero mudanças de design ou conteúdo**.

### 3. Fluxo dos botões (já existentes)
- **Entrar** → login por email/senha; se a conta estiver suspensa, o acesso é recusado.
- **Criar conta** → registo com email/senha; o perfil é criado automaticamente e completado com os dados dos 3 passos.
- **Acesso Administrativo** → ecrã de login separado que já existe; depois de autenticar, verifica no servidor se o email consta em `admin_roles`. Se não constar, a sessão é terminada e o acesso negado. Só admins veem o painel administrativo.

### 4. Configuração de autenticação
- Email/senha ativo. Confirmação de email mantém-se no comportamento por defeito (o app já mostra o ecrã "verifica o teu email"). Se preferires entrar logo após o registo, digo-me e ativo a confirmação automática.

## Detalhes técnicos
- Migração SQL única com `CREATE TABLE` + `GRANT` + RLS + políticas, função `has_admin_role()` do tipo `security definer` para evitar recursão nas políticas, trigger `handle_new_user()` em `auth.users`, e políticas de storage no bucket `user-books`.
- O primeiro administrador é concedido inserindo uma linha em `admin_roles` para o teu email depois de criares a conta pelo ecrã "Criar conta de administrador".

## A confirmar
- Qual o email que deve ficar como administrador principal?
