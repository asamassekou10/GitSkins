import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    monthly: Boolean(process.env.STRIPE_PRICE_PRO_MONTHLY),
    annual: Boolean(process.env.STRIPE_PRICE_PRO_ANNUAL),
    lifetime: Boolean(process.env.STRIPE_PRICE_PRO_LIFETIME),
    credits50: Boolean(process.env.STRIPE_PRICE_CREDITS_50),
    credits150: Boolean(process.env.STRIPE_PRICE_CREDITS_150),
  });
}
