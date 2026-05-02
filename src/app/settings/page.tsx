'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useUserPlan } from '@/hooks/useUserPlan';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const usage = useUserPlan();
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? 'Unable to open billing portal');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open billing portal');
      setPortalLoading(false);
    }
  }

  if (status === 'loading' || usage.loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#050505', display: 'grid', placeItems: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #22c55e', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', display: 'grid', placeItems: 'center', padding: 24 }}>
        <section style={{ maxWidth: 520, textAlign: 'center', border: '1px solid #1d1d1d', borderRadius: 26, background: '#0b0b0b', padding: 34 }}>
          <h1 style={{ margin: '0 0 12px', fontSize: 38, letterSpacing: '-0.05em' }}>Sign in to manage GitSkins.</h1>
          <p style={{ color: '#888', lineHeight: 1.6, margin: '0 0 24px' }}>Settings are available after you create or sign into your account.</p>
          <Link href="/auth?callbackUrl=/settings" style={primaryButton}>Sign in</Link>
        </section>
      </main>
    );
  }

  const user = session.user as { name?: string | null; email?: string | null; username?: string | null };

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '126px 24px 88px' }}>
        <div style={{ marginBottom: 34 }}>
          <div style={{ display: 'inline-flex', padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 18 }}>
            Account
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(40px, 6vw, 68px)', lineHeight: 0.95, letterSpacing: '-0.06em' }}>Settings</h1>
          <p style={{ margin: 0, maxWidth: 620, color: '#9b9b9b', fontSize: 17, lineHeight: 1.65 }}>
            Manage your plan, billing portal, credits, and support paths from one place.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: 16 }}>
          <section style={cardStyle}>
            <h2 style={cardTitle}>Profile</h2>
            <dl style={{ margin: 0, display: 'grid', gap: 12 }}>
              <Info label="Name" value={user.name ?? 'Not set'} />
              <Info label="Email" value={user.email ?? 'Not set'} />
              <Info label="GitHub" value={user.username ? `@${user.username}` : 'Not connected'} />
            </dl>
          </section>

          <section style={cardStyle}>
            <h2 style={cardTitle}>Plan</h2>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.05em', marginBottom: 8 }}>
              {usage.plan === 'pro' ? 'Pro' : 'Free'}
            </div>
            <p style={{ color: '#888', lineHeight: 1.55, margin: '0 0 18px', fontSize: 14 }}>
              {usage.plan === 'pro'
                ? 'You have access to premium themes, avatars, AI tools, and unlimited README generations.'
                : 'Upgrade when you need premium themes, avatars, AI tools, and unlimited README generations.'}
            </p>
            {usage.plan === 'pro' ? (
              <button type="button" onClick={openPortal} disabled={portalLoading} style={primaryButton}>
                {portalLoading ? 'Opening...' : 'Manage billing'}
              </button>
            ) : (
              <Link href="/pricing" style={primaryButton}>View pricing</Link>
            )}
            {error ? <p style={{ margin: '12px 0 0', color: '#ef4444', fontSize: 13 }}>{error}</p> : null}
          </section>

          <section style={cardStyle}>
            <h2 style={cardTitle}>Usage</h2>
            <dl style={{ margin: 0, display: 'grid', gap: 12 }}>
              <Info label="README remaining" value={usage.plan === 'pro' ? 'Unlimited' : String(usage.readmeGenerationsRemaining)} />
              <Info label="Monthly free limit" value={usage.plan === 'pro' ? 'Unlimited' : String(usage.readmeGenerationsLimit)} />
              <Info label="Credit balance" value={String(usage.creditsRemaining ?? 0)} />
            </dl>
          </section>
        </div>

        <section style={{ ...cardStyle, marginTop: 16 }}>
          <h2 style={cardTitle}>Support and account requests</h2>
          <p style={{ color: '#888', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 660 }}>
            For account deletion, billing questions, or data export requests, email support from the address tied to your account. This keeps destructive account changes out of accidental clicks.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a href="mailto:gitskinspro@gmail.com?subject=GitSkins account request" style={secondaryButton}>Email support</a>
            <Link href="/support" style={secondaryButton}>Support center</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: '#666', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</dt>
      <dd style={{ margin: '5px 0 0', color: '#f5f5f5', fontSize: 15 }}>{value}</dd>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: '1px solid #1d1d1d',
  borderRadius: 24,
  background: '#0b0b0b',
  padding: 24,
};

const cardTitle: CSSProperties = {
  margin: '0 0 18px',
  fontSize: 20,
  letterSpacing: '-0.035em',
};

const primaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
  padding: '12px 16px',
  borderRadius: 999,
  border: 'none',
  background: '#22c55e',
  color: '#041007',
  fontSize: 14,
  fontWeight: 900,
  textDecoration: 'none',
  cursor: 'pointer',
};

const secondaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
  padding: '12px 16px',
  borderRadius: 999,
  border: '1px solid #2a2a2a',
  background: '#111',
  color: '#f5f5f5',
  fontSize: 14,
  fontWeight: 850,
  textDecoration: 'none',
};
