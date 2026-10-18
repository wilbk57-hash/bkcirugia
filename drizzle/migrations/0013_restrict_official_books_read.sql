DROP POLICY IF EXISTS official_books_read ON storage.objects;
CREATE POLICY official_books_read ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'user-books' AND (
    public.is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.user_books b
      WHERE b.file_path = storage.objects.name
        AND b.published AND b.status <> 'removed'
    )
  )
);