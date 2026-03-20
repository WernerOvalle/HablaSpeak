import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAiChatCompletionStream } from '@/lib/ai-chat';
import { getCurrentUser } from '@/lib/session';
import { DAILY_AI_RESPONSE_LIMIT, reserveDailyAiResponse } from '@/lib/ai-usage';
import { hasPremiumAccess } from '@/lib/plan-access';

export const dynamic = 'force-dynamic';

const messages = (lesson: { title: string; description: string; syllabus: unknown }, question: string) => [
  {
    role: 'system' as const,
    content:
      'You are an English tutor for Spanish-speaking learners. Always respond in English, even if the user writes in Spanish. Keep the output concise, clear, and practical for spoken English. Use five sections in this order: 1) Main rule, 2) Short explanation, 3) Correct vs incorrect example with fix, 4) Mini exercise (one question), 5) Suggested answer. In section 3, provide one incorrect sentence and one corrected sentence that directly addresses the same mistake. Focus on natural learning guidance and avoid unnecessary verbosity.',
  },
  {
    role: 'user' as const,
    content: `Tema de clase: ${lesson.title}\nDescripcion: ${lesson.description}\nTemario: ${JSON.stringify(lesson.syllabus)}\nPregunta del alumno: ${question}`,
  },
];

function extractContentFromSSE(line: string): string | null {
  const trimmed = line.replace(/\r$/, '').trim();
  if (!trimmed.startsWith('data:')) return null;
  const json = trimmed.startsWith('data: ') ? trimmed.slice(6) : trimmed.slice(5).trimStart();
  if (json === '[DONE]') return null;
  try {
    const obj = JSON.parse(json);
    const content = obj?.choices?.[0]?.delta?.content;
    return typeof content === 'string' ? content : null;
  } catch {
    return null;
  }
}

export async function POST(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!hasPremiumAccess(user)) {
    return NextResponse.json({ error: 'El chatbot de clases es una funcion premium' }, { status: 403 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
  });

  if (!lesson) {
    return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
  }

  const { question } = await req.json();

  if (!question || typeof question !== 'string') {
    return NextResponse.json({ error: 'Falta la pregunta' }, { status: 400 });
  }

  const quota = await reserveDailyAiResponse(user.id);
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: `Limite diario alcanzado (${DAILY_AI_RESPONSE_LIMIT} respuestas IA). Intenta nuevamente manana.`,
        dailyLimit: DAILY_AI_RESPONSE_LIMIT,
        remainingToday: 0,
      },
      { status: 429 }
    );
  }

  let aiStream: ReadableStream<Uint8Array>;
  try {
    aiStream = await createAiChatCompletionStream(messages(lesson, question));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al conectar con la IA';
    const isRateLimit = /rate|429|limit/i.test(msg);
    return NextResponse.json(
      { error: isRateLimit ? 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.' : msg },
      { status: isRateLimit ? 429 : 502 }
    );
  }

  const outputStream = new ReadableStream({
    async start(controller) {
      const reader = aiStream.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullAnswer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const content = extractContentFromSSE(line);
            if (content) {
              fullAnswer += content;
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
        }
        if (buffer.trim()) {
          const content = extractContentFromSSE(buffer);
          if (content) {
            fullAnswer += content;
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
      } finally {
        reader.releaseLock();
      }
      const trimmed = fullAnswer.trim();
      if (trimmed) {
        await prisma.lessonQuestion.create({
          data: {
            lessonId: lesson.id,
            userId: user.id,
            prompt: question,
            answer: trimmed,
          },
        });
      }
      controller.close();
    },
  });

  return new Response(outputStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Daily-Limit': String(DAILY_AI_RESPONSE_LIMIT),
      'X-Remaining-Today': String(quota.remaining),
    },
  });
}
