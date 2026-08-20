CREATE TABLE public.study_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'prova',
  title text NOT NULL,
  topic_id text,
  date date NOT NULL,
  time text,
  description text,
  reminder_offset integer NOT NULL DEFAULT 1,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_events TO authenticated;
GRANT ALL ON public.study_events TO service_role;
ALTER TABLE public.study_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY study_events_select_own ON public.study_events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY study_events_insert_own ON public.study_events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY study_events_update_own ON public.study_events FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY study_events_delete_own ON public.study_events FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER study_events_set_updated_at BEFORE UPDATE ON public.study_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX study_events_user_date_idx ON public.study_events (user_id, date);

CREATE TABLE public.study_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id text NOT NULL,
  lesson_step_id text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_notes TO authenticated;
GRANT ALL ON public.study_notes TO service_role;
ALTER TABLE public.study_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY study_notes_select_own ON public.study_notes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY study_notes_insert_own ON public.study_notes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY study_notes_update_own ON public.study_notes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY study_notes_delete_own ON public.study_notes FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER study_notes_set_updated_at BEFORE UPDATE ON public.study_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX study_notes_user_topic_idx ON public.study_notes (user_id, topic_id);