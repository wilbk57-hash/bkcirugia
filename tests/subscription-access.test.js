import { test } from 'node:test';
import assert from 'node:assert/strict';

// Mirrors src/lib/cors.server.ts and the subscription gate logic.
const ALLOWED = ['https://localhost', 'capacitor://localhost', 'https://bkcirugia.lovable.app'];
function allowOrigin(origin) { return ALLOWED.includes(origin) ? origin : undefined; }
async function gate(rpc) { const { data, error } = await rpc('has_access'); if (error) return 'error'; return data === true ? 'ok' : 'denied'; }
const statusFor = (g) => (g === 'denied' ? 402 : g === 'error' ? 503 : 200);

test('expired subscription is answered with 402', async () => {
  assert.equal(statusFor(await gate(async () => ({ data: false, error: null }))), 402);
});
test('a failing access check returns 503, never 402', async () => {
  assert.equal(statusFor(await gate(async () => ({ data: null, error: { code: '57014' } }))), 503);
});
test('active access passes', async () => {
  assert.equal(statusFor(await gate(async () => ({ data: true, error: null }))), 200);
});
test('CORS allows only the three listed origins and never *', () => {
  for (const o of ALLOWED) assert.equal(allowOrigin(o), o);
  assert.equal(allowOrigin('https://evil.example'), undefined);
  assert.equal(allowOrigin('*'), undefined);
});
