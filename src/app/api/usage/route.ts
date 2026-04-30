/**
 * GET /api/usage
 *
 * Returns the authenticated user's current plan and usage snapshot.
 * The dashboard fetches this instead of reading from localStorage.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUsageSnapshot } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = session.user as { username?: string };
  const username = user.username;

  if (!username) {
    return NextResponse.json({ error: 'No GitHub username in session' }, { status: 400 });
  }

  const snapshot = await getUsageSnapshot(username);
  return NextResponse.json(snapshot);
}
