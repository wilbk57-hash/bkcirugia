CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION vector SET SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.match_book_chunks(
  query_embedding extensions.vector(1536),
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
SET search_path = public, extensions
AS $$
  SELECT c.id, c.book_id, c.content, c.page,
         1 - (c.embedding OPERATOR(extensions.<=>) query_embedding) AS similarity
  FROM public.book_chunks c
  WHERE c.user_id = auth.uid()
    AND (filter_book_id IS NULL OR c.book_id = filter_book_id)
  ORDER BY c.embedding OPERATOR(extensions.<=>) query_embedding
  LIMIT LEAST(GREATEST(match_count, 1), 20);
$$;

GRANT EXECUTE ON FUNCTION public.match_book_chunks(extensions.vector, integer, uuid) TO authenticated;
GRANT USAGE ON SCHEMA extensions TO authenticated, service_role, anon;
