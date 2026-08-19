DO $$
DECLARE uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'ocrtest1787135930@example.com';
  IF uid IS NOT NULL THEN
    DELETE FROM public.book_chunks WHERE user_id = uid;
    DELETE FROM public.user_books WHERE user_id = uid;
    DELETE FROM public.admin_roles WHERE user_id = uid;
    DELETE FROM public.profiles WHERE id = uid;
    DELETE FROM auth.users WHERE id = uid;
  END IF;
END $$;