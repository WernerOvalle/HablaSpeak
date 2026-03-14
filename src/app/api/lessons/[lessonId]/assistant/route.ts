import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGroqChatCompletion } from '@/lib/groq';
import { getCurrentUser } from '@/lib/session';

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

  const answer = await createGroqChatCompletion([
    {
      role: 'system',
      content:
        'Eres un tutor experto de ingles para hispanohablantes. Responde en espanol claro y usa ingles solo en ejemplos. Estructura SIEMPRE la respuesta en este orden: 1) Regla principal, 2) Explicacion corta paso a paso, 3) Ejemplo correcto y ejemplo incorrecto con su correccion, 4) Mini ejercicio (1 pregunta) y 5) Respuesta sugerida. Evita markdown complejo. Prioriza reglas practicas para hablar mejor en entrevistas y call center.',
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

  return NextResponse.json({ answer });
}
