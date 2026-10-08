CREATE TABLE public.feedback_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  admin_id uuid NOT NULL,
  reply text NOT NULL CHECK (char_length(reply) BETWEEN 1 AND 4000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX feedback_replies_event_idx ON public.feedback_replies(event_id);
CREATE INDEX feedback_replies_user_idx ON public.feedback_replies(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback_replies TO authenticated;
GRANT ALL ON public.feedback_replies TO service_role;
ALTER TABLE public.feedback_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY feedback_replies_select ON public.feedback_replies FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY feedback_replies_insert_admin ON public.feedback_replies FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_admin() AND admin_id = auth.uid());
CREATE POLICY feedback_replies_update ON public.feedback_replies FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY feedback_replies_delete_admin ON public.feedback_replies FOR DELETE TO authenticated
  USING (public.is_platform_admin());
CREATE POLICY audit_events_select_own_feedback ON public.audit_events FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND (event LIKE 'feedback\_%' OR event = 'app_rating'));
CREATE INDEX IF NOT EXISTS audit_events_feedback_idx ON public.audit_events(event, created_at DESC) WHERE event LIKE 'feedback\_%' OR event = 'app_rating';