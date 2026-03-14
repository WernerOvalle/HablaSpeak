import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { email, password, confirmPassword } = await req.json();

  if (!email || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Email, password y confirmacion son obligatorios' }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!normalizedEmail.includes('@')) {
    return NextResponse.json({ error: 'Email invalido' }, { status: 400 });
  }

  if (String(password).length < 6) {
    return NextResponse.json({ error: 'La contrasena debe tener al menos 6 caracteres' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Las contrasenas no coinciden' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'Ese correo ya esta registrado' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      hashedPassword: hashPassword(password),
      plan: 'FREE',
    },
    select: {
      id: true,
      email: true,
    },
  });

  return NextResponse.json({ success: true, user }, { status: 201 });
}
