import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      username?: string;
      count?: number;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    accessToken?: string;
    username?: string;
    count?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    username?: string;
    count?: number;
  }
}
