CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

CREATE TABLE public.book_chunks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.user_books(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  content text NOT NULL,
  page integer,
  embedding vector(1536) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (book_id, chunk_index)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_chunks TO authenticated;
GRANT ALL ON public.book_chunks TO service_role;

ALTER TABLE public.book_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "book_chunks_select_own" ON public.book_chunks
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "book_chunks_insert_own" ON public.book_chunks
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "book_chunks_delete_own" ON public.book_chunks
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX book_chunks_book_id_idx ON public.book_chunks (book_id);
CREATE INDEX book_chunks_user_id_idx ON public.book_chunks (user_id);
CREATE INDEX book_chunks_embedding_idx ON public.book_chunks
  USING hnsw (embedding vector_cosine_ops);

ALTER TABLE public.user_books
  ADD COLUMN IF NOT EXISTS index_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS index_error text,
  ADD COLUMN IF NOT EXISTS chunk_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS page_count integer,
  ADD COLUMN IF NOT EXISTS indexed_at timestamp with time zone;

CREATE OR REPLACE FUNCTION public.match_book_chunks(
  query_embedding vector(1536),
  match_count integer DEFAULT 6,
  filter_book_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  book_id uuid,
  content text,
  page integer,
  similarity double precision
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT c.id, c.book_id, c.content, c.page,
         1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.book_chunks c
  WHERE c.user_id = auth.uid()
    AND (filter_book_id IS NULL OR c.book_id = filter_book_id)
  ORDER BY c.embedding <=> query_embedding
  LIMIT LEAST(GREATEST(match_count, 1), 20);
$$;

GRANT EXECUTE ON FUNCTION public.match_book_chunks(vector, integer, uuid) TO authenticated;
