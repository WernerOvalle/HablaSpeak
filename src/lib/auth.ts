import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

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

        const isDemoUser = credentials.email === 'demo@hablaspeak.com' && credentials.password === '123456';
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user && isDemoUser) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: credentials.password,
              name: 'Demo User',
              strikeCurrent: 1,
              lastLoginAt: new Date()
            }
          });
        }

        if (user && user.password === credentials.password) {
          const today = new Date();
          const lastLogin = new Date(user.lastLoginAt);
          const timeDiff = today.getTime() - lastLogin.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          
          let newStreak = user.strikeCurrent;
          if (daysDiff === 1) {
            newStreak += 1;
          } else if (daysDiff > 1) {
            newStreak = 1;
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              strikeCurrent: newStreak,
              lastLoginAt: new Date()
            }
          });

          return { id: user.id, email: user.email, name: user.name };
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'hablaspeak-super-secret',
};
