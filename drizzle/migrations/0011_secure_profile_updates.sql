REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
REVOKE UPDATE (role, status, email, id, created_at, updated_at) ON public.profiles FROM authenticated;
GRANT UPDATE (name, phone, country, institution, course, year, admin_lang) ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_user_status(_user_id uuid, _status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF public.is_platform_admin() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  IF _status IS NULL OR _status NOT IN ('active', 'suspended') THEN
    RAISE EXCEPTION 'invalid_status' USING ERRCODE = '22023';
  END IF;
  UPDATE public.profiles SET status = _status, updated_at = now() WHERE id = _user_id;
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_set_user_status(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_user_status(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  signup_role text := left(btrim(COALESCE(NEW.raw_user_meta_data->>'role', '')), 120);
BEGIN
  IF signup_role NOT IN ('aluno', 'estudante', 'residente', 'medico', 'professor') THEN
    signup_role := 'aluno';
  END IF;
  INSERT INTO public.profiles (id, name, email, phone, country, role, institution, course, year, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    left(NEW.raw_user_meta_data->>'phone', 120),
    left(NEW.raw_user_meta_data->>'country', 120),
    signup_role,
    left(NEW.raw_user_meta_data->>'institution', 120),
    COALESCE(NULLIF(left(btrim(NEW.raw_user_meta_data->>'course'), 120), ''), 'Medicina'),
    left(NEW.raw_user_meta_data->>'year', 120),
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;