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
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
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
      // Store GitHub username and avatar in the token
      if (account && profile) {
        token.username = (profile as { login?: string }).login;
        token.avatar = (profile as { avatar_url?: string }).avatar_url;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add username and avatar to the session
      if (session.user) {
        (session.user as { username?: string; avatar?: string }).username = token.username as string;
        (session.user as { username?: string; avatar?: string }).avatar = token.avatar as string;
      }
      return session;
    },
  },
});
