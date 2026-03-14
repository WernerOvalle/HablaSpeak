import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGroqChatCompletion } from '@/lib/groq';
import { getCurrentUser } from '@/lib/session';
import { getErrorLabel } from '@/lib/errors';

export const dynamic = 'force-dynamic';

type InterviewResponse = {
  feedback: string;
  hasError: boolean;
  errorKey: string | null;
  correction: string | null;
  nextQuestion: string;
};

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function buildDisplayText(data: InterviewResponse) {
  const feedbackLine = data.hasError && data.correction
    ? `Correccion: ${data.correction}`
    : `Feedback: ${data.feedback}`;

  return `${feedbackLine}\nNext Question: ${data.nextQuestion}`;
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (user.plan !== 'PREMIUM') {
    return NextResponse.json({ error: 'La entrevista con IA es premium' }, { status: 403 });
  }

  const { message, scenarioTitle, scenarioDescription } = await req.json();

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Falta message' }, { status: 400 });
  }

  const rawResponse = await createGroqChatCompletion([
    {
      role: 'system',
      content:
        'You are Alex, a professional English interviewer for call center roles. Reply with valid JSON only and no markdown. Format: {"feedback":"string","hasError":boolean,"errorKey":"grammar|vocabulary|verb_tense|prepositions|articles|sentence_structure|fluency|pronunciation|null","correction":"string|null","nextQuestion":"string"}. If the user made no clear English mistake, set hasError to false, errorKey to null, and correction to null. Keep feedback kind and short. Keep nextQuestion in English.',
    },
    {
      role: 'user',
      content: `Scenario title: ${scenarioTitle || 'General interview'}\nScenario description: ${scenarioDescription || 'General English speaking practice'}\nCandidate answer: ${message}`,
    },
  ]);

  const parsed = safeJsonParse<InterviewResponse>(rawResponse);

  if (!parsed?.feedback || !parsed?.nextQuestion) {
    return NextResponse.json({ error: 'Groq devolvio una respuesta invalida' }, { status: 502 });
  }

  if (parsed.hasError && parsed.errorKey && parsed.correction) {
    await prisma.errorRecord.upsert({
      where: {
        userId_errorKey: {
          userId: user.id,
          errorKey: parsed.errorKey,
        },
      },
      update: {
        count: { increment: 1 },
        title: getErrorLabel(parsed.errorKey),
        latestFeedback: parsed.correction,
      },
      create: {
        userId: user.id,
        errorKey: parsed.errorKey,
        title: getErrorLabel(parsed.errorKey),
        latestFeedback: parsed.correction,
        count: 1,
      },
    });
  }

  return NextResponse.json({
    ...parsed,
    displayText: buildDisplayText(parsed),
  });
}
