import Link from 'next/link';

export default function NotFound() {
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
        background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <div style={{
        display: 'inline-block', padding: '4px 14px',
        background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.35)',
        borderRadius: '100px', color: '#22c55e', fontSize: '12px', fontWeight: 700,
        letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '20px',
      }}>
        404
      </div>

      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>
        Page not found
      </h1>
      <p style={{ color: '#666', fontSize: '16px', maxWidth: '380px', lineHeight: 1.6, marginBottom: '32px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '12px 28px',
            background: '#22c55e',
            borderRadius: '10px',
            color: '#000',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Go home
        </Link>
        <Link
          href="/dashboard"
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
          Dashboard
        </Link>
      </div>
    </div>
  );
}
