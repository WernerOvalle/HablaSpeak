import { withAiThrottle } from '@/lib/groq';
import {
  createGroqChatCompletionRaw,
  createGroqChatCompletionStreamRaw,
} from '@/lib/groq';
import {
  createOpenRouterChatCompletion,
  createOpenRouterChatCompletionStream,
} from '@/lib/openrouter';

export type AiChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  return (
    lower.includes('rate') ||
    lower.includes('429') ||
    lower.includes('limit') ||
    lower.includes('timeout') ||
    lower.includes('network') ||
    lower.includes('econnreset') ||
    lower.includes('fetch failed')
  );
}

function hasOpenRouterConfig(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

function hasGroqConfig(): boolean {
  return !!process.env.GROQ_API_KEY;
}

/**
 * Lee AI_PROVIDER del entorno para forzar un proveedor específico.
 * - 'openrouter' → fuerza OpenRouter (ignora Groq)
 * - 'groq'       → fuerza Groq (sin fallback)
 * - 'auto' / vacío → comportamiento automático (Groq → fallback OpenRouter)
 */
function getPreferredProvider(): 'groq' | 'openrouter' | 'auto' {
  const val = process.env.AI_PROVIDER?.toLowerCase();
  if (val === 'openrouter') return 'openrouter';
  if (val === 'groq') return 'groq';
  return 'auto';
}

/**
 * Chat completion con fallback: Groq (prioritario) → OpenRouter (si Groq falla o no está configurado)
 * Usar AI_PROVIDER=openrouter|groq para forzar un proveedor específico.
 */
export async function createAiChatCompletion(
  messages: AiChatMessage[],
  options?: { jsonMode?: boolean }
): Promise<string> {
  return withAiThrottle(async () => {
    const provider = getPreferredProvider();

    if (provider === 'openrouter') {
      return await createOpenRouterChatCompletion(messages, options);
    }

    if (provider === 'groq') {
      return await createGroqChatCompletionRaw(messages, options);
    }

    // auto: Groq primero, fallback a OpenRouter
    if (!hasGroqConfig() && hasOpenRouterConfig()) {
      return await createOpenRouterChatCompletion(messages, options);
    }
    try {
      return await createGroqChatCompletionRaw(messages, options);
    } catch (err) {
      if (hasOpenRouterConfig() && isRetryableError(err)) {
        try {
          return await createOpenRouterChatCompletion(messages, options);
        } catch {
          throw err;
        }
      }
      throw err;
    }
  });
}

/**
 * Chat completion streaming con fallback: Groq (prioritario) → OpenRouter (si Groq falla o no está configurado)
 * Usar AI_PROVIDER=openrouter|groq para forzar un proveedor específico.
 */
export async function createAiChatCompletionStream(
  messages: AiChatMessage[],
  options?: { jsonMode?: boolean }
): Promise<ReadableStream<Uint8Array>> {
  return withAiThrottle(async () => {
    const provider = getPreferredProvider();

    if (provider === 'openrouter') {
      return await createOpenRouterChatCompletionStream(messages, options);
    }

    if (provider === 'groq') {
      return await createGroqChatCompletionStreamRaw(messages, options);
    }

    // auto: Groq primero, fallback a OpenRouter
    if (!hasGroqConfig() && hasOpenRouterConfig()) {
      return await createOpenRouterChatCompletionStream(messages, options);
    }
    try {
      return await createGroqChatCompletionStreamRaw(messages, options);
    } catch (err) {
      if (hasOpenRouterConfig() && isRetryableError(err)) {
        try {
          return await createOpenRouterChatCompletionStream(messages, options);
        } catch {
          throw err;
        }
      }
      throw err;
    }
  });
}
