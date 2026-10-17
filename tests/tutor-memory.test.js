import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/tutor-memory.js', import.meta.url), 'utf8');
function setup() {
  const writes = [];
  let session = { user: { id: 'student-a' }, access_token: 'session-a' };
  const context = {
    IA_MESSAGES: [{ role: 'user', content: 'Trauma', memoryId: 'message-1' }],
    crypto: { randomUUID: () => 'message-1' },
    document: { getElementById: () => null },
    localStorage: { setItem() {} }, console, showToast() {}, bkL: text => text,
    supabaseClient: {
      auth: { getSession: async () => ({ data: { session } }) },
      from(table) {
        return { setHeader(key, value) {
          return { upsert: async rows => { writes.push({ table, key, value, rows }); return { error: null }; } };
        } };
      },
    },
  };
  runInNewContext(source + "\ntutorMemoryUser = 'student-a';", context);
  return { context, writes, setSession(value) { session = value; } };
}
test('saved messages and profile use the authenticated owner token', async () => {
  const { context, writes } = setup();
  await context.tutorMemorySave();
  await context.tutorMemorySaveProfile({ topic: 'Trauma' });
  assert.equal(writes.length, 2);
  assert.equal(writes[0].rows[0].user_id, 'student-a');
  assert.equal(writes[1].rows.user_id, 'student-a');
  for (const write of writes) assert.equal(write.value, 'Bearer session-a');
});
test('another account cannot save the previous student memory', async () => {
  const { context, writes, setSession } = setup();
  setSession({ user: { id: 'student-b' }, access_token: 'session-b' });
  await assert.rejects(context.tutorMemorySave(), error => error.needsAuth === true);
  assert.equal(writes.length, 0);
});
test('logout cancels pending saves rather than writing under a new session', async () => {
  const { context, writes } = setup();
  const pending = context.tutorMemorySave();
  context.tutorMemoryReset();
  await pending;
  assert.equal(writes.length, 0);
});
test('expired sessions cannot send memory requests with a publishable key', async () => {
  const { context, writes, setSession } = setup();
  setSession(null);
  await assert.rejects(context.tutorMemorySave(), error => error.needsAuth === true);
  assert.equal(writes.length, 0);
});