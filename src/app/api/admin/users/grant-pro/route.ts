import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/admin';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: body.data.userId },
    select: { id: true, email: true, username: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await db.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan: 'pro',
      status: 'active',
      stripeCurrentPeriodEnd: null,
    },
    create: {
      userId: user.id,
      plan: 'pro',
      status: 'active',
      stripeCurrentPeriodEnd: null,
    },
  });

  return NextResponse.json({
    success: true,
    message: `Granted Pro to ${user.email ?? user.username ?? user.id}`,
  });
}
