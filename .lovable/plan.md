# Tutor com RAG sobre os livros pessoais do aluno

## Respostas às tuas perguntas

**1. pgvector?** Sim. Verifiquei na base de dados deste projeto: a extensão `vector` está disponível na versão 0.8.2 (ainda não ativada). Dá para usar armazenamento vetorial nativo, sem serviço externo. Ativamos com uma migração e usamos índice HNSW.

**2. Extrair texto no servidor.** O backend deste projeto corre num runtime tipo Cloudflare Worker: não há `child_process`, nem binários nativos (por isso `pdf-parse`, `poppler`, `sharp` estão fora). Funciona bem:
- **PDF**: `unpdf` (JavaScript puro, feito para edge) — extrai o texto de PDFs com camada de texto.
- **EPUB**: `fflate` (JS puro) para abrir o ZIP + leitura do OPF/XHTML e limpeza das tags. Sem dependências nativas.
- **PDF digitalizado (imagem)**: não tem texto para extrair — precisa de OCR, que não corre neste runtime. Fica para uma fase posterior (ver fase 4).

**3. Modelo de embeddings.** O gateway do Lovable já tem endpoint de embeddings e usa a credencial que já existe no projeto (`LOVABLE_API_KEY`) — nenhuma chave nova tua. Uso `openai/text-embedding-3-small` (1536 dimensões): é o mais barato por token e o mais indicado para pesquisa em volume, e cabe diretamente num índice HNSW normal.

**4. Fluxo**

```text
upload do livro (browser, como hoje)
        v
 marca o livro como "a processar"
        v
 servidor descarrega o ficheiro do storage privado
        v
 extrai texto (unpdf / fflate+OPF)
        v
 divide em pedaços de ~1200 caracteres com sobreposição
        v
 embeddings em lotes -> gateway Lovable
        v
 guarda em book_chunks (user_id, book_id, texto, vetor)
        v
 marca o livro como "pronto"

aluno pergunta ao tutor
        v
 embedding da pergunta (servidor)
        v
 pesquisa vetorial FILTRADA por user_id do token
        v
 top 6 pedaços -> injetados no prompt do tutor
        v
 resposta com indicação do livro/página de origem
```

**Isolamento por aluno (regra rígida):** o `user_id` nunca vem do browser — vem do token verificado no servidor. A função de pesquisa filtra sempre por esse `user_id`, e a tabela tem RLS a permitir ler só as próprias linhas. Duas barreiras independentes; é impossível um aluno ver pedaços de outro.

**5. Esforço e risco.** É a maior funcionalidade até agora. Proponho quatro fases entregáveis, com a fase 1 já útil sozinha:

- **Fase 1 — PDFs com texto (núcleo).** Tabela + pgvector + extração + embeddings + pesquisa + tutor a usar o contexto. Risco médio: livros grandes podem demorar; limito a ~400 páginas por livro nesta fase.
- **Fase 2 — EPUB.** Reaproveita tudo; só muda o extrator. Risco baixo.
- **Fase 3 — Interface.** Indicador "livro pronto para o tutor" na Minha Biblioteca, botão para reprocessar, e no tutor um seletor "perguntar sobre os meus livros". Risco baixo.
- **Fase 4 — PDFs digitalizados (OCR).** Requer serviço externo de OCR (custo) ou OCR no browser do aluno. Decidimos só quando chegarmos lá; nesta fase o app apenas avisa "este livro não tem texto pesquisável".

Riscos a vigiar: tempo de execução por pedido no servidor (resolvo processando por lotes, retomável), custo de embeddings (um livro de 300 páginas ≈ 150k tokens, valor baixo mas real, e é debitado dos créditos de IA do projeto), e espaço em base de dados.

## Detalhes técnicos

- Migração: `create extension vector`; tabela `book_chunks (id, user_id, book_id -> user_books, chunk_index, content, page int, embedding vector(1536), created_at)`; GRANTs para `authenticated`/`service_role`; RLS `auth.uid() = user_id` em select/insert/delete; índice HNSW `vector_cosine_ops`; colunas novas em `user_books`: `index_status`, `index_error`, `chunk_count`.
- Função SQL `match_book_chunks(query_embedding, match_user_id, match_count, filter_book_id)` como `security invoker`, sempre com `where user_id = auth.uid()`.
- Rotas: `src/routes/api/books/index.ts` (POST: processa um livro, em lotes retomáveis, verifica o token como já faz `/api/tutor`) e alteração em `src/routes/api/tutor.ts` para embutir os pedaços recuperados no system prompt, com uma secção "Excertos dos livros do aluno".
- `public/app.html`: após upload chama a rota de indexação e mostra o estado; no tutor passa a enviar `useMyBooks: true`. Sem alterações de design nem de CSS.
- Dependências novas: `unpdf`, `fflate`. Ambas JS puro, compatíveis com o runtime.

## A confirmar

1. Avanço já com a fase 1 (PDFs com texto) e as seguintes depois, ou queres tudo de uma vez?
2. A indexação deve ser automática em cada upload, ou só quando o aluno carregar em "preparar para o tutor" (mais controlo sobre gastos)?
