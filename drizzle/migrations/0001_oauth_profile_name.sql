CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;