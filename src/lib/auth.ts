
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

// Export v5 handlers and helpers
export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@foo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Type guard for credentials
        if (
          !credentials ||
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          return null;
        }
        const rows = await prisma.$queryRaw<
          Array<{ id: number; email: string; password: string; role: string }>
        >`
          SELECT "id", "email", "password", "role"
          FROM "User"
          WHERE "email" = ${credentials.email}
          LIMIT 1
        `;

        const user = rows[0];
        if (!user || typeof user.password !== 'string') return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        // Return user object for session
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: (token as { role?: string }).role,
        },
      };
    },
    jwt({ token, user }) {
      // user is type: { id?: string; email?: string; name?: string; role?: string }
      if (user && typeof (user as { role?: string }).role === 'string') {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
  },
});
