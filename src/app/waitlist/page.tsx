'use client';

import { useState } from 'react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to join waitlist');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        color: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Secondary glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-300px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, width: '100%', textAlign: 'center' }}>
        {/* Logo */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 48,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="4" fill="#22c55e" />
            <path d="M7 12h10M12 7v10" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>GitSkins</span>
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 500,
            color: '#22c55e',
            marginBottom: 32,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Powered by Gemini 3 Pro
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(36px, 7vw, 64px)',
            fontWeight: 700,
            margin: 0,
            marginBottom: 20,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
          }}
        >
          <span style={{ display: 'block' }}>Your GitHub,</span>
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #22c55e 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            reimagined.
          </span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 19px)',
            color: '#a1a1a1',
            lineHeight: 1.7,
            marginBottom: 12,
            maxWidth: 480,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          AI-powered profile cards, GitHub Wrapped, daily dev cards,
          repo visualizer, and 20 premium themes. All built on Gemini 3.
        </p>
        <p
          style={{
            fontSize: 14,
            color: '#525252',
            marginBottom: 48,
          }}
        >
          Launching soon. Be the first to get access.
        </p>

        {/* Email form */}
        {status === 'success' ? (
          <div
            style={{
              padding: '20px 24px',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: 14,
              marginBottom: 32,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600, color: '#22c55e', marginBottom: 6 }}>
              You&apos;re on the list!
            </div>
            <div style={{ fontSize: 14, color: '#a1a1a1' }}>
              We&apos;ll notify you as soon as GitSkins launches.
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto' }}>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') { setStatus('idle'); setErrorMsg(''); }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  background: '#111',
                  border: `1px solid ${status === 'error' ? 'rgba(239, 68, 68, 0.5)' : '#1f1f1f'}`,
                  borderRadius: 10,
                  color: '#fafafa',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = status === 'error' ? 'rgba(239, 68, 68, 0.5)' : '#1f1f1f'; }}
              />
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                style={{
                  padding: '14px 24px',
                  background: status === 'loading' ? '#166534' : '#22c55e',
                  border: 'none',
                  borderRadius: 10,
                  color: '#050505',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: status === 'loading' ? 'wait' : 'pointer',
                  transition: 'background 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (status !== 'loading') e.currentTarget.style.background = '#4ade80'; }}
                onMouseLeave={(e) => { if (status !== 'loading') e.currentTarget.style.background = '#22c55e'; }}
              >
                {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
            {errorMsg && (
              <div style={{ fontSize: 13, color: '#ef4444', marginTop: 8 }}>
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 64,
          }}
        >
          {[
            'Profile Cards',
            'GitHub Wrapped',
            'Daily Dev Card',
            'Repo Visualizer',
            'Live README Agent',
            'Portfolio Builder',
            '20 Themes',
          ].map((feature) => (
            <span
              key={feature}
              style={{
                padding: '6px 14px',
                background: '#111',
                border: '1px solid #1f1f1f',
                borderRadius: 100,
                fontSize: 13,
                color: '#666',
                fontWeight: 500,
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Social proof / stats preview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          {[
            { value: '20', label: 'Themes' },
            { value: '7', label: 'AI Tools' },
            { value: 'Gemini 3', label: 'AI Engine' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '16px 12px',
                background: '#0a0a0a',
                border: '1px solid #161616',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: '#525252', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 12,
          color: '#333',
        }}
      >
        2026 GitSkins. Built for the Gemini 3 Hackathon.
      </div>
    </div>
  );
}
