CREATE TABLE public.study_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_progress TO authenticated;
GRANT ALL ON public.study_progress TO service_role;

ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY study_progress_select_own ON public.study_progress
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY study_progress_insert_own ON public.study_progress
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY study_progress_update_own ON public.study_progress
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY study_progress_delete_own ON public.study_progress
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER study_progress_set_updated_at
  BEFORE UPDATE ON public.study_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX study_progress_topic_idx ON public.study_progress (topic_id);
CREATE INDEX study_progress_user_idx ON public.study_progress (user_id);