'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PLANS, FREE_THEMES, PRO_THEMES } from '@/config/subscription';
import { analytics } from '@/components/AnalyticsProvider';

type BillingCycle = 'monthly' | 'annual';

const FREE_FEATURES = [
  '5 README generations / month',
  `${FREE_THEMES.length} themes (Satan, Neon, Zen, GitHub Dark, Dracula)`,
  'All 4 profile widgets',
  'GitHub Wrapped',
  'Repo Visualizer',
  'Daily Dev Card',
  'Portfolio Builder',
];

const PRO_FEATURES = [
  'Unlimited README generations',
  `All ${PRO_THEMES.length} premium themes`,
  'No watermark on widgets',
  'Priority widget rendering',
  'All AI features (analysis, chat, portfolio)',
  'Cancel or manage anytime',
];

const PRO_LIFETIME_FEATURES = [
  'Everything in Pro — forever',
  'Pay once, never again',
  'All future themes included',
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgrade') === 'success';

  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!session?.user;

  async function handleCheckout(plan: string) {
    if (!isLoggedIn) {
      analytics.trackConversion('pricing_auth_required', { plan });
      router.push('/auth?callbackUrl=/pricing');
      return;
    }
    setLoadingPlan(plan);
    setError(null);
    analytics.trackConversion('checkout_started', { plan, billing });
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoadingPlan(null);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoadingPlan(null);
    }
  }

  const proPrice = billing === 'annual' ? 79 : 9;
  const proPlan = billing === 'annual' ? 'annual' : 'monthly';
  const annualSavings = Math.round(((9 * 12 - 79) / (9 * 12)) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px', position: 'relative' }}>
          {upgraded && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '100px', color: '#22c55e', fontSize: '14px', fontWeight: 600, marginBottom: '32px' }}>
              <CheckIcon /> You&apos;re now on Pro!
            </div>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 20 }}>
            Profile brand pricing
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95, margin: '0 auto 18px', maxWidth: 780 }}>
            Start free. Upgrade when your profile needs the full kit.
          </h1>
          <p style={{ fontSize: '18px', color: '#888', maxWidth: '620px', margin: '0 auto 32px', lineHeight: 1.65 }}>
            Free gives you the essentials. Pro unlocks the premium themes, avatars, AI profile tools, and unlimited README generations that make GitSkins feel like a complete identity system.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '4px' }}>
            {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBilling(cycle)}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  background: billing === cycle ? '#22c55e' : 'transparent',
                  color: billing === cycle ? '#000' : '#666',
                }}
              >
                {cycle === 'monthly' ? 'Monthly' : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Annual
                    <span style={{ padding: '2px 8px', background: billing === 'annual' ? 'rgba(0,0,0,0.2)' : 'rgba(34,197,94,0.15)', borderRadius: '100px', fontSize: '11px', color: billing === 'annual' ? '#000' : '#22c55e', fontWeight: 700 }}>
                      -{annualSavings}%
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Visual proof */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))', gap: '18px', alignItems: 'stretch', marginBottom: '56px' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ minHeight: 320, borderRadius: 24, border: '1px solid #1d1d1d', background: 'radial-gradient(circle at 80% 18%, rgba(34,197,94,0.2), transparent 38%), #0b0b0b', padding: 22, display: 'grid', placeItems: 'center', overflow: 'hidden' }}
          >
            <img src="/api/premium-card?username=octocat&theme=matrix&variant=glass&avatar=persona" alt="Premium GitSkins card preview" style={{ width: '100%', maxWidth: 720, borderRadius: 16, boxShadow: '0 28px 90px rgba(0,0,0,0.48)' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            style={{ borderRadius: 24, border: '1px solid #1d1d1d', background: '#0b0b0b', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}
          >
            <div>
              <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Pro unlocks</div>
              <h2 style={{ margin: '0 0 12px', fontSize: 28, lineHeight: 1, letterSpacing: '-0.035em' }}>The parts people actually notice.</h2>
              <p style={{ color: '#888', lineHeight: 1.6, margin: 0, fontSize: 14 }}>Premium cards, character avatars, advanced themes, AI profile intelligence, and the tools that make everything match.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['open-peeps', 'bottts', 'pixel-art'].map((style) => (
                <img key={style} src={`/api/avatar?username=octocat-${style}&theme=matrix&family=dicebear&dicebearStyle=${style}&size=400`} alt="" style={{ width: 70, height: 70, borderRadius: 18, border: '1px solid rgba(255,255,255,0.12)' }} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start', marginBottom: '64px' }}>

          {/* Free Plan */}
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Free</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em' }}>$0</span>
                <span style={{ fontSize: '16px', color: '#666' }}>/ month</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{PLANS.free.description}</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FREE_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#ccc' }}>
                  <CheckIcon />{f}
                </li>
              ))}
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#555' }}>
                <XIcon />15 premium themes locked
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#555' }}>
                <XIcon />Watermark on widgets
              </li>
            </ul>
            <Link
              href={isLoggedIn ? '/dashboard' : '/auth'}
              style={{ display: 'block', padding: '14px 24px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#888', fontSize: '15px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
            >
              {isLoggedIn ? 'Your current plan' : 'Get started free'}
            </Link>
          </div>

          {/* Pro Plan */}
          <div style={{ background: 'linear-gradient(160deg, #0d1f10 0%, #0a0a0a 100%)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative', boxShadow: '0 0 40px rgba(34,197,94,0.08)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#000', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
              Most popular
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Pro {billing === 'annual' ? '· Annual' : '· Monthly'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {billing === 'annual' ? '$6.58' : '$9'}
                </span>
                <span style={{ fontSize: '16px', color: '#666' }}>/ month</span>
              </div>
              {billing === 'annual' && (
                <p style={{ color: '#22c55e', fontSize: '13px', margin: '0 0 4px', fontWeight: 600 }}>
                  Billed as $79/year — save ${9 * 12 - 79}
                </p>
              )}
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, margin: '4px 0 0' }}>
                {billing === 'annual' ? 'Best value. Billed yearly.' : 'Cancel anytime. Billed monthly.'}
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PRO_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e5e5e5' }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(proPlan)}
              disabled={loadingPlan !== null}
              style={{ padding: '14px 24px', background: loadingPlan === proPlan ? '#16a34a' : '#22c55e', border: 'none', borderRadius: '12px', color: '#000', fontSize: '15px', fontWeight: 700, cursor: loadingPlan ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { if (!loadingPlan) e.currentTarget.style.background = '#16a34a'; }}
              onMouseLeave={(e) => { if (!loadingPlan) e.currentTarget.style.background = '#22c55e'; }}
            >
              {loadingPlan === proPlan ? 'Redirecting...' : `Upgrade to Pro`}
            </button>
          </div>

          {/* Lifetime */}
          <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Pro Lifetime</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em' }}>$49</span>
                <span style={{ fontSize: '16px', color: '#666' }}>one-time</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Pay once, Pro forever.</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PRO_LIFETIME_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#ccc' }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('lifetime')}
              disabled={loadingPlan !== null}
              style={{ padding: '14px 24px', background: 'transparent', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '12px', color: '#22c55e', fontSize: '15px', fontWeight: 600, cursor: loadingPlan ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { if (!loadingPlan) { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.6)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)'; }}
            >
              {loadingPlan === 'lifetime' ? 'Redirecting...' : 'Buy Lifetime Access'}
            </button>
          </div>
        </div>

        {/* Credit Packs */}
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '36px', marginBottom: '64px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>Need more credits?</h2>
            <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
              Top up your README generations without a subscription. Credits never expire.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { pack: 'credits-50', credits: 50, price: 5, highlight: false },
              { pack: 'credits-150', credits: 150, price: 12, highlight: true },
            ].map(({ pack, credits, price, highlight }) => (
              <div
                key={pack}
                style={{
                  background: highlight ? 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 100%)' : '#111',
                  border: `1px solid ${highlight ? 'rgba(34,197,94,0.3)' : '#222'}`,
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{credits}</span>
                    <span style={{ color: '#888', fontSize: '15px' }}>README credits</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    ${(price / credits).toFixed(2)} per generation · never expire
                  </div>
                </div>
                <button
                  onClick={() => handleCheckout(pack)}
                  disabled={loadingPlan !== null}
                  style={{
                    padding: '10px 24px',
                    background: highlight ? '#22c55e' : 'transparent',
                    border: highlight ? 'none' : '1px solid rgba(34,197,94,0.4)',
                    borderRadius: '10px',
                    color: highlight ? '#000' : '#22c55e',
                    fontSize: '14px', fontWeight: 700,
                    cursor: loadingPlan ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {loadingPlan === pack ? 'Redirecting...' : `$${price} — Buy now`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ textAlign: 'center', color: '#ef4444', marginBottom: '24px', fontSize: '14px' }}>{error}</p>
        )}

        {/* FAQ */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '40px' }}>Common questions</h2>
          {[
            { q: 'Can I cancel at any time?', a: 'Yes — cancel instantly from the customer portal (Dashboard → Manage Subscription). You keep Pro access until the end of the billing period.' },
            { q: 'What\'s the difference between monthly and annual?', a: `Annual billing costs $79/year ($6.58/month) vs $9/month — saving you $${9 * 12 - 79} over a year. Same features, better price.` },
            { q: 'What are credits and how do they work?', a: 'Credits are one-time README generation top-ups. Each generation costs 1 credit. Credits never expire and work alongside your monthly plan.' },
            { q: 'What counts as a README generation?', a: 'Each time you click Generate in the README Generator or Live README Agent counts as one. Refreshing or copying does not count.' },
            { q: 'Does the lifetime plan include future themes?', a: 'Yes. Any new themes added to GitSkins are automatically available to lifetime Pro users.' },
            { q: 'What payment methods are accepted?', a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay are available in supported browsers.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ borderBottom: '1px solid #1a1a1a', padding: '24px 0' }}>
              <p style={{ fontWeight: 600, color: '#e5e5e5', margin: '0 0 8px' }}>{q}</p>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#444', fontSize: '13px', marginTop: '48px' }}>
          Payments handled securely by{' '}
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: '#666', textDecoration: 'none' }}>Stripe</a>.
          GitSkins never stores your card details.
        </p>
      </div>
    </div>
  );
}
