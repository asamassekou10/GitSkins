'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { analytics } from './AnalyticsProvider';

interface ProGateProps {
  feature: string;
  tagline: string;
  benefits: string[];
}

export function ProGate({ feature, tagline, benefits }: ProGateProps) {
  useEffect(() => {
    analytics.track('pro_gate_viewed', { feature });
  }, [feature]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Lock icon */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '28px',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center', maxWidth: '520px', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-block', padding: '4px 14px',
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)',
          borderRadius: '100px', color: '#22c55e', fontSize: '12px', fontWeight: 700,
          letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '20px',
        }}>
          Pro Feature
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          {feature}
        </h1>
        <p style={{ fontSize: '18px', color: '#666', lineHeight: 1.6 }}>
          {tagline}
        </p>
      </div>

      {/* Benefits */}
      <div style={{
        background: '#0a0a0a', border: '1px solid #1a1a1a',
        borderRadius: '20px', padding: '32px', maxWidth: '420px', width: '100%',
        marginBottom: '32px',
      }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          What you get with Pro
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {benefits.map((b) => (
            <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: '#ccc' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/pricing"
          onClick={() => analytics.trackConversion('pro_gate_upgrade_clicked', { feature })}
          style={{
            padding: '14px 32px', background: '#22c55e', borderRadius: '12px',
            color: '#000', fontSize: '16px', fontWeight: 700, textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#16a34a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#22c55e'; }}
        >
          Upgrade to Pro — $9/mo
        </Link>
        <Link
          href="/dashboard"
          onClick={() => analytics.track('pro_gate_back_clicked', { feature })}
          style={{
            padding: '14px 24px', background: 'transparent',
            border: '1px solid #2a2a2a', borderRadius: '12px',
            color: '#888', fontSize: '15px', fontWeight: 500, textDecoration: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
