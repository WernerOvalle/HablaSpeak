import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { verifyPassword } from './password';
import { updateUserStreakIfNeeded } from './streak';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@hablaspeak.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !verifyPassword(credentials.password, user.hashedPassword)) {
          return null;
        }

        if (!user.active) {
          return null;
        }

        const syncedUser = await updateUserStreakIfNeeded(user);
        const isAdmin = syncedUser.role === 'ADMIN';
        const isPremium = isAdmin || syncedUser.plan === 'PREMIUM';

        return {
          id: syncedUser.id,
          email: syncedUser.email,
          name: syncedUser.name,
          isPremium,
          isAdmin,
          role: syncedUser.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isPremium = user.isPremium;
        token.isAdmin = user.isAdmin;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || '';
        session.user.email = session.user.email || '';
        session.user.isPremium = Boolean(token.isPremium);
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.role = token.role;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'hablaspeak-super-secret',
};
