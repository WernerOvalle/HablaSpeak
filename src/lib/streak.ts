import type { User } from '@prisma/client';
import { prisma } from './prisma';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function utcDayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / MS_PER_DAY);
}

export async function updateUserStreakIfNeeded(user: User) {
  const now = new Date();
  const last = new Date(user.lastLoginAt);
  const dayDiff = utcDayNumber(now) - utcDayNumber(last);

  let nextStreak = user.streakCurrent;
  let shouldUpdate = false;

  if (dayDiff === 1) {
    nextStreak = Math.max(1, user.streakCurrent + 1);
    shouldUpdate = true;
  } else if (dayDiff > 1) {
    nextStreak = 1;
    shouldUpdate = true;
  } else if (dayDiff === 0 && user.streakCurrent === 0) {
    nextStreak = 1;
    shouldUpdate = true;
  }

  if (!shouldUpdate) {
    return user;
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      streakCurrent: nextStreak,
      lastLoginAt: now,
    },
  });
}
