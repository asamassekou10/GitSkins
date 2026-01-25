/**
 * Stripe Webhook Handler
 *
 * Handles successful payments and updates user subscription status.
 * For now, we rely on client-side localStorage, but this can be
 * extended to use a database for persistent storage.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.log('Stripe webhook not configured');
    return NextResponse.json({ received: true, configured: false });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Payment successful:', {
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
          metadata: session.metadata,
        });

        // In a production app, you would:
        // 1. Look up the user by email or customer ID
        // 2. Update their subscription status in your database
        // 3. Send a confirmation email

        // For now, we log the successful payment
        // The client will handle updating localStorage based on the success URL

        const { type, credits } = session.metadata || {};

        if (type === 'pro') {
          console.log('User upgraded to Pro:', session.customer_details?.email);
          // TODO: Store in database
        } else if (type === 'credits' && credits) {
          console.log(`User purchased ${credits} credits:`, session.customer_details?.email);
          // TODO: Add credits to user account in database
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
