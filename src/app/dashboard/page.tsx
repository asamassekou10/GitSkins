'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { useRouter, useSearchParams } from 'next/navigation';
import { PLANS, FREE_THEMES } from '@/config/subscription';

interface UsageSnapshot {
  plan: 'free' | 'pro';
  readmeGenerationsUsed: number;
  readmeGenerationsLimit: number;
  readmeGenerationsRemaining: number;
  month: string;
  dbAvailable: boolean;
}

const WIDGETS = [
  { id: 'stats', label: 'Stats Card', path: '/api/stats' },
  { id: 'languages', label: 'Top Languages', path: '/api/languages' },
  { id: 'streak', label: 'Streak Card', path: '/api/streak' },
  { id: 'card', label: 'Glass Profile', path: '/api/premium-card', params: { variant: 'glass', avatar: 'persona' } },
] as const;

function buildWidgetUrl(baseUrl: string, widget: typeof WIDGETS[number], username: string, theme: string) {
  const params = new URLSearchParams({ username, theme });
  if ('params' in widget) {
    Object.entries(widget.params).forEach(([key, value]) => params.set(key, value));
  }
  return `${baseUrl}${widget.path}?${params.toString()}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      style={{
        padding: '4px 10px', background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : '#2a2a2a'}`,
        borderRadius: '6px', color: copied ? '#22c55e' : '#888',
        fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgrade') === 'success';

  const [portalLoading, setPortalLoading] = useState(false);
  const [creditLoading, setCreditLoading] = useState<'credits-50' | 'credits-150' | null>(null);
  const [usage, setUsage] = useState<UsageSnapshot | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [activeWidget, setActiveWidget] = useState<string>('stats');
  const [onboardingDismissed, setOnboardingDismissed] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth?callbackUrl=/dashboard');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/usage')
      .then((r) => r.json())
      .then((data) => {
        setUsage(data);
        // Show onboarding if user has never generated anything
        const dismissed = localStorage.getItem('gitskins_onboarding_dismissed');
        if (!dismissed && data.readmeGenerationsUsed === 0) {
          setOnboardingDismissed(false);
        }
      })
      .catch(() => setUsage(null))
      .finally(() => setLoadingUsage(false));
  }, [status]);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  async function buyCredits(pack: 'credits-50' | 'credits-150') {
    setCreditLoading(pack);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: pack }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setCreditLoading(null);
    }
  }

  function dismissOnboarding() {
    localStorage.setItem('gitskins_onboarding_dismissed', '1');
    setOnboardingDismissed(true);
  }

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as { name?: string; email?: string; image?: string; username?: string; avatar?: string };
  const avatarUrl = user.avatar || user.image || `https://github.com/${user.username || 'ghost'}.png`;
  const displayName = user.name || user.username || 'User';
  const isPro = usage?.plan === 'pro';
  const remaining = usage?.readmeGenerationsRemaining ?? 0;
  const limit = usage?.readmeGenerationsLimit ?? PLANS.free.limits.readmeGenerations;
  const atLimit = !isPro && remaining === 0;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gitskins.com';
  const widgetTheme = 'zen';
  const activeWidgetConfig = WIDGETS.find(w => w.id === activeWidget) ?? WIDGETS[0];
  const widgetUrl = buildWidgetUrl(baseUrl, activeWidgetConfig, user.username || 'octocat', widgetTheme);
  const embedMarkdown = `![${activeWidgetConfig.label}](${widgetUrl})`;
  const embedHtml = `<img src="${widgetUrl}" alt="${activeWidgetConfig.label}" />`;

  const cardStyle = {
    background: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '24px',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)', color: '#e5e5e5' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 20px 60px' }}
      >

        {/* Upgrade success */}
        {upgraded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '12px', marginBottom: '24px', color: '#22c55e', fontSize: '14px', fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Welcome to Pro! All features are now unlocked.
          </div>
        )}

        {/* Onboarding banner */}
        {!onboardingDismissed && (
          <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(74,222,128,0.05) 100%)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px', padding: '24px', marginBottom: '24px', position: 'relative' }}>
            <button
              onClick={dismissOnboarding}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
              aria-label="Dismiss"
            >
              ×
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '15px' }}>Welcome to GitSkins!</span>
            </div>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6, margin: '0 0 20px' }}>
              You&apos;re set up. Here&apos;s where to start:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { href: '/readme-generator', num: '1', label: 'Generate your README', desc: 'AI-powered, takes 30 seconds' },
                { href: `/showcase/${user.username}`, num: '2', label: 'Copy your widgets', desc: 'Paste into your GitHub profile' },
                { href: '/ai', num: '3', label: 'Explore AI features', desc: 'Profile analysis & more' },
              ].map(({ href, num, label, desc }) => (
                <Link key={href} href={href} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', textDecoration: 'none', transition: 'border-color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{num}</div>
                  <div>
                    <div style={{ color: '#e5e5e5', fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{label}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <section style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at 82% 12%, rgba(34,197,94,0.18), transparent 34%), #0b0b0b', border: '1px solid #1d1d1d', borderRadius: 28, padding: 'clamp(24px, 5vw, 38px)', marginBottom: 24 }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))', gap: 28, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: isPro ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', border: isPro ? '1px solid rgba(34,197,94,0.3)' : '1px solid #242424', color: isPro ? '#4ade80' : '#aaa', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 18 }}>
                {isPro ? 'Pro profile kit' : 'Free profile kit'}
              </div>
              <h1 style={{ fontSize: 'clamp(34px, 5vw, 58px)', lineHeight: 0.96, letterSpacing: '-0.05em', fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>
                Welcome back, {displayName.split(' ')[0]}.
              </h1>
              <p style={{ color: '#9b9b9b', margin: '0 0 24px', fontSize: 16, lineHeight: 1.65, maxWidth: 520 }}>
                This is your GitSkins workspace: build your card, create matching avatars, generate README assets, and manage your Pro access.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/cards" style={{ padding: '12px 16px', background: '#22c55e', color: '#050505', borderRadius: 12, fontWeight: 850, fontSize: 14, textDecoration: 'none' }}>
                  Build a card
                </Link>
                <Link href="/avatar" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #262626', color: '#fafafa', borderRadius: 12, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                  Create avatar
                </Link>
                {!isPro && (
                  <Link href="/pricing" style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 12, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                    Unlock Pro
                  </Link>
                )}
              </div>
            </div>
            <div style={{ position: 'relative', minHeight: 250 }}>
              <img src={buildWidgetUrl('', WIDGETS[3], user.username || 'octocat', widgetTheme)} alt="Your GitSkins profile card" style={{ width: '100%', borderRadius: 16, display: 'block', boxShadow: '0 28px 80px rgba(0,0,0,0.46)' }} />
              <img src={`/api/avatar?username=${encodeURIComponent(user.username || 'octocat')}&theme=${widgetTheme}&family=dicebear&dicebearStyle=open-peeps&size=400`} alt="Your GitSkins avatar" style={{ position: 'absolute', right: 10, bottom: -18, width: 112, height: 112, borderRadius: 26, border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 20px 60px rgba(0,0,0,0.48)' }} />
            </div>
          </div>
        </section>

        {/* Profile Card */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Avatar src={avatarUrl} name={displayName} size={80} shape="circle" ring={isPro} />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', margin: 0 }}>{displayName}</h2>
                {isPro && (
                  <span style={{ padding: '4px 12px', background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(74,222,128,0.2) 100%)', border: '1px solid #22c55e', borderRadius: '20px', color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>PRO</span>
                )}
              </div>
              <p style={{ color: '#888', margin: '4px 0 0', fontSize: '15px' }}>@{user.username}</p>
              <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>{user.email}</p>
            </div>
            <Link href={`/showcase/${user.username}`} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#888', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
            >
              View Showcase
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>

          {/* Subscription */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: 0 }}>Subscription</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <div style={{ display: 'inline-block', padding: '8px 16px', background: isPro ? 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(74,222,128,0.2) 100%)' : 'rgba(255,255,255,0.05)', border: isPro ? '1px solid #22c55e' : '1px solid #2a2a2a', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ color: isPro ? '#22c55e' : '#fff', fontWeight: 600, fontSize: '18px' }}>{isPro ? 'Pro' : 'Free Plan'}</span>
            </div>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 16px' }}>
              {isPro ? 'Unlimited README generations and all 20 themes' : `${FREE_THEMES.length} themes · ${PLANS.free.limits.readmeGenerations} README generations / month`}
            </p>
            {isPro ? (
              <button onClick={openPortal} disabled={portalLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#888', fontSize: '13px', fontWeight: 600, cursor: portalLoading ? 'not-allowed' : 'pointer' }}>
                {portalLoading ? 'Loading...' : 'Manage subscription →'}
              </button>
            ) : (
              <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Upgrade to Pro →
              </Link>
            )}
          </div>

          {/* README Credits */}
          <div style={{ ...cardStyle, border: atLimit ? '1px solid rgba(239,68,68,0.3)' : '1px solid #2a2a2a' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: 0 }}>README Credits</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            {loadingUsage ? (
              <div style={{ color: '#555', fontSize: '14px' }}>Loading...</div>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: atLimit ? '#ef4444' : '#fff' }}>
                    {isPro ? '∞' : remaining}
                  </span>
                  {!isPro && (
                    <span style={{ fontSize: '16px', color: '#888', marginLeft: '8px' }}>/ {limit} remaining</span>
                  )}
                </div>
                {!isPro && (
                  <div style={{ height: '8px', background: '#2a2a2a', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (remaining / limit) * 100)}%`, background: remaining > 2 ? '#22c55e' : '#ef4444', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                )}
                <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
                  {isPro ? 'Unlimited with Pro' : 'Resets on the 1st of next month'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Credit top-up for free users at or near limit */}
        {!isPro && !loadingUsage && remaining <= 2 && (
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '15px' }}>
                {remaining === 0 ? 'You\'ve hit your monthly limit' : `Only ${remaining} generation${remaining === 1 ? '' : 's'} left`}
              </span>
            </div>
            <p style={{ color: '#888', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
              Upgrade to Pro for unlimited generations, or buy a one-time credit pack to top up without a subscription.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/pricing" style={{ padding: '10px 20px', background: '#22c55e', borderRadius: '8px', color: '#000', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                Upgrade to Pro — $9/mo
              </Link>
              <button
                onClick={() => buyCredits('credits-50')}
                disabled={creditLoading !== null}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '8px', color: '#22c55e', fontSize: '14px', fontWeight: 600, cursor: creditLoading ? 'not-allowed' : 'pointer' }}
              >
                {creditLoading === 'credits-50' ? 'Redirecting...' : 'Buy 50 credits — $5'}
              </button>
              <button
                onClick={() => buyCredits('credits-150')}
                disabled={creditLoading !== null}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#888', fontSize: '14px', fontWeight: 500, cursor: creditLoading ? 'not-allowed' : 'pointer' }}
              >
                {creditLoading === 'credits-150' ? 'Redirecting...' : 'Buy 150 credits — $12'}
              </button>
            </div>
          </div>
        )}

        {/* Widget Embed Codes */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>Your Widgets</h3>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Copy these into your GitHub profile README</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {WIDGETS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActiveWidget(w.id)}
                  style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                    background: activeWidget === w.id ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                    color: activeWidget === w.id ? '#22c55e' : '#888',
                    outline: activeWidget === w.id ? '1px solid rgba(34,197,94,0.4)' : '1px solid transparent',
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px' }}>
            {user.username ? (
              <img src={widgetUrl} alt="Widget preview" style={{ maxWidth: '100%', borderRadius: '6px' }} />
            ) : (
              <span style={{ color: '#555', fontSize: '13px' }}>Sign in with GitHub to preview your widget</span>
            )}
          </div>

          {/* Embed codes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#555', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Markdown</span>
                <CopyButton text={embedMarkdown} />
              </div>
              <code style={{ display: 'block', color: '#22c55e', fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: 1.5 }}>
                {embedMarkdown}
              </code>
            </div>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#555', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>HTML</span>
                <CopyButton text={embedHtml} />
              </div>
              <code style={{ display: 'block', color: '#a78bfa', fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: 1.5 }}>
                {embedHtml}
              </code>
            </div>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#555', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Direct URL</span>
                <CopyButton text={widgetUrl} />
              </div>
              <code style={{ display: 'block', color: '#60a5fa', fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: 1.5 }}>
                {widgetUrl}
              </code>
            </div>
          </div>
        </div>

        {/* Theme Access */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: 0 }}>Theme Access</h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{isPro ? '20' : FREE_THEMES.length}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>themes available</div>
            </div>
            {!isPro && (
              <div style={{ flex: 1, padding: '16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', minWidth: '200px' }}>
                <p style={{ color: '#22c55e', fontSize: '14px', fontWeight: 500, margin: '0 0 8px' }}>
                  Unlock {20 - FREE_THEMES.length} more premium themes
                </p>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                  Upgrade to Pro for all 20 themes including Aurora, Matrix, Ocean, and more.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Your Avatar */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: '0 0 4px' }}>Your GitSkins Avatar</h3>
              <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>A unique profile picture generated from your username and theme.</p>
            </div>
            <Link href="/avatar" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#888', fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
            >
              Customize →
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Preview of 3 styles */}
            {(['orbs', 'geo', 'pixel'] as const).map((style) => (
              <Link key={style} href={`/avatar?username=${user.username}&style=${style}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <img
                  src={`/api/avatar?username=${user.username ?? 'octocat'}&theme=${isPro ? 'midnight' : 'github-dark'}&style=${style}`}
                  alt={`${style} avatar`}
                  width={64}
                  height={64}
                  style={{ borderRadius: '50%', display: 'block', border: '2px solid #1a1a1a', transition: 'border-color 0.15s' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
                />
                <span style={{ fontSize: '11px', color: '#555', textTransform: 'capitalize' }}>{style}</span>
              </Link>
            ))}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 12px', lineHeight: 1.6 }}>
                Use as your GitHub profile picture or embed in your README. 3 styles, 20 themes.
              </p>
              <Link href="/avatar" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Avatar
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: '0 0 20px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { href: '/readme-generator', label: 'Generate README', sub: 'AI-powered profile README', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg> },
              { href: '/readme-agent', label: 'README Agent', sub: 'Streaming AI with thinking', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10" /><circle cx="12" cy="12" r="6" /></svg> },
              { href: `/showcase/${user.username}`, label: 'View Showcase', sub: 'Your public profile widgets', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> },
              { href: '/ai', label: 'AI Features', sub: 'Profile analysis & more', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#fff', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.background = '#1c1c1c'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.background = '#1a1a1a'; }}
              >
                {item.icon}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.label}</div>
                  <div style={{ color: '#666', fontSize: '13px' }}>{item.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
