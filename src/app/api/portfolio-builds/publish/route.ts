import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { sanitizePortfolioSlug, portfolioBuildPayload } from '@/lib/portfolio-builds';
import { getUserPlanById } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  buildId: z.string().min(1),
  slug: z.string().min(2).max(64).optional(),
});

async function uniqueSlug(base: string, buildId: string) {
  const fallback = `portfolio-${buildId.slice(0, 8)}`;
  const root = sanitizePortfolioSlug(base) || fallback;

  for (let index = 0; index < 20; index += 1) {
    const slug = index === 0 ? root : `${root}-${index + 1}`;
    const existing = await db.portfolioBuild.findUnique({
      where: { publishedSlug: slug },
      select: { id: true },
    });

    if (!existing || existing.id === buildId) {
      return slug;
    }
  }

  return `${root}-${buildId.slice(0, 8)}`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required', code: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const plan = await getUserPlanById(userId);
  if (plan !== 'pro') {
    return NextResponse.json({ error: 'Pro plan required. Upgrade at gitskins.com/pricing', code: 'UPGRADE_REQUIRED' }, { status: 403 });
  }

  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid request', details: body.error.errors }, { status: 400 });
  }

  const build = await db.portfolioBuild.findFirst({
    where: { id: body.data.buildId, userId },
    select: { id: true, username: true, title: true },
  });

  if (!build) {
    return NextResponse.json({ error: 'Portfolio build not found' }, { status: 404 });
  }

  const slug = await uniqueSlug(body.data.slug ?? build.username, build.id);
  const published = await db.portfolioBuild.update({
    where: { id: build.id },
    data: {
      publishedSlug: slug,
      publishedAt: new Date(),
    },
    select: {
      id: true,
      username: true,
      title: true,
      template: true,
      goal: true,
      tone: true,
      html: true,
      css: true,
      publishedSlug: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    build: portfolioBuildPayload(published),
    url: `/p/${slug}`,
  });
}
