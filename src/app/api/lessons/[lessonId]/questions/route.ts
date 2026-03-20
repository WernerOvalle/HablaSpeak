import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGroqChatCompletion } from '@/lib/groq';
import { getCurrentUser } from '@/lib/session';
import { hasPremiumAccess } from '@/lib/plan-access';

export const dynamic = 'force-dynamic';

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function POST(
  _req: Request,
  { params }: { params: { lessonId: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!hasPremiumAccess(user)) {
    return NextResponse.json({ error: 'Disponible solo para usuarios premium' }, { status: 403 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
  });

  if (!lesson) {
    return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
  }

  const rawResponse = await createGroqChatCompletion([
    {
      role: 'system',
      content:
        'Eres un coach de ingles para call center y negocio. Devuelve JSON valido sin markdown con el formato {"questions":["...","...","..."]}. Crea exactamente 3 preguntas en ingles, claras y utiles para practicar la clase.',
    },
    {
      role: 'user',
      content: `Clase: ${lesson.title}\nDescripcion: ${lesson.description}\nTemario: ${JSON.stringify(lesson.syllabus)}`,
    },
  ]);

  const parsed = safeJsonParse<{ questions?: string[] }>(rawResponse);
  const questions =
    parsed?.questions?.filter(question => typeof question === 'string' && question.trim().length > 0).slice(0, 3) || [];

  if (questions.length === 0) {
    return NextResponse.json({ error: 'Groq no devolvio preguntas validas' }, { status: 502 });
  }

  await prisma.lessonQuestion.createMany({
    data: questions.map(prompt => ({
      lessonId: lesson.id,
      userId: user.id,
      prompt,
    })),
  });

  return NextResponse.json({ questions });
}
