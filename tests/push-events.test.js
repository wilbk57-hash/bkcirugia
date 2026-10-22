import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function worker(clients = []) {
  const handlers = {}, notifications = [], opened = [], removed = [];
  const self = {
    location: { origin: 'https://bkcirugia.lovable.app' },
    addEventListener: (type, handler) => { handlers[type] = handler; },
    registration: { showNotification: async (title, options) => { notifications.push({ title, options }); } },
    clients: { matchAll: async () => clients, openWindow: async url => { opened.push(url); } },
  };
  runInNewContext(readFileSync(new URL('../public/push-events.js', import.meta.url), 'utf8'), {
    self, URL, caches: { keys: async () => ['bk-cirurgia-v1', 'other-cache'], delete: async name => removed.push(name) },
  });
  async function dispatch(type, fields) {
    let pending;
    handlers[type]({ ...fields, waitUntil: promise => { pending = promise; } });
    await pending;
  }
  return { handlers, notifications, opened, removed, dispatch };
}

test('worker parses, registers handlers and shows a real reminder payload', async () => {
  const w = worker();
  assert.deepEqual(Object.keys(w.handlers).sort(), ['activate', 'notificationclick', 'push']);
  await w.dispatch('push', { data: { json: () => ({ title: 'Hoje: Cirurgia', body: 'Estudar', tag: 'se-123', url: '/app' }) } });
  const n = w.notifications[0];
  assert.equal(n.title, 'Hoje: Cirurgia');
  assert.equal(n.options.body, 'Estudar');
  assert.equal(n.options.tag, 'se-123');
  assert.equal(n.options.data.url, 'https://bkcirugia.lovable.app/app');
});

test('plain-text and empty push payloads remain usable', async () => {
  const w = worker();
  await w.dispatch('push', { data: { json: () => { throw new Error('not JSON'); }, text: () => 'Lembrete' } });
  await w.dispatch('push', { data: null });
  assert.equal(w.notifications[0].options.body, 'Lembrete');
  assert.equal(w.notifications[1].title, 'BK-CIRURGIA');
});

test('notification URLs reject external origins, credentials and malformed URLs', async () => {
  for (const url of ['https://evil.example/app', 'https://user:pass@bkcirugia.lovable.app/app', 'http://[', 'javascript:alert(1)']) {
    const w = worker();
    await w.dispatch('push', { data: { json: () => ({ url, icon: url, badge: url }) } });
    assert.equal(w.notifications[0].options.data.url, 'https://bkcirugia.lovable.app/app.html');
    assert.equal(w.notifications[0].options.icon, 'https://bkcirugia.lovable.app/icons/icon-192.png');
    assert.equal(w.notifications[0].options.badge, 'https://bkcirugia.lovable.app/icons/icon-192.png');
  }
});

test('notification click closes it and navigates then focuses an existing app window', async () => {
  const actions = [];
  const w = worker([{ url: 'https://bkcirugia.lovable.app/app', navigate: async url => actions.push(url), focus: async () => actions.push('focus') }]);
  await w.dispatch('notificationclick', { notification: { close: () => actions.push('close'), data: { url: '/app' } } });
  assert.deepEqual(actions, ['close', 'https://bkcirugia.lovable.app/app', 'focus']);
  assert.equal(w.opened.length, 0);
});

test('notification click opens a safe app window when none exists', async () => {
  const w = worker();
  await w.dispatch('notificationclick', { notification: { close() {}, data: { url: 'https://evil.example' } } });
  assert.deepEqual(w.opened, ['https://bkcirugia.lovable.app/app.html']);
});

test('activation removes only legacy BK caches', async () => {
  const w = worker();
  await w.dispatch('activate', {});
  assert.deepEqual(w.removed, ['bk-cirurgia-v1']);
});