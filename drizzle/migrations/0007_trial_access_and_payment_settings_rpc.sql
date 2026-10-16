DO $$ DECLARE c text; BEGIN
  SELECT conname INTO c FROM pg_constraint WHERE conrelid='public.subscriptions'::regclass AND contype='c' AND pg_get_constraintdef(oid) ILIKE '%plan%';
  IF c IS NOT NULL THEN EXECUTE format('ALTER TABLE public.subscriptions DROP CONSTRAINT %I', c); END IF;
END $$;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_check CHECK (plan IN ('trial','monthly','quarterly','yearly'));

CREATE OR REPLACE FUNCTION public.grant_trial_access() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, paid_until, updated_at)
  VALUES (NEW.id, 'trial', now() + interval '1 day', now())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS profiles_grant_trial ON public.profiles;
CREATE TRIGGER profiles_grant_trial AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.grant_trial_access();

INSERT INTO public.subscriptions (user_id, plan, paid_until, updated_at)
SELECT p.id, 'trial', now() + interval '1 day', now() FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.user_id = p.id);

CREATE OR REPLACE FUNCTION public.get_payment_info() RETURNS TABLE(key text, value text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT key, value FROM public.payment_settings
  WHERE auth.uid() IS NOT NULL AND key IN ('mtn_number','price_monthly','price_quarterly','price_yearly');
$$;
REVOKE ALL ON FUNCTION public.get_payment_info() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_payment_info() TO authenticated;

DROP POLICY IF EXISTS payment_settings_select ON public.payment_settings;
CREATE POLICY payment_settings_select ON public.payment_settings FOR SELECT TO authenticated USING (public.is_platform_admin());