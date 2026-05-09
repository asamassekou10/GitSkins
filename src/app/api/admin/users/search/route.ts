import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Search query must be at least 2 characters' }, { status: 400 });
  }

  const month = currentMonth();
  const users = await db.user.findMany({
    where: {
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      createdAt: true,
      subscription: { select: { plan: true, status: true } },
      creditBalance: { select: { credits: true } },
      usage: {
        where: { month },
        select: { readmeGenerationsUsed: true },
        take: 1,
      },
    },
  });

  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      plan: user.subscription?.plan === 'pro' && user.subscription.status === 'active' ? 'pro' : 'free',
      subscriptionStatus: user.subscription?.status ?? null,
      credits: user.creditBalance?.credits ?? 0,
      readmeGenerationsUsed: user.usage[0]?.readmeGenerationsUsed ?? 0,
    })),
  });
}
