import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { fetchProfileForReadme } from '@/lib/github';
import { analyzeDeveloperPersona } from '@/lib/persona-analyzer';
import { getUserPlanById } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'Sign in required', code: 'UNAUTHENTICATED' },
      { status: 401 }
    );
  }

  const plan = await getUserPlanById(userId);
  if (plan !== 'pro') {
    return NextResponse.json(
      { error: 'Project persona avatars require Pro', code: 'UPGRADE_REQUIRED' },
      { status: 403 }
    );
  }

  const { searchParams, origin } = new URL(req.url);
  const username = (searchParams.get('username') ?? '').trim().replace(/^@/, '').slice(0, 39);

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json(
      { error: 'Valid GitHub username required', code: 'INVALID_USERNAME' },
      { status: 400 }
    );
  }

  const profile = await fetchProfileForReadme(username);
  if (!profile) {
    return NextResponse.json(
      { error: 'GitHub user not found', code: 'USER_NOT_FOUND' },
      { status: 404 }
    );
  }

  const persona = analyzeDeveloperPersona(profile, username, origin);
  return NextResponse.json({ persona });
}
