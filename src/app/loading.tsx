/**
 * Loading skeleton for landing page
 * Provides better UX while content loads
 */

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hero Section Skeleton */}
      <section
        style={{
          position: 'relative',
          padding: '100px 20px 80px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            textAlign: 'center',
          }}
        >
          {/* Logo Skeleton */}
          <div
            style={{
              height: '80px',
              width: '300px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              margin: '0 auto 16px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />

          {/* Description Skeleton */}
          <div
            style={{
              height: '24px',
              width: '600px',
              maxWidth: '90%',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              margin: '0 auto 48px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />

          {/* Preview Card Skeleton */}
          <div
            style={{
              background: '#161616',
              borderRadius: '20px',
              border: '1px solid #2a2a2a',
              padding: '32px',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                aspectRatio: '800/600',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #ff4500',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
