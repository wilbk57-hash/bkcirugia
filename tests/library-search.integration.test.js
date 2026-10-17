import { test } from 'node:test';
import assert from 'node:assert/strict';

const url = process.env.LIBRARY_TEST_URL;
const key = process.env.LIBRARY_TEST_KEY;
const token = process.env.LIBRARY_TEST_TOKEN;
const vector = process.env.LIBRARY_TEST_VECTOR;
const configured = Boolean(url && key && token && vector);

test('shared search returns at most three excerpts per book under caller permissions', { skip: !configured }, async () => {
  const response = await fetch(`${url}/rest/v1/rpc/match_library_chunks`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query_embedding: JSON.parse(vector), match_count: 12 }),
  });
  assert.equal(response.status, 200);
  const rows = await response.json();
  assert.equal(rows.length, 12);
  const counts = new Map();
  for (const row of rows) counts.set(row.book_id, (counts.get(row.book_id) || 0) + 1);
  assert.ok(counts.size >= 4);
  for (const count of counts.values()) assert.ok(count <= 3);
});

test('shared library search does not permit anonymous execution', { skip: !configured }, async () => {
  const response = await fetch(`${url}/rest/v1/rpc/match_library_chunks`, {
    method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query_embedding: JSON.parse(vector), match_count: 12 }),
  });
  assert.ok([401, 403].includes(response.status));
});