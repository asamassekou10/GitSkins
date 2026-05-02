import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await db.readmeGeneration.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
    select: {
      id: true,
      username: true,
      title: true,
      goal: true,
      structure: true,
      tone: true,
      style: true,
      theme: true,
      score: true,
      markdown: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    items: items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
  });
}
