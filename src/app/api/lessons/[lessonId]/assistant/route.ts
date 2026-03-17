import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGroqChatCompletion } from '@/lib/groq';
import { getCurrentUser } from '@/lib/session';
import { DAILY_AI_RESPONSE_LIMIT, reserveDailyAiResponse } from '@/lib/ai-usage';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (user.plan !== 'PREMIUM') {
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

  const answer = await createGroqChatCompletion([
    {
      role: 'system',
      content:
        'You are an English tutor for Spanish-speaking learners. Always respond in English, even if the user writes in Spanish. Keep the output concise, clear, and practical for spoken English. Use five sections in this order: 1) Main rule, 2) Short explanation, 3) Correct vs incorrect example with fix, 4) Mini exercise (one question), 5) Suggested answer. In section 3, provide one incorrect sentence and one corrected sentence that directly addresses the same mistake. Focus on natural learning guidance and avoid unnecessary verbosity.',
    },
    {
      role: 'user',
      content: `Tema de clase: ${lesson.title}\nDescripcion: ${lesson.description}\nTemario: ${JSON.stringify(lesson.syllabus)}\nPregunta del alumno: ${question}`,
    },
  ]);

  await prisma.lessonQuestion.create({
    data: {
      lessonId: lesson.id,
      userId: user.id,
      prompt: question,
      answer,
    },
  });

  return NextResponse.json({
    answer: answer.trim(),
    dailyLimit: DAILY_AI_RESPONSE_LIMIT,
    remainingToday: quota.remaining,
  });
}
