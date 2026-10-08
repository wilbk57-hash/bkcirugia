CREATE OR REPLACE FUNCTION public.is_platform_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
     AND COALESCE(auth.jwt()->>'aal', 'aal1') = 'aal2';
$function$;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_platform_admin());
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_platform_admin())
  WITH CHECK (id = auth.uid() OR public.is_platform_admin());
DROP POLICY IF EXISTS study_progress_select_own ON public.study_progress;
CREATE POLICY study_progress_select_own ON public.study_progress FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin());
DROP POLICY IF EXISTS audit_events_select_admin ON public.audit_events;
CREATE POLICY audit_events_select_admin ON public.audit_events FOR SELECT TO authenticated
  USING (public.is_platform_admin());