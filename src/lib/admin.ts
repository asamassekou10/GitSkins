import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const DEFAULT_ADMIN_EMAILS = ['alhassane.samassekou@gmail.com'];
const DEFAULT_ADMIN_USERNAMES = ['asamassekou10'];

function parseList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function adminEmails(): string[] {
  return [...DEFAULT_ADMIN_EMAILS, ...parseList(process.env.ADMIN_EMAILS)];
}

export function adminUsernames(): string[] {
  return [...DEFAULT_ADMIN_USERNAMES, ...parseList(process.env.ADMIN_USERNAMES)];
}

export function isAdminUser(user: { email?: string | null; username?: string | null } | undefined): boolean {
  if (!user) return false;
  const email = user.email?.toLowerCase();
  const username = user.username?.toLowerCase();
  return Boolean(
    (email && adminEmails().includes(email)) ||
    (username && adminUsernames().includes(username))
  );
}

export async function getAdminSession() {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string | null; username?: string | null; name?: string | null } | undefined;

  if (!session?.user || !isAdminUser(user)) {
    return null;
  }

  return { session, user };
}

export async function requireAdminApi() {
  const admin = await getAdminSession();
  if (!admin) {
    return {
      admin: null,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { admin, response: null };
}
