import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { updateUserStreakIfNeeded } from './streak';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return null;
  }

  return updateUserStreakIfNeeded(user);
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  return user;
}
