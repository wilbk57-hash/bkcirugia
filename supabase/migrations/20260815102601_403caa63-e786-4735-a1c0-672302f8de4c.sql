CREATE POLICY "user_books_select_admin" ON public.user_books
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));