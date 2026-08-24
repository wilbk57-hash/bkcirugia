import { createFileRoute } from '@tanstack/react-router';
import { buildPushPayload } from '@block65/webcrypto-web-push';

type Subscription = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  lang: string;
};

type StudyEvent = {
  id: string;
  user_id: string;
  title: string;
  type: string;
  date: string;
  time: string | null;
  reminder_offset: number;
};

const COPY = {
  pt: {
    today: (title: string) => `Hoje: ${title}`,
    inDays: (title: string, d: number) => `Faltam ${d} dia${d === 1 ? '' : 's'}: ${title}`,
    tomorrow: (title: string) => `Amanhã: ${title}`,
    body: (type: string, time: string | null) =>
      `${type}${time ? ` às ${time}` : ''} · toca para abrir o teu plano de estudo.`,
  },
  en: {
    today: (title: string) => `Today: ${title}`,
    inDays: (title: string, d: number) => `${d} day${d === 1 ? '' : 's'} left: ${title}`,
    tomorrow: (title: string) => `Tomorrow: ${title}`,
    body: (type: string, time: string | null) =>
      `${type}${time ? ` at ${time}` : ''} · tap to open your study plan.`,
  },
  es: {
    today: (title: string) => `Hoy: ${title}`,
    inDays: (title: string, d: number) => `Faltan ${d} día${d === 1 ? '' : 's'}: ${title}`,
    tomorrow: (title: string) => `Mañana: ${title}`,
    body: (type: string, time: string | null) =>
      `${type}${time ? ` a las ${time}` : ''} · toca para abrir tu plan de estudio.`,
  },
} as const;

function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

export const Route = createFileRoute('/api/public/hooks/study-reminders')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedKey =
          process.env['SUPABASE_ANON_KEY'] || process.env['SUPABASE_PUBLISHABLE_KEY'];
        const provided =
          request.headers.get('apikey') ||
          request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

        if (!expectedKey || !provided || provided !== expectedKey) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const vapid = {
          subject: process.env['VAPID_SUBJECT'] || 'mailto:admin@bkcirurgia.app',
          publicKey: process.env['VAPID_PUBLIC_KEY'],
          privateKey: process.env['VAPID_PRIVATE_KEY'],
        };
        if (!vapid.publicKey || !vapid.privateKey) {
          return new Response(JSON.stringify({ error: 'Missing VAPID configuration' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

        const today = new Date().toISOString().slice(0, 10);
        const horizon = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);

        const { data: events, error: eventsError } = await supabaseAdmin
          .from('study_events')
          .select('id, user_id, title, type, date, time, reminder_offset')
          .eq('done', false)
          .gte('date', today)
          .lte('date', horizon);

        if (eventsError) {
          console.error('[study-reminders] events error', eventsError);
          return new Response(JSON.stringify({ error: eventsError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const due = ((events ?? []) as StudyEvent[]).filter(
          (e) => daysBetween(today, e.date) === Math.max(Number(e.reminder_offset) || 0, 0),
        );

        if (due.length === 0) {
          return new Response(JSON.stringify({ ok: true, events: 0, sent: 0 }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const userIds = [...new Set(due.map((e) => e.user_id))];
        const { data: subs, error: subsError } = await supabaseAdmin
          .from('push_subscriptions')
          .select('id, user_id, endpoint, p256dh, auth, lang')
          .in('user_id', userIds);

        if (subsError) {
          console.error('[study-reminders] subs error', subsError);
          return new Response(JSON.stringify({ error: subsError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const byUser = new Map<string, Subscription[]>();
        for (const s of (subs ?? []) as (Subscription & { user_id: string })[]) {
          const list = byUser.get(s.user_id) ?? [];
          list.push(s);
          byUser.set(s.user_id, list);
        }

        let sent = 0;
        const removed: string[] = [];

        for (const event of due) {
          const targets = byUser.get(event.user_id) ?? [];
          const days = Math.max(Number(event.reminder_offset) || 0, 0);

          for (const sub of targets) {
            const copy = COPY[(sub.lang as keyof typeof COPY) in COPY ? (sub.lang as keyof typeof COPY) : 'pt'];
            const title =
              days === 0
                ? copy.today(event.title)
                : days === 1
                  ? copy.tomorrow(event.title)
                  : copy.inDays(event.title, days);

            try {
              const payload = await buildPushPayload(
                {
                  data: {
                    title,
                    body: copy.body(event.type, event.time),
                    tag: `se-${event.id}`,
                    url: '/app',
                  },
                  options: { ttl: 24 * 3600, urgency: 'normal' },
                },
                {
                  endpoint: sub.endpoint,
                  expirationTime: null,
                  keys: { p256dh: sub.p256dh, auth: sub.auth },
                },
                vapid,
              );

              const res = await fetch(sub.endpoint, {
                method: payload.method,
                headers: payload.headers,
                body: payload.body as unknown as BodyInit,
              });

              if (res.status === 404 || res.status === 410) {
                removed.push(sub.id);
              } else if (res.ok) {
                sent += 1;
              } else {
                console.error('[study-reminders] push failed', res.status, await res.text());
              }
            } catch (err) {
              console.error('[study-reminders] push error', err);
            }
          }
        }

        if (removed.length > 0) {
          await supabaseAdmin.from('push_subscriptions').delete().in('id', removed);
        }

        const usedSubs = [...new Set(due.flatMap((e) => (byUser.get(e.user_id) ?? []).map((s) => s.id)))]
          .filter((id) => !removed.includes(id));
        if (usedSubs.length > 0) {
          await supabaseAdmin
            .from('push_subscriptions')
            .update({ last_sent_at: new Date().toISOString() })
            .in('id', usedSubs);
        }

        return new Response(
          JSON.stringify({ ok: true, events: due.length, sent, removed: removed.length }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      },
    },
  },
});
