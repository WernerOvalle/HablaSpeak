import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { errorType } = await req.json();

  if (!errorType) return NextResponse.json({ error: 'Falta errorType' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

  // Limpiar y acortar el nombre del error
  const cleanErrorType = errorType.length > 50 ? errorType.substring(0, 50) + '...' : errorType;

  // Upsert error record
  const record = await prisma.errorRecord.upsert({
    where: {
      userId_errorType: {
        userId: user.id,
        errorType: cleanErrorType
      }
    },
    update: { count: { increment: 1 } },
    create: {
      userId: user.id,
      errorType: cleanErrorType,
      count: 1
    }
  });

  return NextResponse.json({ success: true, record });
}
