import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createOpenAI } from '@ai-sdk/openai'

import { createLovableAiGatewayRunIdFetch } from './ai-run-id.server'
export { createLovableAiGatewayRunIdFetch } from './ai-run-id.server'

/** Chat-completions path — for non-OpenAI vendors (Gemini). */
export function createLovableChatProvider(lovableApiKey: string, initialRunId?: string) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId)
  const provider = createOpenAICompatible({
    name: 'lovable',
    baseURL: 'https://ai.gateway.lovable.dev/v1',
    headers: {
      'Lovable-API-Key': lovableApiKey,
      'X-Lovable-AIG-SDK': 'vercel-ai-sdk',
    },
    fetch: runIdFetch.fetch as typeof fetch,
  })
  return Object.assign(provider, { getRunId: runIdFetch.getRunId, waitForRunId: runIdFetch.waitForRunId })
}

/** Responses API path — for OpenAI models. */
export function createLovableResponsesProvider(lovableApiKey: string, initialRunId?: string) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId)
  const provider = createOpenAI({
    baseURL: 'https://ai.gateway.lovable.dev/v1',
    apiKey: lovableApiKey,
    headers: {
      'Lovable-API-Key': lovableApiKey,
      'X-Lovable-AIG-SDK': 'vercel-ai-sdk',
    },
    fetch: runIdFetch.fetch as typeof fetch,
  })
  return Object.assign(provider, { getRunId: runIdFetch.getRunId, waitForRunId: runIdFetch.waitForRunId })
}
