SELECT cron.unschedule(1);

SELECT cron.schedule(
  'study-reminders-daily',
  '0 8 * * *',
  $$
  select net.http_post(
    url:='https://project--b951eaff-f66b-4dd3-896d-302004fcc7f8.lovable.app/api/public/hooks/study-reminders',
    headers:='{"Content-Type": "application/json", "x-reminders-secret": "e7827dd9ca471541bfaed0b8ca9cf783b827d3cf66f7e727d0f3f756a390fec8"}'::jsonb,
    body:='{}'::jsonb
  ) as request_id;
  $$
);