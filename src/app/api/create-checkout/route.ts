/**
 * Stripe Checkout API Route
 *
 * Creates a Stripe Checkout session for Pro upgrades and credit packs.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

// Initialize Stripe (only if key is available)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' })
  : null;

// Price mapping
const PRICES: Record<string, { amount: number; name: string; type: 'pro' | 'credits'; credits?: number }> = {
  pro_lifetime: {
    amount: 2900, // $29.00 in cents
    name: 'GitSkins Pro - Lifetime',
    type: 'pro',
  },
  'credits-50': {
    amount: 500, // $5.00 in cents
    name: '50 README Credits',
    type: 'credits',
    credits: 50,
  },
  'credits-150': {
    amount: 1200, // $12.00 in cents
    name: '150 README Credits',
    type: 'credits',
    credits: 150,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    if (!priceId || !PRICES[priceId]) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // If Stripe is not configured, return a mock success for development
    if (!stripe) {
      console.log('Stripe not configured - returning mock checkout URL');
      // In development, simulate a successful purchase
      const successUrl = new URL('/pricing', request.url);
      successUrl.searchParams.set('success', 'true');
      successUrl.searchParams.set('mock', 'true');
      successUrl.searchParams.set('product', priceId);

      return NextResponse.json({
        url: successUrl.toString(),
        mock: true,
      });
    }

    const price = PRICES[priceId];
    const origin = request.headers.get('origin') || 'https://gitskins.com';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: price.name,
              description: price.type === 'pro'
                ? 'Lifetime access to all Pro features'
                : `${price.credits} README generation credits`,
            },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        priceId,
        type: price.type,
        credits: price.credits?.toString() || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
