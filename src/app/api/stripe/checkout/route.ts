/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session and returns the redirect URL.
 * Body: { plan: 'monthly' | 'annual' | 'lifetime' | 'credits-50' | 'credits-150' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { getStripeCustomerIdByUserId } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  plan: z.enum(['monthly', 'annual', 'lifetime', 'credits-50', 'credits-150']),
});

const planConfig = {
  monthly: {
    priceId: () => process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    mode: 'subscription' as const,
  },
  annual: {
    priceId: () => process.env.STRIPE_PRICE_PRO_ANNUAL ?? '',
    mode: 'subscription' as const,
  },
  lifetime: {
    priceId: () => process.env.STRIPE_PRICE_PRO_LIFETIME ?? '',
    mode: 'payment' as const,
  },
  'credits-50': {
    priceId: () => process.env.STRIPE_PRICE_CREDITS_50 ?? '',
    mode: 'payment' as const,
  },
  'credits-150': {
    priceId: () => process.env.STRIPE_PRICE_CREDITS_150 ?? '',
    mode: 'payment' as const,
  },
} as const;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const user = session.user as { id?: string; username?: string; email?: string };
  const userId = user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { plan } = body;
  const selected = planConfig[plan];
  const priceId = selected.priceId();
  const { mode } = selected;

  if (!priceId) {
    return NextResponse.json({ error: `Price not configured for plan: ${plan}` }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://gitskins.com';
  const existingCustomerId = await getStripeCustomerIdByUserId(userId);

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      ...(existingCustomerId
        ? { customer: existingCustomerId }
        : { customer_email: user.email ?? undefined }),
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, username: user.username ?? '' },
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata: { userId, username: user.username ?? '' },
        },
      }),
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('[checkout] Stripe error:', err?.message, err?.type, { priceId, mode });
    return NextResponse.json(
      { error: err?.message ?? 'Failed to create checkout session' },
      { status: err?.statusCode ?? 500 }
    );
  }
}
