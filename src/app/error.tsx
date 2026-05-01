'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '16px',
        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#666', fontSize: '16px', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px' }}>
        {error.message || 'An unexpected error occurred. Our team has been notified.'}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 28px',
            background: '#22c55e',
            border: 'none',
            borderRadius: '10px',
            color: '#000',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: '12px 28px',
            background: 'transparent',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            color: '#888',
            fontSize: '15px',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
