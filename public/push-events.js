// Messaging handlers imported by the generated app worker; no app-shell caching here.
self.addEventListener('activate', (event) => {
  // Retire only the legacy BK app caches, never caches owned by other workers.
  event.waitUntil(caches.keys().then((keys) => Promise.allSettled(
    keys.filter((key) => /^bk-cirurgia-v\d+$/.test(key)).map((key) => caches.delete(key))
  )));
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = { body: event.data ? event.data.text() : '' };
  }
  const title = payload.title || 'BK-CIRURGIA';
  const options = {
    body: payload.body || '',
    icon: payload.icon || './icons/icon-192.png',
    badge: payload.badge || './icons/icon-192.png',
    tag: payload.tag || 'bk-reminder',
    renotify: true,
    requireInteraction: false,
    data: { url: payload.url || './app.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(
    (event.notification.data && event.notification.data.url) || './app.html',
    self.location.origin
  ).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate?.(target);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});