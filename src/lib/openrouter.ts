export type OpenRouterMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function createOpenRouterChatCompletion(
  messages: OpenRouterMessage[],
  options?: { jsonMode?: boolean }
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openrouter/free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no configurada');
  }

  console.log(`[AI] Usando OpenRouter | modelo: ${model}`);

  const body = JSON.stringify({
    model,
    temperature: 0.4,
    ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    messages,
  });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || 'Error desconocido llamando a OpenRouter';
    throw new Error(message);
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('Respuesta inválida de OpenRouter');
  }

  return content;
}

export async function createOpenRouterChatCompletionStream(
  messages: OpenRouterMessage[],
  options?: { jsonMode?: boolean }
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openrouter/free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no configurada');
  }

  console.log(`[AI] Usando OpenRouter (stream) | modelo: ${model}`);

  const body = JSON.stringify({
    model,
    temperature: 0.4,
    stream: true,
    ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    messages,
  });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
    },
    body,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = data?.error?.message || 'Error desconocido llamando a OpenRouter';
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error('OpenRouter no devolvió stream');
  }

  return response.body;
}
