import { NextRequest } from 'next/server';
import { z } from 'zod';
import { adminJson, isAdminUser, requireAdminApi } from '@/lib/admin';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const { admin, response } = await requireAdminApi(request);
  if (response) return response;

  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return adminJson({ error: 'Invalid request body' }, 400);
  }

  const user = await db.user.findUnique({
    where: { id: body.data.userId },
    select: {
      id: true,
      email: true,
      username: true,
      subscription: {
        select: {
          stripeSubscriptionId: true,
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!user) {
    return adminJson({ error: 'User not found' }, 404);
  }

  if (admin?.user.id === user.id || isAdminUser(user)) {
    return adminJson({ error: 'Admin accounts cannot be downgraded from this panel' }, 400);
  }

  if (user.subscription?.stripeSubscriptionId) {
    return adminJson(
      { error: 'This user has a Stripe subscription. Cancel or update it in Stripe first.' },
      400
    );
  }

  await db.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan: 'free',
      status: 'canceled',
      stripeCurrentPeriodEnd: null,
    },
    create: {
      userId: user.id,
      plan: 'free',
      status: 'canceled',
      stripeCurrentPeriodEnd: null,
    },
  });

  return adminJson({
    success: true,
    message: `Revoked Pro for ${user.email ?? user.username ?? user.id}`,
  });
}
