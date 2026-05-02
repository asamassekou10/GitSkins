'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const previewUsername = 'octocat';
const previewTheme = 'github-dark';

function callbackUrl() {
  if (typeof window === 'undefined') return '/dashboard';
  return new URLSearchParams(window.location.search).get('callbackUrl') || '/dashboard';
}

export default function AuthPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  async function handleOAuth(provider: 'github' | 'google') {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: callbackUrl() });
    } catch {
      setLoadingProvider(null);
    }
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoadingProvider('email');
    setEmailError('');
    try {
      const res = await signIn('resend', { email, redirect: false, callbackUrl: callbackUrl() });
      if (res?.error) {
        setEmailError('Could not send your sign-in link. Please try again.');
        setLoadingProvider(null);
      } else {
        setEmailSent(true);
        setLoadingProvider(null);
      }
    } catch {
      setEmailError('Something went wrong. Please try again.');
      setLoadingProvider(null);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-background" />
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: '-20% -10% auto auto', width: 720, height: 720, borderRadius: 999, background: 'radial-gradient(circle, rgba(34,197,94,0.75), transparent 68%)', filter: 'blur(28px)', pointerEvents: 'none' }}
      />

      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 42, alignItems: 'center', maxWidth: 1180, margin: '0 auto', padding: '108px 24px 72px' }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
        >
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', fontWeight: 900, fontSize: 20 }}>
            <img src="/logo-mark.png" alt="" width={30} height={30} style={{ width: 30, height: 30, borderRadius: 9, objectFit: 'cover', boxShadow: '0 0 22px rgba(34,197,94,0.25)' }} />
            GitSkins
          </Link>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 20 }}>
              Developer identity suite
            </div>
            <h1 style={{ margin: 0, maxWidth: 610, fontSize: 'clamp(42px, 6vw, 76px)', lineHeight: 0.94, letterSpacing: '-0.06em', fontWeight: 900 }}>
              Start building a GitHub profile that looks intentional.
            </h1>
            <p style={{ margin: '22px 0 0', maxWidth: 540, color: '#9b9b9b', fontSize: 18, lineHeight: 1.65 }}>
              Sign in to save your kit, unlock your dashboard, and generate cards, avatars, README assets, and Pro profile tools from one workspace.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, maxWidth: 560 }}>
            {[
              ['Cards', 'README-ready profile visuals'],
              ['Avatars', 'Theme-matched identity'],
              ['AI Tools', 'Sharper profile content'],
            ].map(([title, copy]) => (
              <div key={title} style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.035)', border: '1px solid #1d1d1d' }}>
                <div style={{ color: '#fff', fontWeight: 850, fontSize: 14, marginBottom: 5 }}>{title}</div>
                <div style={{ color: '#666', fontSize: 12, lineHeight: 1.45 }}>{copy}</div>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', minHeight: 285, maxWidth: 620 }}>
            <motion.img
              src={`/api/premium-card?username=${previewUsername}&theme=${previewTheme}&variant=glass&avatar=persona`}
              alt="GitSkins profile card preview"
              animate={{ y: [0, -8, 0], rotate: [-0.8, 0.6, -0.8] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '100%', borderRadius: 18, display: 'block', boxShadow: '0 32px 90px rgba(0,0,0,0.52)' }}
            />
            <motion.img
              src={`/api/avatar?username=${previewUsername}&theme=${previewTheme}&family=dicebear&dicebearStyle=open-peeps&size=400`}
              alt="GitSkins avatar preview"
              animate={{ y: [0, 10, 0], rotate: [3, -2, 3] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', right: 18, bottom: -20, width: 132, height: 132, borderRadius: 30, border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 24px 70px rgba(0,0,0,0.5)' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          style={{ width: '100%', maxWidth: 460, justifySelf: 'center' }}
        >
          <div style={{ background: 'linear-gradient(180deg, rgba(18,18,18,0.94), rgba(10,10,10,0.96))', backdropFilter: 'blur(20px)', borderRadius: 28, border: '1px solid #242424', padding: 'clamp(26px, 5vw, 42px)', boxShadow: '0 30px 100px rgba(0,0,0,0.45)' }}>
            {emailSent ? (
              <div>
                <div style={{ width: 54, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)', color: '#22c55e', marginBottom: 18 }}>
                  <MailIcon />
                </div>
                <h2 style={{ fontSize: 28, lineHeight: 1, fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
                  Check your inbox.
                </h2>
                <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7, margin: 0 }}>
                  We sent a secure sign-in link to <strong style={{ color: '#e5e5e5' }}>{email}</strong>. Open it to continue into GitSkins.
                </p>
                <button
                  onClick={() => { setEmailSent(false); setEmail(''); }}
                  style={{ marginTop: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid #242424', borderRadius: 12, color: '#fafafa', fontSize: 14, fontWeight: 750, cursor: 'pointer', padding: '12px 14px' }}
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 30, lineHeight: 1, fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.04em' }}>
                    Create your profile kit
                  </h2>
                  <p style={{ fontSize: 15, color: '#888', lineHeight: 1.6, margin: 0 }}>
                    Use GitHub for the fastest setup, or sign in with Google or email.
                  </p>
                </div>

                <OAuthButton
                  onClick={() => handleOAuth('github')}
                  loading={loadingProvider === 'github'}
                  icon={<GitHubIcon />}
                  label="Continue with GitHub"
                  bg="#fff"
                  color="#000"
                  hoverBg="#e8e8e8"
                />

                <div style={{ margin: '12px 0' }} />

                <OAuthButton
                  onClick={() => handleOAuth('google')}
                  loading={loadingProvider === 'google'}
                  icon={<GoogleIcon />}
                  label="Continue with Google"
                  bg="#151515"
                  color="#fff"
                  hoverBg="#202020"
                  border="1px solid #2a2a2a"
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '26px 0' }}>
                  <div style={{ flex: 1, height: 1, background: '#242424' }} />
                  <span style={{ fontSize: 12, color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7 }}>Magic link</span>
                  <div style={{ flex: 1, height: 1, background: '#242424' }} />
                </div>

                <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{ width: '100%', padding: '15px 16px', background: '#101010', border: '1px solid #2a2a2a', borderRadius: 13, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
                  />
                  <button
                    type="submit"
                    disabled={loadingProvider === 'email' || !email}
                    style={{ width: '100%', padding: '15px 22px', background: loadingProvider === 'email' ? '#16a34a' : '#22c55e', border: 'none', borderRadius: 13, color: '#031007', fontSize: 15, fontWeight: 850, cursor: loadingProvider === 'email' || !email ? 'not-allowed' : 'pointer', opacity: !email ? 0.55 : 1 }}
                  >
                    {loadingProvider === 'email' ? 'Sending secure link...' : 'Send secure sign-in link'}
                  </button>
                  {emailError && <p style={{ fontSize: 13, color: '#ef4444', margin: 0 }}>{emailError}</p>}
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 22 }}>
                  <Link href="/cards" style={{ padding: '12px 13px', borderRadius: 12, border: '1px solid #242424', color: '#aaa', textDecoration: 'none', fontSize: 13, fontWeight: 750, textAlign: 'center' }}>
                    Preview cards
                  </Link>
                  <Link href="/pricing" style={{ padding: '12px 13px', borderRadius: 12, border: '1px solid rgba(34,197,94,0.35)', color: '#4ade80', textDecoration: 'none', fontSize: 13, fontWeight: 750, textAlign: 'center' }}>
                    See Pro
                  </Link>
                </div>

                <p style={{ margin: '24px 0 0', fontSize: 12, color: '#555', lineHeight: 1.55 }}>
                  By signing in, you agree to our <Link href="/terms" style={{ color: '#22c55e', textDecoration: 'none' }}>Terms</Link> and <Link href="/privacy" style={{ color: '#22c55e', textDecoration: 'none' }}>Privacy Policy</Link>.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function OAuthButton({
  onClick,
  loading,
  icon,
  label,
  bg,
  color,
  hoverBg,
  border,
}: {
  onClick: () => void;
  loading: boolean;
  icon: React.ReactNode;
  label: string;
  bg: string;
  color: string;
  hoverBg: string;
  border?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{ width: '100%', padding: '15px 22px', background: loading ? hoverBg : bg, border: border ?? 'none', borderRadius: 13, color, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: loading ? 0.72 : 1, boxSizing: 'border-box' }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = hoverBg; }}
      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = bg; }}
    >
      {loading ? <span style={{ width: 18, height: 18, border: `2px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }} /> : icon}
      {loading ? 'Signing in...' : label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
