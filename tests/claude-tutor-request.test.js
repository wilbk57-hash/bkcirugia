import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');
const start = html.indexOf('async function callClaudeTutor(opts) {');
assert.ok(start >= 0);
const end = html.indexOf('\n}', start);
assert.ok(end > start);
const source = html.slice(start, end + 2);

for (const webSearch of [false, true]) {
  test(`personal Claude request uses Sonnet 5.5 without incompatible parameters (web search: ${webSearch})`, async () => {
    let captured;
    const context = {
      getApiKey: () => 'test-only-not-a-real-key',
      fetch: async (url, request) => {
        assert.equal(url, 'https://api.anthropic.com/v1/messages');
        captured = JSON.parse(request.body);
        return { ok: true, json: async () => ({ content: [{ type: 'text', text: 'Answer' }] }) };
      },
    };
    runInNewContext(source, context);
    await context.callClaudeTutor({
      system: 'Unchanged system',
      messages: [{ role: 'assistant', content: 'Previous answer' }, { role: 'user', content: 'New question' }],
      maxTokens: 1500,
      webSearch,
    });
    assert.ok(captured);
    assert.equal(captured.model, 'claude-sonnet-5-5');
    for (const parameter of ['thinking', 'temperature', 'top_p', 'top_k', 'tool_choice']) {
      assert.equal(Object.hasOwn(captured, parameter), false, parameter);
    }
    assert.equal(captured.messages.at(-1).role, 'user');
    assert.equal(captured.max_tokens, 1500);
    assert.equal(captured.system, 'Unchanged system');
    assert.deepEqual(Object.keys(captured).sort(), ['model', 'max_tokens', 'system', 'messages', ...(webSearch ? ['tools'] : [])].sort());
    assert.deepEqual(captured.tools, webSearch ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }] : undefined);
  });
}