import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { getErrorLabel } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { errorKey, latestFeedback } = await req.json();

  if (!errorKey || !latestFeedback) {
    return NextResponse.json({ error: 'Faltan errorKey o latestFeedback' }, { status: 400 });
  }

  const record = await prisma.errorRecord.upsert({
    where: {
      userId_errorKey: {
        userId: user.id,
        errorKey,
      },
    },
    update: {
      count: { increment: 1 },
      latestFeedback,
      title: getErrorLabel(errorKey),
    },
    create: {
      userId: user.id,
      errorKey,
      title: getErrorLabel(errorKey),
      latestFeedback,
      count: 1,
    },
  });

  return NextResponse.json({ success: true, record });
}
