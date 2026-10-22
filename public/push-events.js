// Handlers de push importados pelo service worker gerado pelo Workbox
// (vite.config.ts → workbox.importScripts). Sem cache de app-shell aqui.
(() => {
  'use strict';

  const DEFAULT_TITLE = 'BK-CIRURGIA';
  const DEFAULT_BODY = '';
  const DEFAULT_TAG = 'bk-reminder';
  const DEFAULT_APP_PATH = './app.html';
  const DEFAULT_ICON_PATH = './icons/icon-192.png';

  const MAX_TITLE_LENGTH = 120;
  const MAX_BODY_LENGTH = 1000;
  const MAX_TAG_LENGTH = 128;

  const readString = (value, fallback, maxLength) => {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim();
    return normalized ? normalized.slice(0, maxLength) : fallback;
  };

  const readBoolean = (value, fallback) =>
    typeof value === 'boolean' ? value : fallback;

  // FIX #3 e #9: só aceita URLs http(s) da própria origem, sem credenciais.
  const resolveSameOriginUrl = (value, fallbackPath) => {
    const fallback = new URL(fallbackPath, self.location.origin).href;
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
      const url = new URL(value.trim(), self.location.origin);
      const valid =
        (url.protocol === 'https:' || url.protocol === 'http:') &&
        url.origin === self.location.origin &&
        !url.username &&
        !url.password;
      return valid ? url.href : fallback;
    } catch {
      return fallback;
    }
  };

  self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.allSettled(
      keys.filter((key) => /^bk-cirurgia-v\d+$/.test(key)).map((key) => caches.delete(key))
    )));
  });

  self.addEventListener('push', (event) => {
    let payload = {};
    try {
      payload = event.data ? event.data.json() : {};
    } catch {
      payload = { body: event.data ? event.data.text() : '' };
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) payload = {};
    const options = {
      body: readString(payload.body, DEFAULT_BODY, MAX_BODY_LENGTH),
      icon: resolveSameOriginUrl(payload.icon, DEFAULT_ICON_PATH),
      badge: resolveSameOriginUrl(payload.badge, DEFAULT_ICON_PATH),
      tag: readString(payload.tag, DEFAULT_TAG, MAX_TAG_LENGTH),
      renotify: readBoolean(payload.renotify, true),
      requireInteraction: readBoolean(payload.requireInteraction, false),
      data: { url: resolveSameOriginUrl(payload.url, DEFAULT_APP_PATH) },
    };
    event.waitUntil(self.registration.showNotification(
      readString(payload.title, DEFAULT_TITLE, MAX_TITLE_LENGTH), options
    ));
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const target = resolveSameOriginUrl(event.notification.data?.url, DEFAULT_APP_PATH);
    event.waitUntil((async () => {
      const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clientList) {
        try {
          if (new URL(client.url).origin !== self.location.origin || typeof client.focus !== 'function') continue;
          if (typeof client.navigate === 'function') await client.navigate(target);
          return await client.focus();
        } catch {
          // Tenta outro cliente ou abre uma janela se este já tiver fechado.
        }
      }
      return self.clients.openWindow(target);
    })());
  });
})();