import { prisma } from '@/lib/prisma';

export const DAILY_AI_RESPONSE_LIMIT = Number(process.env.DAILY_AI_LIMIT) || 50;

function getDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export async function reserveDailyAiResponse(userId: string) {
  const dayKey = getDayKey();

  const result = await prisma.$transaction(async tx => {
    const usage = await tx.dailyAiUsage.upsert({
      where: {
        userId_dayKey: {
          userId,
          dayKey,
        },
      },
      create: {
        userId,
        dayKey,
        count: 0,
      },
      update: {},
    });

    const updated = await tx.dailyAiUsage.updateMany({
      where: {
        id: usage.id,
        count: {
          lt: DAILY_AI_RESPONSE_LIMIT,
        },
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });

    const finalUsage = await tx.dailyAiUsage.findUnique({
      where: { id: usage.id },
      select: { count: true },
    });

    return {
      allowed: updated.count > 0,
      used: finalUsage?.count || usage.count,
    };
  });

  return {
    ...result,
    dayKey,
    remaining: Math.max(DAILY_AI_RESPONSE_LIMIT - result.used, 0),
  };
}
