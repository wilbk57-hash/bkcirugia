-- Replace is_admin() calls in policies with an inline check against admin_roles
-- (admin_roles' own-row SELECT policy makes this safe and self-scoped)

DROP POLICY IF EXISTS audit_events_select_admin ON public.audit_events;
CREATE POLICY audit_events_select_admin ON public.audit_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()));

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()));

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()))
  WITH CHECK (id = auth.uid() OR EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()));

DROP POLICY IF EXISTS study_progress_select_own ON public.study_progress;
CREATE POLICY study_progress_select_own ON public.study_progress
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()));

DROP POLICY IF EXISTS user_books_select_admin ON public.user_books;
CREATE POLICY user_books_select_admin ON public.user_books
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()));

-- The elevated-privilege helper is no longer reachable by signed-in users
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;