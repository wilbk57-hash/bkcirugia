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