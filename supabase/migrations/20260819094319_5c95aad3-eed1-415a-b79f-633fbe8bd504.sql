delete from public.book_chunks c using auth.users u where u.email like 'ragui%@example.com' and c.user_id = u.id;
delete from public.user_books ub using auth.users u where u.email like 'ragui%@example.com' and ub.user_id = u.id;
delete from public.profiles p using auth.users u where u.email like 'ragui%@example.com' and p.id = u.id;
delete from public.admin_roles a using auth.users u where u.email like 'ragui%@example.com' and a.user_id = u.id;
delete from auth.users where email like 'ragui%@example.com';