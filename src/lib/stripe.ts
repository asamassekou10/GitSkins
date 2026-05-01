import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getInstance(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
    _stripe = new Stripe(key, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// Proxy keeps all call sites (stripe.checkout.sessions.create etc.) unchanged
// while deferring instantiation until the first actual API call at runtime.
export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    return (getInstance() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
