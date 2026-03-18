type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function normalizeTranscriptionLanguage(language?: string) {
  if (!language) return undefined;

  const normalized = language.trim().toLowerCase();
  if (!normalized) return undefined;

  const base = normalized.split(/[-_]/)[0];
  if (/^[a-z]{2}$/.test(base)) {
    return base;
  }

  return undefined;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Cola para serializar llamadas a Groq y evitar ráfagas que disparen rate limit */
let groqChatQueue: Promise<unknown> = Promise.resolve();
const GROQ_MIN_GAP_MS = 400;

async function withGroqThrottle<T>(fn: () => Promise<T>): Promise<T> {
  const prev = groqChatQueue;
  let resolveNext: () => void;
  groqChatQueue = new Promise<void>(r => { resolveNext = r; });
  try {
    await prev;
    await sleep(GROQ_MIN_GAP_MS);
    return await fn();
  } finally {
    resolveNext!();
  }
}

export async function createGroqChatCompletion(messages: GroqMessage[], options?: { jsonMode?: boolean }) {
  return withGroqThrottle(async () => {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    if (!apiKey) {
      throw new Error('GROQ_API_KEY no configurada');
    }

    const body = JSON.stringify({
      model,
      temperature: 0.4,
      ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
      messages,
    });

    const MAX_RETRIES = 3;
    const RETRY_DELAYS = [3000, 5000, 10000];

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
      });

      if (response.status === 429 && attempt < MAX_RETRIES) {
        const retryAfter = response.headers.get('retry-after');
        const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAYS[attempt];
        await sleep(waitMs);
        continue;
      }

      const data = await response.json();

      if (!response.ok) {
        const message = data?.error?.message || 'Error desconocido llamando a Groq';
        throw new Error(message);
      }

      const content = data?.choices?.[0]?.message?.content;

      if (!content || typeof content !== 'string') {
        throw new Error('Respuesta inválida de Groq');
      }

      return content;
    }

    throw new Error('Rate limit de Groq: demasiadas solicitudes, intenta en unos segundos.');
  });
}

export async function createGroqTranscription(audioFile: File, language?: string) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_STT_MODEL || 'whisper-large-v3-turbo';

  if (!apiKey) {
    throw new Error('GROQ_API_KEY no configurada');
  }

  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', model);
  formData.append('response_format', 'json');
  const normalizedLanguage = normalizeTranscriptionLanguage(language) || 'en';
  formData.append('language', normalizedLanguage);

  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || 'Error desconocido transcribiendo audio con Groq';
    throw new Error(message);
  }

  const text = data?.text;
  if (!text || typeof text !== 'string') {
    throw new Error('Respuesta invalida de transcripcion en Groq');
  }

  return text.trim();
}
