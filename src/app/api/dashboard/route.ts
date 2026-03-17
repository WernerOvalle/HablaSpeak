import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const feedbackHistory = await prisma.interviewPracticeSession.findMany({
    where: {
      userId: user.id,
      finalFeedback: { not: null },
      completedAt: { not: null },
    },
    orderBy: { completedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      scenarioId: true,
      finalFeedback: true,
      completedAt: true,
    },
  });

  return NextResponse.json({
    streak: user.streakCurrent,
    plan: user.plan,
    feedbackHistory,
  });
}
