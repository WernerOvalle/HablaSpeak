import type { Prisma } from '@prisma/client';

export const INTERVIEW_BLOCK_SIZE = 10;

export type PracticeTurn = {
  userMessage: string;
  aiReply: string;
};

export function parseJsonRecord(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

export function toPracticeTurns(value: Prisma.JsonValue | null | undefined) {
  const record = parseJsonRecord(value);
  const turns = Array.isArray(record.turns) ? record.turns : [];
  const parsed: PracticeTurn[] = [];

  turns.forEach(turn => {
    if (
      turn &&
      typeof turn === 'object' &&
      typeof (turn as { userMessage?: unknown }).userMessage === 'string' &&
      typeof (turn as { aiReply?: unknown }).aiReply === 'string'
    ) {
      parsed.push({
        userMessage: (turn as { userMessage: string }).userMessage,
        aiReply: (turn as { aiReply: string }).aiReply,
      });
    }
  });

  return parsed;
}

export function buildBlockFeedback(turns: PracticeTurn[]) {
  if (!turns.length) {
    return 'Keep practicing! Focus on what you learned in this round.';
  }
  const learnerPhrases = turns.map(t => t.userMessage).filter(Boolean);
  if (!learnerPhrases.length) {
    return 'Good effort this round. Try another round to get specific feedback on your phrasing.';
  }
  const summary = learnerPhrases.length <= 2
    ? learnerPhrases.map(p => `"${p}"`).join(' and ')
    : `"${learnerPhrases[0]}", ... and "${learnerPhrases[learnerPhrases.length - 1]}"`;
  return `In this round you said: ${summary}. We couldn't generate AI corrections right now — try again later to get specific fixes like "Instead of saying X, say Y."`;
}
