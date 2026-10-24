import { createFileRoute } from '@tanstack/react-router';
import { buildPushPayload } from '@block65/webcrypto-web-push';

/*
 * MIGRAÇÃO NECESSÁRIA (idempotência / anti-duplicados):
 *
 * create table public.study_reminder_log (
 *   event_id        uuid not null,
 *   subscription_id uuid not null,
 *   sent_on         date not null,
 *   primary key (event_id, subscription_id, sent_on)
 * );
 * alter table public.study_reminder_log enable row level security; -- sem policies: só service role
 */

// ───────────── Config ─────────────
const MAX_OFFSET_DAYS = 30; // limite máximo aceito para reminder_offset
const PAGE_SIZE = 1000; // limite padrão do PostgREST
const IN_CHUNK = 100; // evita URLs gigantes em .in()
const PUSH_CONCURRENCY = 20;
const PUSH_TIMEOUT_MS = 10_000;
const MAX_TITLE_LEN = 80;

// ───────────── Tipos ─────────────
type SupportedLang = 'pt' | 'en' | 'es';

type Subscription = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  lang: string | null;
};

type StudyEvent = {
  id: string;
  user_id: string;
  title: string;
  type: string;