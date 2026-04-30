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
} from '@/lib/server-usage';
import { sendPaymentConfirmationEmail } from '@/lib/email';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const username = session.metadata?.username;

        if (!username) {
          console.error('[webhook] checkout.session.completed missing username metadata');
          break;
        }

        const customerId = typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id ?? '';

        if (session.mode === 'subscription') {
          // Monthly subscription — fetch subscription details
          const subscriptionId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null;

          let cancelAt: Date | null = null;
          let priceId = process.env.STRIPE_PRICE_PRO_MONTHLY ?? '';

          if (subscriptionId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            // cancel_at is set only when the subscription is scheduled to end
            cancelAt = sub.cancel_at ? new Date(sub.cancel_at * 1000) : null;
            priceId = sub.items.data[0]?.price.id ?? priceId;
          }

          await upgradeToPro({
            username,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: cancelAt,
          });

          sendPaymentConfirmationEmail(
            await getUserEmail(username),
            username,
            'monthly'
          ).catch(() => {});
        } else if (session.mode === 'payment') {
          // One-time lifetime purchase — no subscription object
          await upgradeToPro({
            username,
            stripeCustomerId: customerId,
            stripeSubscriptionId: null,
            stripePriceId: process.env.STRIPE_PRICE_PRO_LIFETIME ?? '',
            stripeCurrentPeriodEnd: null,
          });

          sendPaymentConfirmationEmail(
            await getUserEmail(username),
            username,
            'lifetime'
          ).catch(() => {});
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
        // Unhandled event — ignore silently
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    // Return 200 so Stripe doesn't retry — log the error for investigation
  }

  return NextResponse.json({ received: true });
}

async function getUserEmail(username: string): Promise<string> {
  try {
    const user = await db.user.findUnique({
      where: { username },
      select: { email: true },
    });
    return user?.email ?? '';
  } catch {
    return '';
  }
}
