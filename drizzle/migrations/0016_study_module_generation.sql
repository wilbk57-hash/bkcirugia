CREATE TABLE public.study_module_drafts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_id uuid NOT NULL,
 title text NOT NULL,
 catalog_n text NOT NULL DEFAULT 'GERADOS',
 catalog_title text NOT NULL DEFAULT 'Temas da Biblioteca Oficial',
 phase text NOT NULL DEFAULT 'queries',
 step integer NOT NULL DEFAULT 0,
 version integer NOT NULL DEFAULT 1,
 data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
 error_message text,
 paused boolean NOT NULL DEFAULT false,
 lease_token uuid,
 lease_expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_module_drafts TO authenticated;
GRANT ALL ON public.study_module_drafts TO service_role;
ALTER TABLE public.study_module_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY study_drafts_admin ON public.study_module_drafts FOR ALL TO authenticated USING ((SELECT public.is_platform_admin())) WITH CHECK ((SELECT public.is_platform_admin()) AND owner_id = auth.uid());
CREATE TABLE public.study_module_revisions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 module_id uuid NOT NULL REFERENCES public.study_module_drafts(id),
 version integer NOT NULL,
 title text NOT NULL,
 catalog_n text NOT NULL,
 catalog_title text NOT NULL,
 payload jsonb NOT NULL,
 published boolean NOT NULL DEFAULT true,
 reviewed_by uuid NOT NULL,
 reviewed_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(module_id, version)
);
GRANT SELECT ON public.study_module_revisions TO authenticated;
GRANT ALL ON public.study_module_revisions TO service_role;
ALTER TABLE public.study_module_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY study_revisions_admin_read ON public.study_module_revisions FOR SELECT TO authenticated USING ((SELECT public.is_platform_admin()));
CREATE POLICY study_revisions_student_read ON public.study_module_revisions FOR SELECT TO authenticated USING (published AND (SELECT public.has_access()));
CREATE INDEX study_revisions_published ON public.study_module_revisions(published, module_id);
CREATE OR REPLACE FUNCTION public.study_module_acquire(p_id uuid, p_version integer, p_token uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF public.is_platform_admin() IS DISTINCT FROM true THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
 UPDATE public.study_module_drafts SET lease_token = p_token, lease_expires_at = now() + interval '15 minutes', updated_at = now()
 WHERE id = p_id AND version = p_version AND NOT paused AND (lease_expires_at IS NULL OR lease_expires_at < now());
 RETURN FOUND;
END; $$;
REVOKE ALL ON FUNCTION public.study_module_acquire(uuid, integer, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.study_module_acquire(uuid, integer, uuid) TO authenticated;
CREATE OR REPLACE FUNCTION public.study_module_finish(p_id uuid, p_token uuid, p_data jsonb, p_phase text, p_step integer, p_error text DEFAULT NULL, p_paused boolean DEFAULT false)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF public.is_platform_admin() IS DISTINCT FROM true THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
 UPDATE public.study_module_drafts SET data_json = p_data, phase = p_phase, step = p_step, error_message = p_error, paused = p_paused, version = version + 1, lease_token = NULL, lease_expires_at = NULL, updated_at = now()
 WHERE id = p_id AND lease_token = p_token AND lease_expires_at > now();
 RETURN FOUND;
END; $$;
REVOKE ALL ON FUNCTION public.study_module_finish(uuid, uuid, jsonb, text, integer, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.study_module_finish(uuid, uuid, jsonb, text, integer, text, boolean) TO authenticated;
CREATE OR REPLACE FUNCTION public.study_module_publish(p_id uuid, p_version integer, p_payload jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE d public.study_module_drafts; result_id uuid;
BEGIN
 IF public.is_platform_admin() IS DISTINCT FROM true THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
 SELECT * INTO d FROM public.study_module_drafts WHERE id = p_id FOR UPDATE;
 IF d.id IS NULL OR d.owner_id <> auth.uid() OR d.version <> p_version OR d.phase <> 'review' OR d.lease_token IS NOT NULL THEN RAISE EXCEPTION 'review_required' USING ERRCODE = '22023'; END IF;
 UPDATE public.study_module_revisions SET published = false WHERE module_id = p_id;
 INSERT INTO public.study_module_revisions(module_id,version,title,catalog_n,catalog_title,payload,reviewed_by)
 VALUES (d.id,d.version,d.title,d.catalog_n,d.catalog_title,p_payload,auth.uid()) RETURNING id INTO result_id;
 UPDATE public.study_module_drafts SET version = version + 1, updated_at = now() WHERE id = p_id;
 RETURN result_id;
END; $$;
REVOKE ALL ON FUNCTION public.study_module_publish(uuid, integer, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.study_module_publish(uuid, integer, jsonb) TO authenticated;
CREATE OR REPLACE FUNCTION public.study_module_restore(p_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m uuid;
BEGIN
 IF public.is_platform_admin() IS DISTINCT FROM true THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
 SELECT module_id INTO m FROM public.study_module_revisions WHERE id = p_id;
 IF m IS NULL THEN RETURN false; END IF;
 PERFORM 1 FROM public.study_module_drafts WHERE id = m FOR UPDATE;
 UPDATE public.study_module_revisions SET published = false WHERE module_id = m;
 UPDATE public.study_module_revisions SET published = true WHERE id = p_id;
 RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.study_module_restore(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.study_module_restore(uuid) TO authenticated;