import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readLibraryWithRetry } from '../src/lib/library-search-retry.ts';

test('a transient library timeout retries and returns the recovered sources', async () => {
  let calls = 0;
  const result = await readLibraryWithRetry(async () => ++calls === 1
    ? { data: null, error: { code: '57014', message: 'statement timeout' } }
    : { data: [{ page: 12 }], error: null });
  assert.equal(calls, 2);
  assert.equal(result.data[0].page, 12);
});
test('library permission failures are never retried or bypassed', async () => {
  let calls = 0;
  const result = await readLibraryWithRetry(async () => {
    calls++;
    return { data: null, error: { code: '42501', message: 'permission denied' } };
  });
  assert.equal(calls, 1);
  assert.equal(result.error.code, '42501');
});
test('persistent failures stop after two reads without fabricated sources', async () => {
  let calls = 0;
  const result = await readLibraryWithRetry(async () => {
    calls++;
    return { data: null, error: { code: '57014' } };
  });
  assert.equal(calls, 2);
  assert.equal(result.data, null);
});