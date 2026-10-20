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

  // FIX #2: nunca devolve null; só objetos simples chegam ao build.
  const parsePayload = (data) => {
    if (!data) return {};
    let text;
    try {
      text = data.text();
    } catch {
      return {};
    }
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
      return typeof parsed === 'string' ? { body: parsed } : {};
    } catch {
      return { body: text };
    }
  };

  const buildNotification = (payload) => ({
    title: readString(payload.title, DEFAULT_TITLE, MAX_TITLE_LENGTH),
    options: {
      body: readString(payload.body, DEFAULT_BODY, MAX_BODY_LENGTH),
      icon: resolveSameOriginUrl(payload.icon, DEFAULT_ICON_PATH),
      badge: resolveSameOriginUrl(payload.badge, DEFAULT_ICON_PATH),
      // A tag nunca é vazia, então renotify:true não lança TypeError.
      tag: readString(payload.tag, DEFAULT_TAG, MAX_TAG_LENGTH),
      renotify: readBoolean(payload.renotify, true),
      requireInteraction: readBoolean(payload.requireInteraction, false),
      data: { url: resolveSameOriginUrl(payload.url, DEFAULT_APP_PATH) },
    },
  });

  // FIX #2: sempre exibe uma notificação (exigência do userVisibleOnly).
  const handlePush = async (data) => {
    try {
      const { title, options } = buildNotification(parsePayload(data));
      await self.registration.showNotification(title, options);
    } catch (error) {
      console.error('[push] falha ao montar a notificação', error);
      await self.registration.showNotification(DEFAULT_TITLE, {
        tag: DEFAULT_TAG,
        data: { url: resolveSameOriginUrl(undefined, DEFAULT_APP_PATH) },
      });
    }
  };

  const isSamePage = (clientUrl, targetUrl) => {
    try {
      const a = new URL(clientUrl);
      const b = new URL(targetUrl);
      a.hash = '';
      b.hash = '';
      return a.href === b.href;
    } catch {
      return false;
    }
  };

  // FIX #6: foca a aba que já está na página; senão tenta navegar; senão abre nova.
  const openOrFocus = async (target) => {
    const clientList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    const exact = clientList.find((c) => isSamePage(c.url, target));
    if (exact) {
      try {
        return await exact.focus();
      } catch {
        /* tenta a próxima estratégia */
      }
    }

    for (const client of clientList) {
      if (typeof client.navigate !== 'function') continue;
      let navigated;
      try {
        navigated = await client.navigate(target); // falha em abas não controladas
      } catch {
        continue;
      }
      if (navigated) {
        try {
          await navigated.focus();
        } catch {
          /* a aba já está na página correta */
        }
        return navigated;
      }
    }

    try {
      return await self.clients.openWindow(target);
    } catch (error) {
      console.error('[push] não foi possível abrir a janela', error);
      return undefined;
    }
  };

  // Remove só os caches legados do app antigo; nunca os do Workbox.
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.allSettled(
            keys
              .filter((key) => /^bk-cirurgia-v\d+$/.test(key))
              .map((key) => caches.delete(key)),
          ),
        )
        .catch(() => {}),
    );
  });

  self.addEventListener('push', (event) => {
    event.waitUntil(handlePush(event.data));
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const target = resolveSameOriginUrl(
      event.notification.data && event.notification.data.url,
      DEFAULT_APP_PATH,
    );
    event.waitUntil(openOrFocus(target));
  });
})();
