CREATE TABLE public.peer_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (sender_id <> recipient_id)
);
CREATE INDEX peer_messages_pair_idx ON public.peer_messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);
CREATE INDEX peer_messages_recipient_idx ON public.peer_messages (recipient_id, read_at);
GRANT SELECT, INSERT, UPDATE ON public.peer_messages TO authenticated;
GRANT ALL ON public.peer_messages TO service_role;
ALTER TABLE public.peer_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY pm_select ON public.peer_messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY pm_insert ON public.peer_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY pm_update ON public.peer_messages FOR UPDATE TO authenticated USING (recipient_id = auth.uid()) WITH CHECK (recipient_id = auth.uid());

CREATE OR REPLACE FUNCTION public.chat_directory()
RETURNS TABLE(id uuid, name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, COALESCE(NULLIF(p.name,''), split_part(p.email,'@',1)) AS name
  FROM public.profiles p
  WHERE auth.uid() IS NOT NULL AND p.id <> auth.uid() AND p.status = 'active'
    AND NOT EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = p.id)
  ORDER BY 2 LIMIT 2000;
$$;
REVOKE ALL ON FUNCTION public.chat_directory() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.chat_directory() TO authenticated;