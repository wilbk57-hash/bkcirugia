CREATE OR REPLACE FUNCTION public.has_access(_uid uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL THEN false
    WHEN public.is_platform_admin() THEN true
    WHEN _uid IS DISTINCT FROM auth.uid() THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.subscriptions s JOIN public.profiles p ON p.id = s.user_id
      WHERE s.user_id = _uid AND s.paid_until > now() AND p.status = 'active')
  END;
$$;
REVOKE EXECUTE ON FUNCTION public.has_access(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_access(uuid) TO authenticated, service_role;

ALTER POLICY user_books_select_published_or_admin ON public.user_books
  USING (public.is_platform_admin() OR (published AND public.has_access()));

ALTER POLICY book_chunks_select_published_or_admin ON public.book_chunks
  USING ((SELECT public.is_platform_admin()) OR ((SELECT public.has_access()) AND EXISTS (
    SELECT 1 FROM public.user_books b WHERE b.id = book_chunks.book_id AND b.published)));

ALTER POLICY official_books_read ON storage.objects
  USING (bucket_id = 'user-books' AND (public.is_platform_admin() OR (public.has_access() AND EXISTS (
    SELECT 1 FROM public.user_books b WHERE b.file_path = objects.name AND b.published AND b.status <> 'removed'))));