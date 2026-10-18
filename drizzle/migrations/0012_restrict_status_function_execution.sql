REVOKE EXECUTE ON FUNCTION public.admin_set_user_status(uuid, text) FROM service_role;
REVOKE EXECUTE ON FUNCTION public.admin_set_user_status(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_user_status(uuid, text) TO authenticated;