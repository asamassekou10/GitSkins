'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/landing/Navigation';

export default function WrappedEntryPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    const trimmed = username.trim();
    if (trimmed) {
      router.push(`/wrapped/${trimmed}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <Navigation />

      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1200,
          height: 600,
          background: 'radial-gradient(ellipse at top, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 600,
          margin: '0 auto',
          padding: '160px 24px 80px',
          textAlign: 'center',
        }}
      >
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

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            margin: 0,
            marginBottom: 16,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          <span style={{ display: 'block' }}>GitHub</span>
          <span
            className="gradient-text-animated"
            style={{ display: 'block' }}
          >
            Wrapped
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: '#a1a1a1',
            marginBottom: 8,
            lineHeight: 1.7,
          }}
        >
          Your AI-narrated year in code. Gemini 3 analyzes your profile with Extended Thinking
          and compares you against real industry benchmarks.
        </p>
        <p style={{ fontSize: 14, color: '#737373', marginBottom: 48 }}>
          Contributions, languages, streaks, personality, and a full AI narrative.
        </p>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto' }}>
          <input
            type="text"
            placeholder="GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: '#111',
              border: '1px solid #1f1f1f',
              borderRadius: 10,
              color: '#fafafa',
              fontSize: 15,
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; }}
          />
          <button
            onClick={handleSubmit}
            style={{
              padding: '14px 28px',
              background: '#22c55e',
              border: 'none',
              borderRadius: 10,
              color: '#050505',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#4ade80'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#22c55e'; }}
          >
            View Wrapped
          </button>
        </div>

        {/* Preview hint */}
        <div
          style={{
            marginTop: 64,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          {[
            { label: 'Contributions', icon: '{}' },
            { label: 'Languages', icon: '</>' },
            { label: 'Personality', icon: '*' },
            { label: 'AI Narrative', icon: '~' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '16px 8px',
                background: '#111',
                border: '1px solid #1f1f1f',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, color: '#22c55e', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
