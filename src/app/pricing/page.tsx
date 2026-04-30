'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PLANS, FREE_THEMES, PRO_THEMES } from '@/config/subscription';

const FREE_FEATURES = [
  '5 README generations / month',
  `${FREE_THEMES.length} themes (Satan, Neon, Zen, GitHub Dark, Dracula)`,
  'All 4 profile widgets',
  'GitHub Wrapped',
  'Repo Visualizer',
  'Daily Dev Card',
  'Portfolio Builder',
];

const PRO_MONTHLY_FEATURES = [
  'Unlimited README generations',
  `All ${PRO_THEMES.length} premium themes`,
  'No watermark on widgets',
  'Priority widget rendering',
  'All AI features',
  'Manage or cancel anytime',
];

const PRO_LIFETIME_FEATURES = [
  'Everything in Pro Monthly',
  'Pay once, use forever',
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

  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [loadingLifetime, setLoadingLifetime] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!session?.user;

  async function handleCheckout(plan: 'monthly' | 'lifetime', setLoading: (v: boolean) => void) {
    if (!isLoggedIn) {
      router.push('/auth?callbackUrl=/pricing');
      return;
    }
    setLoading(true);
    setError(null);
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
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          {upgraded && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '100px', color: '#22c55e', fontSize: '14px', fontWeight: 600, marginBottom: '32px' }}>
              <CheckIcon /> You&apos;re now on Pro!
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Simple, honest pricing
          </h1>
          <p style={{ fontSize: '18px', color: '#666', maxWidth: '480px', margin: '0 auto' }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>

          {/* Free Plan */}
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Free</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em' }}>$0</span>
                <span style={{ fontSize: '16px', color: '#666' }}>/ month</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {PLANS.free.description}
              </p>
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
              style={{ display: 'block', padding: '14px 24px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#888', fontSize: '15px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
            >
              {isLoggedIn ? 'Your current plan' : 'Get started free'}
            </Link>
          </div>

          {/* Pro Monthly */}
          <div style={{ background: 'linear-gradient(160deg, #0d1f10 0%, #0a0a0a 100%)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative', boxShadow: '0 0 40px rgba(34,197,94,0.08)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#000', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
              Most popular
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Pro Monthly</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em' }}>$9</span>
                <span style={{ fontSize: '16px', color: '#666' }}>/ month</span>
              </div>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Cancel anytime. Billed monthly.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PRO_MONTHLY_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e5e5e5' }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout('monthly', setLoadingMonthly)}
              disabled={loadingMonthly}
              style={{ padding: '14px 24px', background: loadingMonthly ? '#16a34a' : '#22c55e', border: 'none', borderRadius: '12px', color: '#000', fontSize: '15px', fontWeight: 700, cursor: loadingMonthly ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { if (!loadingMonthly) e.currentTarget.style.background = '#16a34a'; }}
              onMouseLeave={(e) => { if (!loadingMonthly) e.currentTarget.style.background = '#22c55e'; }}
            >
              {loadingMonthly ? 'Redirecting...' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Pro Lifetime */}
          <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Pro Lifetime</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em' }}>$49</span>
                <span style={{ fontSize: '16px', color: '#666' }}>one-time</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Pay once, Pro forever.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PRO_LIFETIME_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#ccc' }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout('lifetime', setLoadingLifetime)}
              disabled={loadingLifetime}
              style={{ padding: '14px 24px', background: 'transparent', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '12px', color: '#22c55e', fontSize: '15px', fontWeight: 600, cursor: loadingLifetime ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { if (!loadingLifetime) { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.6)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)'; }}
            >
              {loadingLifetime ? 'Redirecting...' : 'Buy Lifetime Access'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ textAlign: 'center', color: '#ef4444', marginTop: '24px', fontSize: '14px' }}>
            {error}
          </p>
        )}

        {/* FAQ */}
        <div style={{ marginTop: '80px', maxWidth: '600px', margin: '80px auto 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '40px' }}>
            Common questions
          </h2>
          {[
            {
              q: 'Can I cancel at any time?',
              a: 'Yes — cancel instantly from the customer portal (Dashboard → Manage Subscription). You keep Pro access until the end of the billing period.',
            },
            {
              q: 'What counts as a README generation?',
              a: 'Each time you click Generate in the README Generator or Live README Agent, that counts as one generation. Refreshing or copying the result does not count.',
            },
            {
              q: 'Does the lifetime plan include future themes?',
              a: 'Yes. Any new themes added to GitSkins are automatically available to lifetime Pro users.',
            },
            {
              q: 'What payment methods are accepted?',
              a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay are also available in supported browsers.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ borderBottom: '1px solid #1a1a1a', padding: '24px 0' }}>
              <p style={{ fontWeight: 600, color: '#e5e5e5', marginBottom: '8px', margin: '0 0 8px' }}>{q}</p>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#444', fontSize: '13px', marginTop: '48px' }}>
          Payments handled securely by{' '}
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: '#666', textDecoration: 'none' }}>
            Stripe
          </a>
          . GitSkins never stores your card details.
        </p>
      </div>
    </div>
  );
}
