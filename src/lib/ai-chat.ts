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
 * Chat completion con fallback: Groq (prioritario) → OpenRouter (si Groq falla o no está configurado)
 */
export async function createAiChatCompletion(
  messages: AiChatMessage[],
  options?: { jsonMode?: boolean }
): Promise<string> {
  return withAiThrottle(async () => {
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
 */
export async function createAiChatCompletionStream(
  messages: AiChatMessage[],
  options?: { jsonMode?: boolean }
): Promise<ReadableStream<Uint8Array>> {
  return withAiThrottle(async () => {
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
