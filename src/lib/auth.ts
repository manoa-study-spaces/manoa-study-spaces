
import NextAuth, { CredentialsSignin, type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

class UserNotFoundSigninError extends CredentialsSignin {
  code = 'user_not_found';
}

class InvalidPasswordSigninError extends CredentialsSignin {
  code = 'invalid_password';
}

class InvalidRequestSigninError extends CredentialsSignin {
  code = 'invalid_request';
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
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
          throw new InvalidRequestSigninError();
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
        if (!user || typeof user.password !== 'string') {
          throw new UserNotFoundSigninError();
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new InvalidPasswordSigninError();
        }

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
          id: token.id as string,
          role: (token as { role?: string }).role,
        },
      };
    },
    jwt({ token, user }) {
      // user is type: { id?: string; email?: string; name?: string; role?: string }
      if (user && typeof (user as { role?: string }).role === 'string') {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
  },
});
