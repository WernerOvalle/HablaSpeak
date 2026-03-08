import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      errors: {
        orderBy: { count: 'desc' },
        take: 5
      }
    }
  });

  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

  return NextResponse.json({
    streak: user.strikeCurrent,
    errors: user.errors.map(e => ({ label: e.errorType, count: e.count }))
  });
}
