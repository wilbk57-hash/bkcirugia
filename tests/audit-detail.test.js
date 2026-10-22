import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');
function extract(name) {
  const match = html.match(new RegExp(`function ${name}\\(.*?\\n\\}`, 's'));
  assert.ok(match);
  return match[0];
}
for (const name of ['bkFeedback', 'bkRate']) {
  test(`${name} silently handles only the audit size constraint and keeps the form available`, async () => {
    for (const error of [
      { code: '23514', message: 'violates check constraint "audit_events_detail_size"' },
      { code: '42501', message: 'permission denied' },
    ]) {
      const handlers = {};
      const toasts = [];
      let closed = false;
      const context = {
        bkL: pt => pt,
        bkSheet: () => ({
          querySelector: selector => ({ value: 'Feedback', addEventListener: (_, fn) => { handlers[selector] = fn; } }),
          querySelectorAll: () => [],
        }),
        supabaseClient: { rpc: async () => ({ error }) },
        location: { hash: '#home' }, navigator: { userAgent: 'Test browser' },
        showToast: value => toasts.push(value), bkCloseSheet: () => { closed = true; },
      };
      runInNewContext(extract(name), context);
      context[name]('bug');
      if (name === 'bkRate') handlers['#bkStars']({ target: { closest: () => ({ dataset: { n: '4' } }) } });
      await handlers[name === 'bkRate' ? '#bkRateSend' : '#bkFbSend']();
      assert.equal(closed, false);
      assert.deepEqual(toasts, error.code === '23514' ? [] : ['permission denied']);
    }
  });
}
test('background audit errors never block the caller', async () => {
  const context = { supabaseClient: { rpc: () => Promise.reject(new Error('audit_events_detail_size')) } };
  runInNewContext(extract('auditLog'), context);
  assert.doesNotThrow(() => context.auditLog('event', 'detail'));
  await new Promise(resolve => setImmediate(resolve));
});