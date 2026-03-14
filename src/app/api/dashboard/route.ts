import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(Number(searchParams.get('page') || '1'), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || '5'), 1), 20);
  const skip = (page - 1) * pageSize;

  const [errors, total] = await Promise.all([
    prisma.errorRecord.findMany({
      where: { userId: user.id },
      orderBy: [{ count: 'desc' }, { updatedAt: 'desc' }],
      skip,
      take: pageSize,
    }),
    prisma.errorRecord.count({
      where: { userId: user.id },
    }),
  ]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return NextResponse.json({
    streak: user.streakCurrent,
    plan: user.plan,
    errors: errors.map(error => ({
      id: error.id,
      errorKey: error.errorKey,
      label: error.title,
      count: error.count,
      latestFeedback: error.latestFeedback,
      updatedAt: error.updatedAt,
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  });
}
