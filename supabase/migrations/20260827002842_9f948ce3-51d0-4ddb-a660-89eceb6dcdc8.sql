-- 1) helper: is the current user a platform admin?
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

-- 2) user_books becomes the shared official library
DROP POLICY IF EXISTS user_books_own ON public.user_books;
DROP POLICY IF EXISTS user_books_select_admin ON public.user_books;
DROP POLICY IF EXISTS user_books_insert_owner_only ON public.user_books;
DROP POLICY IF EXISTS user_books_update_owner_only ON public.user_books;
DROP POLICY IF EXISTS user_books_delete_owner_only ON public.user_books;

CREATE POLICY user_books_select_all_authenticated ON public.user_books
  FOR SELECT TO authenticated USING (true);
CREATE POLICY user_books_admin_insert ON public.user_books
  FOR INSERT TO authenticated WITH CHECK (public.is_platform_admin());
CREATE POLICY user_books_admin_update ON public.user_books
  FOR UPDATE TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
CREATE POLICY user_books_admin_delete ON public.user_books
  FOR DELETE TO authenticated USING (public.is_platform_admin());

-- global duplicate detection
CREATE UNIQUE INDEX IF NOT EXISTS user_books_file_hash_key ON public.user_books (file_hash) WHERE file_hash IS NOT NULL;

-- 3) book_chunks: readable by every authenticated student, writable by admins
DROP POLICY IF EXISTS book_chunks_select_own ON public.book_chunks;
DROP POLICY IF EXISTS book_chunks_insert_own ON public.book_chunks;
DROP POLICY IF EXISTS book_chunks_update_own ON public.book_chunks;
DROP POLICY IF EXISTS book_chunks_delete_own ON public.book_chunks;

CREATE POLICY book_chunks_select_all_authenticated ON public.book_chunks
  FOR SELECT TO authenticated USING (true);
CREATE POLICY book_chunks_admin_insert ON public.book_chunks
  FOR INSERT TO authenticated WITH CHECK (public.is_platform_admin());
CREATE POLICY book_chunks_admin_update ON public.book_chunks
  FOR UPDATE TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
CREATE POLICY book_chunks_admin_delete ON public.book_chunks
  FOR DELETE TO authenticated USING (public.is_platform_admin());

-- 4) shared vector search across the whole official library
CREATE OR REPLACE FUNCTION public.match_book_chunks(
  query_embedding extensions.vector,
  match_count integer DEFAULT 6,
  filter_book_id uuid DEFAULT NULL::uuid
)
RETURNS TABLE(id uuid, book_id uuid, content text, page integer, similarity double precision)
LANGUAGE sql
STABLE
SET search_path TO 'public', 'extensions'
AS $$
  SELECT c.id, c.book_id, c.content, c.page,
         1 - (c.embedding OPERATOR(extensions.<=>) query_embedding) AS similarity
  FROM public.book_chunks c
  WHERE (filter_book_id IS NULL OR c.book_id = filter_book_id)
  ORDER BY c.embedding OPERATOR(extensions.<=>) query_embedding
  LIMIT LEAST(GREATEST(match_count, 1), 20);
$$;

-- 5) storage: read for any authenticated student, write for admins only
DROP POLICY IF EXISTS user_books_files_select ON storage.objects;
DROP POLICY IF EXISTS user_books_files_insert ON storage.objects;
DROP POLICY IF EXISTS user_books_files_update ON storage.objects;
DROP POLICY IF EXISTS user_books_files_delete ON storage.objects;

CREATE POLICY official_books_read ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'user-books');
CREATE POLICY official_books_admin_insert ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-books' AND public.is_platform_admin());
CREATE POLICY official_books_admin_update ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'user-books' AND public.is_platform_admin())
  WITH CHECK (bucket_id = 'user-books' AND public.is_platform_admin());
CREATE POLICY official_books_admin_delete ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'user-books' AND public.is_platform_admin());