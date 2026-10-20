/* Read UTF-8 deltas; only the terminal record authorizes saving. */
async function readTutorStream(response, onText) {
  if (!response.body) throw new Error('A resposta foi interrompida. Tenta novamente.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '', terminal = '', ended = false;
  function consume(chunk) {
    if (ended) { terminal += chunk; return; }
    const boundary = chunk.indexOf('\u001e');
    text += boundary < 0 ? chunk : chunk.slice(0, boundary);
    if (boundary >= 0) { ended = true; terminal = chunk.slice(boundary + 1); }
    if (onText) onText(text);
  }
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      consume(decoder.decode(chunk.value, { stream: true }));
    }
    consume(decoder.decode());
    let record;
    try { record = ended ? JSON.parse(terminal) : null; } catch (_) {}
    if (record?.error) throw new Error(record.message || 'A resposta foi interrompida. Tenta novamente.');
    if (!record?.done) throw new Error('A resposta foi interrompida. Tenta novamente.');
    return text.trim();
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally { reader.releaseLock(); }
}