import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: { params: { scope: 'read:user user:email' } },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: 'GitSkins <noreply@gitskins.com>',
    }),
  ],
  pages: { signIn: '/auth' },
  events: {
    async createUser({ user }) {
      if (user.email) {
        const username = user.name ?? user.email.split('@')[0];
        sendWelcomeEmail(user.email, username).catch(() => {});
      }
    },
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // On GitHub sign-in: set username and githubId from GitHub profile
      if (account?.provider === 'github' && profile) {
        const gp = profile as {
          login?: string;
          avatar_url?: string;
          id?: number;
        };
        token.username = gp.login;
        token.avatar = gp.avatar_url;
        token.githubId = String(gp.id ?? '');

        // Write GitHub-specific fields the adapter doesn't handle
        if (user?.id && gp.login) {
          db.user.update({
            where: { id: user.id },
            data: {
              username: gp.login,
              githubId: String(gp.id ?? ''),
              avatarUrl: gp.avatar_url,
            },
          }).catch(() => {});
        }
      }

      // On Google sign-in: derive a username from email
      if (account?.provider === 'google' && profile) {
        const gp = profile as { picture?: string; email?: string };
        token.avatar = gp.picture;
        token.username = gp.email?.split('@')[0] ?? '';
      }

      // First sign-in (any provider): populate token from the DB user
      if (user) {
        token.id = user.id;
        if (!token.username) {
          token.username = (user as { username?: string }).username
            ?? user.email?.split('@')[0]
            ?? '';
        }
        if (!token.avatar) {
          token.avatar = user.image ?? undefined;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; username?: string; avatar?: string; githubId?: string }).id =
          token.id as string;
        (session.user as { id?: string; username?: string; avatar?: string; githubId?: string }).username =
          token.username as string;
        (session.user as { id?: string; username?: string; avatar?: string; githubId?: string }).avatar =
          token.avatar as string;
        (session.user as { id?: string; username?: string; avatar?: string; githubId?: string }).githubId =
          token.githubId as string | undefined;
      }
      return session;
    },
  },
});
