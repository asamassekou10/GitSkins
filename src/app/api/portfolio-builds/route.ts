import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getUserPlanById } from '@/lib/server-usage';
import { portfolioGoals, portfolioTemplates, portfolioTones } from '@/lib/portfolio-templates';
import { portfolioBuildPayload } from '@/lib/portfolio-builds';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const saveSchema = z.object({
  username: z.string().min(1).max(39),
  title: z.string().min(1).max(120),
  template: z.enum(portfolioTemplates.map((template) => template.id) as [string, ...string[]]),
  goal: z.enum(portfolioGoals.map((goal) => goal.id) as [string, ...string[]]),
  tone: z.enum(portfolioTones.map((tone) => tone.id) as [string, ...string[]]),
  html: z.string().min(1).max(500_000),
  css: z.string().max(250_000),
});

async function requireProUser() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return {
      userId: null,
      response: NextResponse.json({ error: 'Sign in required', code: 'UNAUTHENTICATED' }, { status: 401 }),
    };
  }

  const plan = await getUserPlanById(userId);
  if (plan !== 'pro') {
    return {
      userId: null,
      response: NextResponse.json({ error: 'Pro plan required. Upgrade at gitskins.com/pricing', code: 'UPGRADE_REQUIRED' }, { status: 403 }),
    };
  }

  return { userId, response: null };
}

export async function GET(request: NextRequest) {
  const { userId, response } = await requireProUser();
  if (response) return response;

  const username = request.nextUrl.searchParams.get('username')?.replace(/^@/, '').trim();

  const builds = await db.portfolioBuild.findMany({
    where: {
      userId,
      ...(username ? { username: { equals: username, mode: 'insensitive' as const } } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
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
    builds: builds.map(portfolioBuildPayload),
  });
}

export async function POST(request: NextRequest) {
  const { userId, response } = await requireProUser();
  if (response) return response;

  const body = saveSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid request', details: body.error.errors }, { status: 400 });
  }

  const build = await db.portfolioBuild.create({
    data: {
      userId,
      username: body.data.username.replace(/^@/, ''),
      title: body.data.title,
      template: body.data.template,
      goal: body.data.goal,
      tone: body.data.tone,
      html: body.data.html,
      css: body.data.css,
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
    build: portfolioBuildPayload(build),
  });
}
