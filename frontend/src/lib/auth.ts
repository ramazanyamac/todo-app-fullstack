import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/services/auth';
import { defaultLocale } from '@/i18n/routing';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const locale = req.body?.locale || defaultLocale;

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // API request to authenticate user
          const res = await login({
            username: credentials.username,
            password: credentials.password,
          }, locale);

          const data = await res.json();

          if (res.ok && data.token) {
            // Extract user information from the token or fetch from backend
            return {
              id: data.id,
              name: null,
              email: data.email || null,
              username: data.username || credentials.username,
              accessToken: data.token,
              count: 0,
            };
          } else {
              throw new Error(
            "We couldn't find your profile. Please contact us if the error persists."
          );
          }
          
        } catch (error) {
           throw new Error(
            "We couldn't find your profile. Please contact us if the error persists."
          );
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.count = user.count;
      }

      if (trigger === 'update' && session?.user) {
        token.count = session.user.count;
        token.name = session.user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken;
        session.user.username = token.username;
      }

      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
