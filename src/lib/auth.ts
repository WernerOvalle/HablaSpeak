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
        email: { label: 'Email', type: 'email', placeholder: 'demo@hablaspeak.com' },
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

        const syncedUser = await updateUserStreakIfNeeded(user);

        return {
          id: syncedUser.id,
          email: syncedUser.email,
          name: syncedUser.name,
          isPremium: syncedUser.plan === 'PREMIUM',
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
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || '';
        session.user.email = session.user.email || '';
        session.user.isPremium = Boolean(token.isPremium);
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'hablaspeak-super-secret',
};
