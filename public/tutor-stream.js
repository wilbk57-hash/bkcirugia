/**
 * readTutorStream
 *
 * Lê uma resposta em streaming, descodifica UTF-8 e valida o registo final
 * enviado pelo servidor.
 *
 * Protocolo:
 *   <texto da resposta>\u001e{"done":true}
 *
 * Erro:
 *   <texto parcial>\u001e{"error":true,"message":"..."}
 */

const RECORD_SEPARATOR = '\u001e';

/**
 * Valores por omissão. Centralizados para facilitar o endurecimento
 * (segurança) e o ajuste fino (performance) sem mexer na lógica.
 */
const DEFAULTS = Object.freeze({
  maxTextLength: 1_000_000,   // unidades UTF-16, não bytes
  maxTerminalLength: 16_384,  // idem
  maxMessageLength: 500,      // tamanho máximo da mensagem de erro do servidor
  strictUtf8: false,          // true: bytes inválidos geram INVALID_UTF8
  trimResult: true            // true: devolve text.trim()
});

/**
 * Erro tipado. Use `error.code` para distinguir as causas:
 *
 *   HTTP_ERROR              resposta HTTP não-ok (traz `status`)
 *   NO_STREAM               a resposta não tem corpo legível
 *   INVALID_CHUNK           bloco recebido não é Uint8Array
 *   INVALID_UTF8            bytes inválidos (só com strictUtf8)
 *   TEXT_LIMIT              texto acima de maxTextLength
 *   TERMINAL_LIMIT          registo final acima de maxTerminalLength
 *   TERMINAL_MALFORMED      separador repetido dentro do registo final
 *   NO_TERMINAL             o fluxo acabou sem registo final
 *   TERMINAL_INVALID_JSON   registo final não é JSON válido
 *   TERMINAL_INVALID_SHAPE  registo final não é um objeto
 *   SERVER_ERROR            o servidor reportou erro (message já sanitizada)
 *   NOT_CONFIRMED           registo final sem done: true
 *   CALLBACK_ERROR          onText lançou uma exceção (ver `cause`)
 *
 * O cancelamento é um DOMException com name 'AbortError'.
 */
class TutorStreamError extends Error {
  constructor(code, message, { cause, ...details } = {}) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'TutorStreamError';
    this.code = code;
    Object.assign(this, details);
  }
}

function createAbortError() {
  return new DOMException('A leitura foi cancelada.', 'AbortError');
}

/**
 * Mensagens vindas do servidor são dados não confiáveis: remove caracteres
 * de controlo e limita o tamanho antes de a expor em Error.message.
 * (Ao renderizar na interface, use textContent, nunca innerHTML.)
 */
function sanitizeServerMessage(message, maxLength) {
  const clean =
    typeof message === 'string'
      // eslint-disable-next-line no-control-regex
      ? message.replace(/[\u0000-\u001f\u007f]/g, ' ').trim()
      : '';

  if (!clean) return 'O servidor comunicou um erro.';

  return clean.length > maxLength
    ? `${clean.slice(0, maxLength)}…`
    : clean;
}

function validateOptions(options) {
  if (options === null || typeof options !== 'object') {
    throw new TypeError('options deve ser um objeto.');
  }

  const { maxTextLength, maxTerminalLength, maxMessageLength } = options;

  if (
    !Number.isSafeInteger(maxTextLength) ||
    maxTextLength < 0 ||
    !Number.isSafeInteger(maxTerminalLength) ||
    maxTerminalLength < 1 ||
    !Number.isSafeInteger(maxMessageLength) ||
    maxMessageLength < 1
  ) {
    throw new RangeError('Os limites de tamanho são inválidos.');
  }
}

/**
 * @param {Response} response
 * @param {(text: string, delta: string) => void} [onText]
 *   Chamado a cada trecho novo, com o texto acumulado e o delta.
 * @param {object} [options]
 * @param {number} [options.maxTextLength=1000000]
 * @param {number} [options.maxTerminalLength=16384]
 * @param {number} [options.maxMessageLength=500]
 * @param {boolean} [options.strictUtf8=false]
 * @param {boolean} [options.trimResult=true]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<string>} texto validado
 * @throws {TutorStreamError | TypeError | RangeError | DOMException}
 */
async function readTutorStream(response, onText, options = {}) {
  // 1. Validação inicial da resposta HTTP
  if (!response || typeof response.ok !== 'boolean') {
    throw new TypeError('A resposta HTTP é inválida.');
  }

  if (!response.ok) {
    throw new TutorStreamError(
      'HTTP_ERROR',
      `Erro HTTP: ${response.status}`,
      { status: response.status }
    );
  }

  if (!response.body) {
    throw new TutorStreamError(
      'NO_STREAM',
      'O servidor não disponibilizou um fluxo de dados.'
    );
  }

  if (onText !== undefined && typeof onText !== 'function') {
    throw new TypeError('onText deve ser uma função.');
  }

  const config = { ...DEFAULTS, ...options };
  validateOptions(config);

  const {
    maxTextLength,
    maxTerminalLength,
    maxMessageLength,
    strictUtf8,
    trimResult,
    signal
  } = config;

  if (signal?.aborted) {
    throw createAbortError();
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: Boolean(strictUtf8) });

  let text = '';
  let terminal = '';
  let ended = false;

  // Cancelar o leitor resolve o read() pendente, mesmo com o fluxo parado.
  const onAbort = () => {
    reader.cancel().catch(() => {});
  };

  if (signal) {
    signal.addEventListener('abort', onAbort, { once: true });
  }

  function decode(bytes, stream) {
    try {
      return decoder.decode(bytes, { stream });
    } catch (cause) {
      throw new TutorStreamError(
        'INVALID_UTF8',
        'A resposta contém bytes UTF-8 inválidos.',
        { cause }
      );
    }
  }

  function notify(delta) {
    try {
      onText(text, delta);
    } catch (cause) {
      throw new TutorStreamError(
        'CALLBACK_ERROR',
        'O callback onText lançou uma exceção.',
        { cause }
      );
    }
  }

  function appendTerminal(chunk) {
    if (chunk.includes(RECORD_SEPARATOR)) {
      throw new TutorStreamError(
        'TERMINAL_MALFORMED',
        'O registo final contém um separador inesperado.'
      );
    }

    terminal += chunk;

    if (terminal.length > maxTerminalLength) {
      throw new TutorStreamError(
        'TERMINAL_LIMIT',
        'O registo final excede o limite permitido.'
      );
    }
  }

  function consume(chunk) {
    if (ended) {
      appendTerminal(chunk);
      return;
    }

    const boundary = chunk.indexOf(RECORD_SEPARATOR);
    const delta = boundary === -1 ? chunk : chunk.slice(0, boundary);

    if (text.length + delta.length > maxTextLength) {
      throw new TutorStreamError(
        'TEXT_LIMIT',
        'A resposta excede o limite permitido.'
      );
    }

    text += delta;

    if (boundary !== -1) {
      ended = true;
      appendTerminal(chunk.slice(boundary + 1));
    }

    // Só notifica quando há texto novo.
    if (onText && delta) {
      notify(delta);
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (signal?.aborted) {
        throw createAbortError();
      }

      if (done) break;

      // Realm-safe check: chunks may come from another global (iframe, tests).
      if (!ArrayBuffer.isView(value) || Object.prototype.toString.call(value) !== '[object Uint8Array]') {
        throw new TutorStreamError(
          'INVALID_CHUNK',
          'O fluxo devolveu um bloco que não é binário.'
        );
      }

      consume(decode(value, true));
    }

    // Descodificar eventuais bytes restantes.
    consume(decode(undefined, false));

    if (!ended) {
      throw new TutorStreamError(
        'NO_TERMINAL',
        'A resposta terminou sem confirmação do servidor.'
      );
    }

    let record;
    try {
      record = JSON.parse(terminal);
    } catch (cause) {
      throw new TutorStreamError(
        'TERMINAL_INVALID_JSON',
        'O registo final não contém JSON válido.',
        { cause }
      );
    }

    if (
      record === null ||
      typeof record !== 'object' ||
      Array.isArray(record)
    ) {
      throw new TutorStreamError(
        'TERMINAL_INVALID_SHAPE',
        'A estrutura do registo final é inválida.'
      );
    }

    if (record.error === true) {
      throw new TutorStreamError(
        'SERVER_ERROR',
        sanitizeServerMessage(record.message, maxMessageLength)
      );
    }

    if (record.done !== true) {
      throw new TutorStreamError(
        'NOT_CONFIRMED',
        'O servidor não confirmou a conclusão da resposta.'
      );
    }

    return trimResult ? text.trim() : text;

  } catch (error) {
    // Interromper a leitura e preservar o erro original.
    await reader.cancel().catch(() => {});
    throw error;

  } finally {
    if (signal) {
      signal.removeEventListener('abort', onAbort);
    }

    // Garante a libertação do lock mesmo em caminhos alternativos de exceção.
    try {
      reader.releaseLock();
    } catch {
      // Ignora se já estiver libertado.
    }
  }
}

/* Exemplo de uso:

const controller = new AbortController();

try {
  const response = await fetch('/api/tutor', {
    method: 'POST',
    body: JSON.stringify({ question }),
    signal: controller.signal
  });

  const answer = await readTutorStream(
    response,
    (text, delta) => { output.textContent = text; },
    { signal: controller.signal, strictUtf8: true }
  );
} catch (error) {
  if (error.name === 'AbortError') return;

  if (error instanceof TutorStreamError) {
    switch (error.code) {
      case 'HTTP_ERROR':   // error.status
      case 'SERVER_ERROR': // mensagem já sanitizada
      default:
    }
  }
}
*/