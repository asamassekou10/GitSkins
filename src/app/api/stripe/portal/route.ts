/**
 * POST /api/stripe/portal
 *
 * Creates a Stripe Customer Portal session so users can manage
 * or cancel their subscription themselves.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { getStripeCustomerId } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const user = session.user as { username?: string };
  if (!user.username) {
    return NextResponse.json({ error: 'No GitHub username in session' }, { status: 400 });
  }

  const stripeCustomerId = await getStripeCustomerId(user.username);
  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: 'No billing account found. Please upgrade first.' },
      { status: 404 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://gitskins.com';

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${baseUrl}/dashboard`,
  });

  return NextResponse.json({ url: portalSession.url });
}
