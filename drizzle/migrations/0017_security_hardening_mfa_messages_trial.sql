-- 1. is_platform_admin: exige aal2 quando o admin tem um fator TOTP verificado
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
    AND (
      COALESCE(auth.jwt() ->> 'aal', '') = 'aal2'
      OR NOT EXISTS (
        SELECT 1 FROM auth.mfa_factors f
        WHERE f.user_id = auth.uid() AND f.status = 'verified'
      )
    );
$$;

-- 2. Mensagens à prova de falsificação: UPDATE apenas em read_at + limite de tamanho
REVOKE UPDATE ON public.direct_messages FROM authenticated, anon;
REVOKE UPDATE ON public.feedback_replies FROM authenticated, anon;
REVOKE UPDATE ON public.peer_messages FROM authenticated, anon;
GRANT UPDATE (read_at) ON public.direct_messages TO authenticated;
GRANT UPDATE (read_at) ON public.feedback_replies TO authenticated;
GRANT UPDATE (read_at) ON public.peer_messages TO authenticated;

ALTER TABLE public.direct_messages
  ADD CONSTRAINT direct_messages_body_len CHECK (char_length(body) BETWEEN 1 AND 4000);
ALTER TABLE public.peer_messages
  ADD CONSTRAINT peer_messages_body_len CHECK (char_length(body) BETWEEN 1 AND 4000);
ALTER TABLE public.feedback_replies
  ADD CONSTRAINT feedback_replies_reply_len CHECK (char_length(reply) BETWEEN 1 AND 4000);

-- 3. chat_directory: exige has_access() e deixa de derivar o nome do email
CREATE OR REPLACE FUNCTION public.chat_directory()
RETURNS TABLE(id uuid, name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, COALESCE(NULLIF(p.name, ''), 'Aluno') AS name
  FROM public.profiles p
  WHERE public.has_access()
    AND p.id <> auth.uid()
    AND p.status = 'active'
    AND NOT EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = p.id)
  ORDER BY 2
  LIMIT 2000;
$$;

DROP POLICY pm_insert ON public.peer_messages;
CREATE POLICY pm_insert ON public.peer_messages
FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND recipient_id <> auth.uid()
  AND public.has_access()
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = recipient_id AND p.status = 'active'
  )
);

-- 4. audit_events: utilizadores normais não podem gravar eventos administrativos
DROP POLICY audit_events_insert_own ON public.audit_events;
CREATE POLICY audit_events_insert_own ON public.audit_events
FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = auth.uid())
    OR (
      event NOT LIKE 'admin\_%' ESCAPE '\'
      AND event NOT IN ('payment_approved', 'payment_rejected')
    )
  )
);

-- 5. Trial de 7 dias; função de trigger deixa de ser executável pela API
CREATE OR REPLACE FUNCTION public.grant_trial_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, paid_until, updated_at)
  VALUES (NEW.id, 'trial', now() + interval '7 days', now())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.grant_trial_access() FROM PUBLIC, anon, authenticated;

-- 6. Segredo do cron numa tabela privada fora da API; verificação só por service_role
CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.hook_secrets (
  name text PRIMARY KEY,
  secret text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON private.hook_secrets FROM PUBLIC, anon, authenticated;

INSERT INTO private.hook_secrets (name, secret)
VALUES ('study_reminders', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;

CREATE OR REPLACE FUNCTION public.verify_reminders_secret(_provided text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected text;
BEGIN
  SELECT s.secret INTO expected
  FROM private.hook_secrets s
  WHERE s.name = 'study_reminders'
  LIMIT 1;
  RETURN expected IS NOT NULL AND _provided IS NOT NULL AND _provided = expected;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.verify_reminders_secret(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_reminders_secret(text) TO service_role;