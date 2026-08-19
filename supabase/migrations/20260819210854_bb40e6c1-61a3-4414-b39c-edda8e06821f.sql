DELETE FROM public.book_chunks WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE 'cp17%@example.com');
DELETE FROM public.user_books WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE 'cp17%@example.com');
DELETE FROM public.admin_roles WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE 'cp17%@example.com');
DELETE FROM public.profiles WHERE email LIKE 'cp17%@example.com';