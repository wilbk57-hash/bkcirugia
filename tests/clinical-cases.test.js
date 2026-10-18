import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const html = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');
const source = html.slice(html.indexOf('async function ccCurrentUser('), html.indexOf('const CC_STEP_PLAN'));
function setup(session) {
  const headers = [];
  let calls = 0;
  const table = Object.fromEntries(['select', 'insert', 'update'].map(method => [method, () => ({
    setHeader(key, value) { headers.push([method, key, value]); return this; },
  })]));
  const context = { t: key => key, supabaseClient: {
    auth: { getSession: async () => ({ data: { session } }) },
    from: () => { calls++; return table; },
  } };
  runInNewContext(source, context);
  return { context, headers, calls: () => calls };
}
test('clinical-case history, generation saves and completion use the current owner token', async () => {
  const { context, headers } = setup({ user: { id: 'student-1' }, access_token: 'fresh-owner-token' });
  const query = await context.ccQuery('student-1');
  query.select('*'); query.insert({ user_id: 'student-1' }); query.update({ completed_at: '2026-10-18' });
  assert.deepEqual(headers, ['select', 'insert', 'update'].map(method => [method, 'Authorization', 'Bearer fresh-owner-token']));
});
test('account changes during generation cannot save under the old owner', async () => {
  const { context, calls } = setup({ user: { id: 'student-2' }, access_token: 'other-owner-token' });
  await assert.rejects(context.ccQuery('student-1'), error => error.needsAuth === true);
  assert.equal(calls(), 0);
});
test('expired sessions cannot access clinical-case history or saves', async () => {
  const { context, calls } = setup(null);
  await assert.rejects(context.ccQuery('student-1'), error => error.needsAuth === true);
  assert.equal(calls(), 0);
});
test('an administrator session can generate cases even without a student profile cache', async () => {
  const { context } = setup({ user: { id: 'administrator-1' }, access_token: 'admin-token' });
  context.getCurrentUser = () => null;
  const user = await context.ccCurrentUser();
  assert.equal(user.id, 'administrator-1');
});