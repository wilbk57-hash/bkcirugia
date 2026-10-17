ALTER POLICY book_chunks_select_published_or_admin ON public.book_chunks USING ((SELECT public.is_platform_admin()) OR EXISTS (SELECT 1 FROM public.user_books b WHERE b.id = book_chunks.book_id AND b.published));
CREATE OR REPLACE FUNCTION public.match_library_chunks(query_embedding extensions.vector, match_count integer DEFAULT 12)
RETURNS TABLE(id uuid, book_id uuid, content text, page integer, similarity double precision)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, extensions AS $$
 SELECT picked.id, picked.book_id, picked.content, picked.page, 1 - picked.distance AS similarity
 FROM public.user_books b
 CROSS JOIN LATERAL (
   SELECT c.id, c.book_id, c.content, c.page,
          c.embedding OPERATOR(extensions.<=>) query_embedding AS distance
   FROM public.book_chunks c
   WHERE c.book_id = b.id
   ORDER BY c.embedding OPERATOR(extensions.<=>) query_embedding
   LIMIT 3
 ) picked
 WHERE b.index_status = 'ready' AND b.published AND b.status <> 'removed'
 ORDER BY picked.distance
 LIMIT LEAST(GREATEST(match_count, 1), 24);
$$;
REVOKE ALL ON FUNCTION public.match_library_chunks(extensions.vector,integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_library_chunks(extensions.vector,integer) TO authenticated, service_role;