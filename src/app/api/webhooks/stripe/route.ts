/**
 * POST /api/webhooks/stripe
 *
 * Receives Stripe webhook events and updates the database accordingly.
 * Signature is verified against STRIPE_WEBHOOK_SECRET on every request.
 *
 * Handled events:
 *   checkout.session.completed  → upgrade user to Pro
 *   customer.subscription.updated → sync status and period end
 *   customer.subscription.deleted → downgrade to Free
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import {
  upgradeToPro,
  updateSubscriptionFromStripe,
  cancelSubscription,
  grantCredits,
} from '@/lib/server-usage';
import { sendPaymentConfirmationEmail } from '@/lib/email';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CREDIT_PACKS = {
  [process.env.STRIPE_PRICE_CREDITS_50 ?? '']: 50,
  [process.env.STRIPE_PRICE_CREDITS_150 ?? '']: 150,
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    const existingEvent = await db.stripeEvent.findUnique({
      where: { id: event.id },
      select: { id: true },
    });
    if (existingEvent) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const username = session.metadata?.username;

        if (!userId && !username) {
          console.error('[webhook] checkout.session.completed missing user metadata');
          break;
        }

        const customerId = typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id ?? '';

        if (session.mode === 'subscription') {
          const subscriptionId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null;

          // Idempotency: skip if this subscription is already active in the DB
          if (subscriptionId) {
            const existing = await db.subscription.findFirst({
              where: { stripeSubscriptionId: subscriptionId, status: 'active' },
              select: { id: true },
            });
            if (existing) {
              console.log('[webhook] Duplicate checkout.session.completed — already active:', subscriptionId);
              break;
            }
          }

          let cancelAt: Date | null = null;
          let priceId = process.env.STRIPE_PRICE_PRO_MONTHLY ?? '';

          if (subscriptionId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            cancelAt = sub.cancel_at ? new Date(sub.cancel_at * 1000) : null;
            priceId = sub.items.data[0]?.price.id ?? priceId;
          }

          await upgradeToPro({
            userId,
            username: username || undefined,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: cancelAt,
          });

          const { email, name } = await getUserInfo(userId, username);
          sendPaymentConfirmationEmail(email, name, 'monthly').catch(() => {});
        } else if (session.mode === 'payment') {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
          const priceId = lineItems.data[0]?.price?.id ?? '';
          const credits = CREDIT_PACKS[priceId] ?? 0;

          if (credits > 0 && userId) {
            await grantCredits({
              userId,
              amount: credits,
              reason: 'stripe_credit_pack',
              stripeSessionId: session.id,
            });
            break;
          }

          await upgradeToPro({
            userId,
            username: username || undefined,
            stripeCustomerId: customerId,
            stripeSubscriptionId: null,
            stripePriceId: priceId || (process.env.STRIPE_PRICE_PRO_LIFETIME ?? ''),
            stripeCurrentPeriodEnd: null,
          });

          const { email, name } = await getUserInfo(userId, username);
          sendPaymentConfirmationEmail(email, name, 'lifetime').catch(() => {});
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await updateSubscriptionFromStripe({
          stripeSubscriptionId: sub.id,
          status: sub.status === 'active' ? 'active' : sub.status,
          stripeCurrentPeriodEnd: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await cancelSubscription(sub.id);
        break;
      }

      default:
        break;
    }

    await db.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    // Return 200 so Stripe doesn't retry
  }

  return NextResponse.json({ received: true });
}

async function getUserInfo(
  userId?: string,
  username?: string
): Promise<{ email: string; name: string }> {
  try {
    const where = userId ? { id: userId } : { username: username! };
    const user = await db.user.findUnique({
      where,
      select: { email: true, name: true, username: true },
    });
    return {
      email: user?.email ?? '',
      name: user?.name ?? user?.username ?? '',
    };
  } catch {
    return { email: '', name: '' };
  }
}
