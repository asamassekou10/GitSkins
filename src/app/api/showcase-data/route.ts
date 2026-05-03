import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchExtendedGitHubData } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  username: z.string().min(1).max(39).regex(/^[a-zA-Z0-9-]+$/),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    username: request.nextUrl.searchParams.get('username') ?? '',
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid GitHub username' },
      { status: 400 }
    );
  }

  const data = await fetchExtendedGitHubData(parsed.data.username);

  if (!data) {
    return NextResponse.json(
      { error: 'GitHub user not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      stats: data.stats,
      languages: data.languages,
      pinnedRepos: data.pinnedRepos,
      totalContributions: data.totalContributions,
      totalStars: data.totalStars,
      contributionCalendar: data.contributionCalendar,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600',
      },
    }
  );
}
