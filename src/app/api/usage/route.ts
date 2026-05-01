/**
 * GET /api/usage
 *
 * Returns the authenticated user's current plan and usage snapshot.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUsageSnapshot, getUsageSnapshotById } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = session.user as { id?: string; username?: string };

  if (user.id) {
    const snapshot = await getUsageSnapshotById(user.id);
    return NextResponse.json(snapshot);
  }

  if (!user.username) {
    return NextResponse.json({ error: 'No user identifier in session' }, { status: 400 });
  }

  const snapshot = await getUsageSnapshot(user.username);
  return NextResponse.json(snapshot);
}
