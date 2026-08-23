-- 1. is_admin: keep SECURITY DEFINER (needed by RLS) but prevent enumeration of other users' admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL OR _user_id = auth.uid() THEN
      EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = _user_id)
    ELSE false
  END;
$$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

-- 2. log_event: no longer needs elevated privileges; runs as the caller and is gated by RLS
CREATE OR REPLACE FUNCTION public.log_event(p_event text, p_detail jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_events (user_id, event, detail)
  VALUES (auth.uid(), left(p_event, 120), p_detail);
END;
$$;

REVOKE ALL ON FUNCTION public.log_event(text, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_event(text, jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.log_event(text, jsonb) TO authenticated, service_role;

DROP POLICY IF EXISTS audit_events_insert_own ON public.audit_events;
CREATE POLICY audit_events_insert_own ON public.audit_events
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.audit_events FROM authenticated;
REVOKE ALL ON public.audit_events FROM anon;
GRANT SELECT, INSERT ON public.audit_events TO authenticated;
GRANT ALL ON public.audit_events TO service_role;

-- 3. admin_roles: explicitly deny all client-side writes
DROP POLICY IF EXISTS admin_roles_no_insert ON public.admin_roles;
CREATE POLICY admin_roles_no_insert ON public.admin_roles
  AS RESTRICTIVE
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS admin_roles_no_update ON public.admin_roles;
CREATE POLICY admin_roles_no_update ON public.admin_roles
  AS RESTRICTIVE
  FOR UPDATE TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS admin_roles_no_delete ON public.admin_roles;
CREATE POLICY admin_roles_no_delete ON public.admin_roles
  AS RESTRICTIVE
  FOR DELETE TO anon, authenticated
  USING (false);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.admin_roles FROM authenticated;
REVOKE ALL ON public.admin_roles FROM anon;
GRANT SELECT ON public.admin_roles TO authenticated;
GRANT ALL ON public.admin_roles TO service_role;

-- 4. user_books: admins may read for reporting, but only the owner may write
DROP POLICY IF EXISTS user_books_insert_owner_only ON public.user_books;
CREATE POLICY user_books_insert_owner_only ON public.user_books
  AS RESTRICTIVE
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS user_books_update_owner_only ON public.user_books;
CREATE POLICY user_books_update_owner_only ON public.user_books
  AS RESTRICTIVE
  FOR UPDATE TO anon, authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS user_books_delete_owner_only ON public.user_books;
CREATE POLICY user_books_delete_owner_only ON public.user_books
  AS RESTRICTIVE
  FOR DELETE TO anon, authenticated
  USING (user_id = auth.uid());

REVOKE ALL ON public.user_books FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_books TO authenticated;
GRANT ALL ON public.user_books TO service_role;