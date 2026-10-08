CREATE TABLE public.direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  from_admin boolean NOT NULL DEFAULT false,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX direct_messages_student_idx ON public.direct_messages(student_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated;
GRANT ALL ON public.direct_messages TO service_role;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY dm_select ON public.direct_messages FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY dm_insert ON public.direct_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND (
    (from_admin = false AND student_id = auth.uid())
    OR (from_admin = true AND public.is_platform_admin())));
CREATE POLICY dm_update ON public.direct_messages FOR UPDATE TO authenticated
  USING (student_id = auth.uid() OR public.is_platform_admin())
  WITH CHECK (student_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY dm_delete ON public.direct_messages FOR DELETE TO authenticated
  USING (public.is_platform_admin());