import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGroqChatCompletion } from '@/lib/groq';
import { getCurrentUser } from '@/lib/session';
import { DAILY_AI_RESPONSE_LIMIT, reserveDailyAiResponse } from '@/lib/ai-usage';
import { INTERVIEW_BLOCK_SIZE, toPracticeTurns, buildBlockFeedback, type PracticeTurn } from '@/lib/interview-practice';

export const dynamic = 'force-dynamic';

type InterviewResponse = {
  reply: string;
  roundFeedback?: string | null;
};

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    // Intentar extraer JSON de bloques markdown o texto con contenido extra
    const match = value.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (user.plan !== 'PREMIUM') {
    return NextResponse.json({ error: 'La entrevista con IA es premium' }, { status: 403 });
  }

  const { message, scenarioId, scenarioTitle, scenarioDescription, freshSession } = await req.json();

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Falta message' }, { status: 400 });
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

  const currentScenarioId =
    typeof scenarioId === 'string' && scenarioId.trim()
      ? scenarioId.trim()
      : 'job-interview';

  const activeSession = await prisma.interviewPracticeSession.findFirst({
    where: {
      userId: user.id,
      scenarioId: currentScenarioId,
      status: 'ACTIVE',
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Si es el primer mensaje de una nueva entrada al escenario, ignorar el conteo previo
  const previousTurns = freshSession ? [] : toPracticeTurns(activeSession?.errorTally);
  const recentTurns = previousTurns.slice(-6);
  const baseCount = freshSession ? 0 : (activeSession?.aiResponsesCount || 0);
  const nextCount = baseCount + 1;
  const isRoundCompletion = nextCount >= INTERVIEW_BLOCK_SIZE;

  const isCallCenter = currentScenarioId !== 'job-interview';
  const aiRole = isCallCenter ? 'Customer (caller with a problem)' : 'Interviewer';
  const learnerRole = isCallCenter ? 'Call center agent' : 'Job applicant';

  // Construir historial multi-turno real: cada aiReply va como 'assistant', cada userMessage como 'user'
  // Esto hace que el modelo recuerde su propio rol en cada turno anterior
  const historyMessages = recentTurns.flatMap(turn => [
    { role: 'user' as const, content: turn.userMessage },
    { role: 'assistant' as const, content: turn.aiReply },
  ]);

  const rawResponse = await createGroqChatCompletion([
    {
      role: 'system',
      content: `You are roleplaying a live conversation. Your role: ${aiRole}. The learner's role: ${learnerRole}. Scenario: "${scenarioTitle || 'General practice'}" — ${scenarioDescription || ''}. Stay fully in character as ${aiRole} at all times. Never introduce yourself as an agent, assistant, or support staff. Never switch roles. Reply in English only, 1-3 natural sentences, continuing the scenario.

Always return valid JSON: {"reply":"...","roundFeedback":null}

roundCompletion: ${isRoundCompletion}

If roundCompletion is false: set roundFeedback to null.
If roundCompletion is true:
- "reply": your final in-character response as usual
- "roundFeedback": Give CONCRETE corrections in this format: "Instead of saying [their exact phrase], say [corrected phrase] — [brief reason]." Example: "Instead of saying 'sure we have 2 transaction', say 'Sure, we have two transactions' — 'transaction' needs an 's' for plural, and spelling out numbers sounds more natural." Pick 1-2 real mistakes from their messages and fix them. Mention what they did well if applicable. Never use generic advice like "review verb tenses" without a specific example. Be direct and actionable.`,
    },
    ...historyMessages,
    {
      role: 'user',
      content: message,
    },
  ], { jsonMode: true });

  const parsed = safeJsonParse<InterviewResponse>(rawResponse);

  // Extraer el reply: del JSON parseado o del texto plano como fallback
  const replyText = parsed?.reply?.trim()
    || rawResponse.trim().replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();

  if (!replyText) {
    return NextResponse.json({ error: 'Could not get a response. Please try again.' }, { status: 502 });
  }

  const newTurn: PracticeTurn = {
    userMessage: message.trim(),
    aiReply: replyText,
  };
  const nextTurns = [...previousTurns, newTurn];
  const practiceCompleted = isRoundCompletion;

  let finalFeedback: string | null = null;
  if (practiceCompleted) {
    const fromFirstCall =
      typeof parsed?.roundFeedback === 'string' && parsed.roundFeedback.trim()
        ? parsed.roundFeedback.trim()
        : null;
    if (fromFirstCall) {
      finalFeedback = fromFirstCall;
    } else {
      // La IA no devolvió feedback válido: hacer una segunda llamada solo para feedback
      const feedbackQuota = await reserveDailyAiResponse(user.id);
      if (feedbackQuota.allowed) {
        try {
          const conversationText = nextTurns
            .map(t => `Learner: ${t.userMessage}\n${aiRole}: ${t.aiReply}`)
            .join('\n\n');
          const feedbackResponse = await createGroqChatCompletion([
            {
              role: 'system',
              content: `You are an English teacher. Based on this conversation, give 2-4 sentences of feedback in English. Use this format: "Instead of saying [their phrase], say [corrected phrase] — [reason]." Pick 1-2 real mistakes from the learner's messages and fix them. Mention what they did well if applicable. Be direct and actionable. Reply with ONLY the feedback text, no JSON.`,
            },
            {
              role: 'user',
              content: `Conversation:\n\n${conversationText}\n\nGive specific corrections for the learner.`,
            },
          ]);
          const trimmed = feedbackResponse?.trim();
          if (trimmed && trimmed.length > 20) {
            finalFeedback = trimmed;
          }
        } catch {
          // Si falla la segunda llamada, usar fallback
        }
      }
      if (!finalFeedback) {
        finalFeedback = buildBlockFeedback(nextTurns);
      }
    }
  }

  await prisma.$transaction(async tx => {
    const sessionId = activeSession?.id;
    const nextSessionCount = practiceCompleted ? 0 : nextCount;
    const nextTurnsPayload = practiceCompleted ? { turns: [] } : { turns: nextTurns };

    if (sessionId) {
      await tx.interviewPracticeSession.update({
        where: { id: sessionId },
        data: {
          aiResponsesCount: nextSessionCount,
          errorTally: nextTurnsPayload,
          latestCorrections: { turnsCount: nextTurns.length },
          status: 'ACTIVE',
          finalFeedback: finalFeedback || null,
          completedAt: practiceCompleted ? new Date() : null,
        },
      });
    } else {
      await tx.interviewPracticeSession.create({
        data: {
          userId: user.id,
          scenarioId: currentScenarioId,
          aiResponsesCount: nextSessionCount,
          errorTally: nextTurnsPayload,
          latestCorrections: { turnsCount: nextTurns.length },
          status: 'ACTIVE',
          finalFeedback: finalFeedback || null,
          completedAt: practiceCompleted ? new Date() : null,
        },
      });
    }
  });

  return NextResponse.json({
    reply: replyText,
    displayText: replyText,
    practiceCompleted,
    finalFeedback,
    aiResponsesInBlock: practiceCompleted ? INTERVIEW_BLOCK_SIZE : nextCount,
    responsesRemainingInBlock: practiceCompleted ? 0 : Math.max(INTERVIEW_BLOCK_SIZE - nextCount, 0),
    dailyLimit: DAILY_AI_RESPONSE_LIMIT,
    remainingToday: quota.remaining,
  });
}
