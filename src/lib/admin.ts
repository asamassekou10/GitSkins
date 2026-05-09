import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

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

export function adminJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function isTrustedMutationOrigin(request?: Request): boolean {
  if (!request || request.method === 'GET' || request.method === 'HEAD') {
    return true;
  }

  const origin = request.headers.get('origin');
  if (!origin) {
    return false;
  }

  const allowedOrigins = new Set<string>();

  try {
    allowedOrigins.add(new URL(request.url).origin);
  } catch {
    // Keep checking NEXTAUTH_URL below.
  }

  if (process.env.NEXTAUTH_URL) {
    try {
      allowedOrigins.add(new URL(process.env.NEXTAUTH_URL).origin);
    } catch {
      // Ignore malformed env values and rely on the request URL.
    }
  }

  return allowedOrigins.has(origin);
}

export async function getAdminAuthState() {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string | null; username?: string | null; name?: string | null } | undefined;

  if (!session?.user || !user) {
    return { status: 'unauthenticated' as const, session: null, user: null };
  }

  const dbUser = user.id
    ? await db.user.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, username: true, name: true },
      })
    : null;

  const resolvedUser = dbUser ?? user;

  if (!isAdminUser(resolvedUser)) {
    return { status: 'forbidden' as const, session, user: resolvedUser };
  }

  return { status: 'admin' as const, session, user: resolvedUser };
}

export async function getAdminSession() {
  const state = await getAdminAuthState();
  if (state.status !== 'admin') {
    return null;
  }

  return { session: state.session, user: state.user };
}

export async function requireAdminApi(request?: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return {
      admin: null,
      response: adminJson({ error: 'Invalid request origin' }, 403),
    };
  }

  const admin = await getAdminSession();
  if (!admin) {
    return {
      admin: null,
      response: adminJson({ error: 'Forbidden' }, 403),
    };
  }

  return { admin, response: null };
}
