import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      isPremium: boolean;
      isAdmin?: boolean;
      role?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    isPremium: boolean;
    isAdmin?: boolean;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isPremium?: boolean;
    isAdmin?: boolean;
    role?: string;
  }
}
