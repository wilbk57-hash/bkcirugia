ALTER TABLE public.audit_events
  ADD CONSTRAINT audit_events_detail_size
  CHECK (detail IS NULL OR octet_length(detail::text) <= 16384);