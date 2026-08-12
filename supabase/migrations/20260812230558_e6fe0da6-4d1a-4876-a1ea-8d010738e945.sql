CREATE OR REPLACE FUNCTION public.grant_primary_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(COALESCE(NEW.email, '')) = 'wilsonbk57@gmail.com' THEN
    INSERT INTO public.admin_roles (user_id, level)
    VALUES (NEW.id, 'superadmin')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.grant_primary_admin() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_primary_admin();

INSERT INTO public.admin_roles (user_id, level)
SELECT id, 'superadmin' FROM auth.users WHERE lower(email) = 'wilsonbk57@gmail.com'
ON CONFLICT (user_id) DO NOTHING;