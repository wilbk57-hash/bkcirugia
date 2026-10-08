ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_lang text CHECK (admin_lang IN ('pt','en','es'));

ALTER TABLE public.user_books ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS user_books_select_all_authenticated ON public.user_books;
CREATE POLICY user_books_select_published_or_admin ON public.user_books
  FOR SELECT TO authenticated
  USING (published OR public.is_platform_admin());

DROP POLICY IF EXISTS book_chunks_select_all_authenticated ON public.book_chunks;
CREATE POLICY book_chunks_select_published_or_admin ON public.book_chunks
  FOR SELECT TO authenticated
  USING (
    public.is_platform_admin()
    OR EXISTS (SELECT 1 FROM public.user_books b WHERE b.id = book_chunks.book_id AND b.published)
  );