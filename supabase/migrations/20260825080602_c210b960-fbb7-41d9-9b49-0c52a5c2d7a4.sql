CREATE TABLE public.clinical_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id text,
  title text NOT NULL DEFAULT '',
  data_json jsonb NOT NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clinical_cases TO authenticated;
GRANT ALL ON public.clinical_cases TO service_role;

ALTER TABLE public.clinical_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY clinical_cases_select_own ON public.clinical_cases FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY clinical_cases_insert_own ON public.clinical_cases FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY clinical_cases_update_own ON public.clinical_cases FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY clinical_cases_delete_own ON public.clinical_cases FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX clinical_cases_user_created_idx ON public.clinical_cases (user_id, created_at DESC);

CREATE TRIGGER clinical_cases_set_updated_at BEFORE UPDATE ON public.clinical_cases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();