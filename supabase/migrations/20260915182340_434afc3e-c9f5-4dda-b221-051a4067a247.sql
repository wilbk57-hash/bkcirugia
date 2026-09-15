CREATE TABLE public.ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, window_start)
);

GRANT SELECT ON public.ai_usage TO authenticated;
GRANT ALL ON public.ai_usage TO service_role;

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY ai_usage_select_own ON public.ai_usage
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin());

CREATE POLICY ai_usage_no_insert ON public.ai_usage AS RESTRICTIVE FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY ai_usage_no_update ON public.ai_usage AS RESTRICTIVE FOR UPDATE TO authenticated, anon USING (false);
CREATE POLICY ai_usage_no_delete ON public.ai_usage AS RESTRICTIVE FOR DELETE TO authenticated, anon USING (false);

CREATE TRIGGER ai_usage_set_updated_at BEFORE UPDATE ON public.ai_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX ai_usage_window_idx ON public.ai_usage (window_start DESC);

-- Consome uma unidade de quota da hora corrente para o utilizador autenticado.
-- Devolve false quando o limite foi atingido.
CREATE OR REPLACE FUNCTION public.consume_ai_quota(_kind text, _limit integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  w timestamptz := date_trunc('hour', now());
  c integer;
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.ai_usage (user_id, kind, window_start, count)
  VALUES (uid, left(_kind, 40), w, 1)
  ON CONFLICT (user_id, kind, window_start)
  DO UPDATE SET count = public.ai_usage.count + 1, updated_at = now()
  RETURNING count INTO c;

  RETURN c <= GREATEST(_limit, 1);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_ai_quota(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_ai_quota(text, integer) TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS audit_events_created_at_idx ON public.audit_events (created_at DESC);