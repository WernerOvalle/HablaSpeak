import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json(
      { error: msg === 'UNAUTHORIZED' ? 'No autorizado' : 'Acceso denegado' },
      { status: msg === 'UNAUTHORIZED' ? 401 : 403 }
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      active: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json(
      { error: msg === 'UNAUTHORIZED' ? 'No autorizado' : 'Acceso denegado' },
      { status: msg === 'UNAUTHORIZED' ? 401 : 403 }
    );
  }

  const { email, password, plan } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email es obligatorio' }, { status: 400 });
  }

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Contraseña es obligatoria' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 6 caracteres' },
      { status: 400 }
    );
  }

  const validPlan = plan === 'PREMIUM' || plan === 'FREE' ? plan : 'FREE';
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail.includes('@')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return NextResponse.json({ error: 'Ese correo ya está registrado' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      hashedPassword: hashPassword(password),
      plan: validPlan,
      active: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
