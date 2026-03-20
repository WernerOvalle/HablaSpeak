import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json(
      { error: msg === 'UNAUTHORIZED' ? 'No autorizado' : 'Acceso denegado' },
      { status: msg === 'UNAUTHORIZED' ? 401 : 403 }
    );
  }

  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
  }

  const body = await req.json();

  const updates: { hashedPassword?: string; active?: boolean; plan?: 'FREE' | 'PREMIUM' } = {};

  if (typeof body.password === 'string' && body.password.trim()) {
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }
    updates.hashedPassword = hashPassword(body.password);
  }

  if (typeof body.active === 'boolean') {
    updates.active = body.active;
  }

  if (body.plan === 'FREE' || body.plan === 'PREMIUM') {
    updates.plan = body.plan;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  if (existing.role === 'ADMIN') {
    return NextResponse.json(
      { error: 'No se puede modificar un usuario administrador' },
      { status: 403 }
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      active: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ user });
}
