import type { Plan, Role } from '@prisma/client';

/**
 * Misma regla que en auth (JWT): premium en DB o admin activo.
 * Las rutas API deben usar esto en lugar de solo `user.plan === 'PREMIUM'`.
 */
export function hasPremiumAccess(user: { plan: Plan; role: Role }): boolean {
  return user.plan === 'PREMIUM' || user.role === 'ADMIN';
}
