CREATE TABLE public.tutor_state (
 user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
 preferred_name text NOT NULL DEFAULT '' CHECK (char_length(preferred_name) <= 80),
 profile jsonb NOT NULL DEFAULT '{}'::jsonb,
 cleared_at timestamptz,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutor_state TO authenticated;
GRANT ALL ON public.tutor_state TO service_role;
ALTER TABLE public.tutor_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY tutor_state_owner ON public.tutor_state FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TABLE public.tutor_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 client_id text NOT NULL,
 role text NOT NULL CHECK (role IN ('user','assistant')),
 content text NOT NULL,
 message jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id, client_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutor_messages TO authenticated;
GRANT ALL ON public.tutor_messages TO service_role;
ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY tutor_messages_owner ON public.tutor_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX tutor_messages_user_date ON public.tutor_messages(user_id, created_at DESC);
CREATE INDEX tutor_messages_search ON public.tutor_messages USING gin(to_tsvector('simple', content));