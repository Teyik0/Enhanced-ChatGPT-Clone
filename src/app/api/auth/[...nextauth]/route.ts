import NextAuth, { type NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ['none'],
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  // session: {
  //   strategy: 'jwt',
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },
  // jwt: {
  //   secret: process.env.JWT_SECRET!,
  //   // maxAge: 60 * 60 * 24 * 30,
  //   // async encode({ secret, token, maxAge }) {},
  //   // async decode({ secret, token }) {},
  // },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
