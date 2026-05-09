import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/admin';
import { db } from '@/lib/db';
import { grantCredits } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int().min(1).max(1000),
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

  await grantCredits({
    userId: user.id,
    amount: body.data.amount,
    reason: 'admin_grant',
  });

  return NextResponse.json({
    success: true,
    message: `Granted ${body.data.amount} credits to ${user.email ?? user.username ?? user.id}`,
  });
}
