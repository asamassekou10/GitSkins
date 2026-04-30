'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  async function handleOAuth(provider: 'github' | 'google') {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: '/' });
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
      const res = await signIn('resend', { email, redirect: false });
      if (res?.error) {
        setEmailError('Could not send sign-in link. Please try again.');
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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          width: '100%',
        }}
      >
        {/* Aurora Background */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: '32px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            marginBottom: '48px',
            letterSpacing: '-0.5px',
          }}
        >
          GitSkins
        </Link>

        {/* Auth Card */}
        <div
          style={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid #2a2a2a',
            padding: '48px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {emailSent ? (
            /* ── Magic link sent state ── */
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Check your inbox
              </h1>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.7 }}>
                We sent a sign-in link to <strong style={{ color: '#ccc' }}>{email}</strong>.
                Click the link to continue — it expires in 10 minutes.
              </p>
              <button
                onClick={() => { setEmailSent(false); setEmail(''); }}
                style={{ marginTop: '24px', background: 'none', border: 'none', color: '#22c55e', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Welcome to GitSkins
              </h1>
              <p style={{ fontSize: '15px', color: '#888', marginBottom: '32px', lineHeight: 1.6 }}>
                Sign in to create beautiful GitHub profile widgets and AI-powered README files
              </p>

              {/* GitHub */}
              <OAuthButton
                onClick={() => handleOAuth('github')}
                loading={loadingProvider === 'github'}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                }
                label="Continue with GitHub"
                bg="#fff"
                color="#000"
                hoverBg="#f0f0f0"
              />

              <div style={{ margin: '12px 0' }} />

              {/* Google */}
              <OAuthButton
                onClick={() => handleOAuth('google')}
                loading={loadingProvider === 'google'}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                }
                label="Continue with Google"
                bg="#1a1a1a"
                color="#fff"
                hoverBg="#242424"
                border="1px solid #2a2a2a"
              />

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
                <span style={{ fontSize: '13px', color: '#555' }}>or sign in with email</span>
                <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
              </div>

              {/* Email magic link */}
              <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#111',
                    border: '1px solid #2a2a2a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
                />
                <button
                  type="submit"
                  disabled={loadingProvider === 'email' || !email}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: loadingProvider === 'email' ? '#16a34a' : '#22c55e',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#000',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: loadingProvider === 'email' || !email ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    opacity: !email ? 0.6 : 1,
                  }}
                >
                  {loadingProvider === 'email' ? 'Sending link...' : 'Send sign-in link'}
                </button>
                {emailError && (
                  <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }}>{emailError}</p>
                )}
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
                <span style={{ fontSize: '13px', color: '#555' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
              </div>

              {/* Guest */}
              <Link
                href="/readme-generator"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 24px',
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  color: '#888',
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
              >
                Continue as Guest
              </Link>

              {/* Terms */}
              <p style={{ marginTop: '24px', fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
                By signing in, you agree to our{' '}
                <a href="/terms" style={{ color: '#22c55e', textDecoration: 'none' }}>Terms</a>{' '}
                and{' '}
                <a href="/privacy" style={{ color: '#22c55e', textDecoration: 'none' }}>Privacy Policy</a>
              </p>
            </>
          )}
        </div>

        {/* Features */}
        <div style={{ marginTop: '48px', display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '⚡', text: 'AI README Generator' },
            { icon: '🎨', text: 'Beautiful Widgets' },
            { icon: '📊', text: 'GitHub Stats' },
          ].map((f) => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888' }}>
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OAuthButton({
  onClick, loading, icon, label, bg, color, hoverBg, border,
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
      style={{
        width: '100%',
        padding: '14px 24px',
        background: loading ? hoverBg : bg,
        border: border ?? 'none',
        borderRadius: '12px',
        color,
        fontSize: '15px',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: 'all 0.2s',
        opacity: loading ? 0.7 : 1,
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = hoverBg; }}
      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = bg; }}
    >
      {loading ? (
        <span style={{ width: '20px', height: '20px', border: `2px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
      ) : icon}
      {loading ? 'Signing in...' : label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
