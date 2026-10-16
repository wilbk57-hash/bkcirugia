CREATE TABLE public.payment_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.payment_settings (key, value) VALUES
  ('mtn_number', ''),
  ('price_monthly', '1500'),
  ('price_quarterly', '3500'),
  ('price_yearly', '10000');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_settings TO authenticated;
GRANT ALL ON public.payment_settings TO service_role;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY payment_settings_select ON public.payment_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY payment_settings_admin ON public.payment_settings FOR ALL TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE TABLE public.payment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL CHECK (plan IN ('monthly','quarterly','yearly')),
  amount numeric(12,2) NOT NULL,
  sender_phone text NOT NULL DEFAULT '',
  receipt_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note text NOT NULL DEFAULT '',
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payment_submissions_user_idx ON public.payment_submissions(user_id, created_at DESC);
CREATE INDEX payment_submissions_status_idx ON public.payment_submissions(status, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_submissions TO authenticated;
GRANT ALL ON public.payment_submissions TO service_role;
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY payment_submissions_select ON public.payment_submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY payment_submissions_insert ON public.payment_submissions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY payment_submissions_admin_update ON public.payment_submissions FOR UPDATE TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
CREATE POLICY payment_submissions_admin_delete ON public.payment_submissions FOR DELETE TO authenticated
  USING (public.is_platform_admin());

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'monthly' CHECK (plan IN ('monthly','quarterly','yearly')),
  paid_until timestamptz NOT NULL,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_select ON public.subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY subscriptions_admin_write ON public.subscriptions FOR ALL TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

-- Comprovativos: cada aluno escreve/lê apenas a sua pasta; o admin lê tudo
CREATE POLICY payment_receipts_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY payment_receipts_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payment-receipts' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_platform_admin()));
CREATE POLICY payment_receipts_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'payment-receipts' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_platform_admin()));
