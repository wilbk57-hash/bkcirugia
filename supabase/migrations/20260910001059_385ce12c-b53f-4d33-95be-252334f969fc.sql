CREATE TABLE public.pwa_installs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_key text NOT NULL,
  app_version text NOT NULL DEFAULT '1',
  platform text,
  user_agent text,
  display_mode text,
  installed_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, device_key)
);

GRANT SELECT, INSERT, UPDATE ON public.pwa_installs TO authenticated;
GRANT ALL ON public.pwa_installs TO service_role;

ALTER TABLE public.pwa_installs ENABLE ROW LEVEL SECURITY;

CREATE POLICY pwa_installs_select_own_or_admin ON public.pwa_installs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin());

CREATE POLICY pwa_installs_insert_own ON public.pwa_installs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY pwa_installs_update_own ON public.pwa_installs
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TRIGGER pwa_installs_set_updated_at
  BEFORE UPDATE ON public.pwa_installs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX pwa_installs_installed_at_idx ON public.pwa_installs (installed_at DESC);