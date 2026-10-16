ALTER TABLE public.user_books ADD COLUMN IF NOT EXISTS contents jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.user_books ADD COLUMN IF NOT EXISTS total_chunks integer;
CREATE OR REPLACE FUNCTION public.match_library_chunks(query_embedding extensions.vector, match_count integer DEFAULT 12)
RETURNS TABLE(id uuid, book_id uuid, content text, page integer, similarity double precision)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, extensions AS $$
 WITH ranked AS (
 SELECT c.id,c.book_id,c.content,c.page,1-(c.embedding OPERATOR(extensions.<=>) query_embedding) AS similarity,
 row_number() OVER (PARTITION BY c.book_id ORDER BY c.embedding OPERATOR(extensions.<=>) query_embedding) AS book_rank
 FROM public.book_chunks c JOIN public.user_books b ON b.id=c.book_id
 WHERE b.index_status='ready' AND b.published AND b.status <> 'removed'
 ) SELECT id,book_id,content,page,similarity FROM ranked WHERE book_rank<=3 ORDER BY similarity DESC LIMIT LEAST(GREATEST(match_count,1),24);
$$;
REVOKE ALL ON FUNCTION public.match_library_chunks(extensions.vector,integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_library_chunks(extensions.vector,integer) TO authenticated, service_role;