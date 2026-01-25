/**
 * NextAuth.js Configuration
 *
 * Handles GitHub OAuth authentication for GitSkins.
 */

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store GitHub username in the token
      if (account && profile) {
        token.username = (profile as { login?: string }).login;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add username to the session
      if (session.user) {
        (session.user as { username?: string }).username = token.username as string;
      }
      return session;
    },
  },
});
