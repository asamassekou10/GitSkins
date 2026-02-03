'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch {
      setIsLoading(false);
    }
  };

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
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '12px',
          }}
        >
          Welcome to GitSkins
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#888',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          Sign in to create beautiful GitHub profile widgets and AI-powered README files
        </p>

        {/* GitHub Sign In Button */}
        <button
          onClick={handleGitHubSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#fff',
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            opacity: isLoading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isLoading ? (
            <span
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid #000',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          )}
          {isLoading ? 'Signing in...' : 'Continue with GitHub'}
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '24px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
          <span style={{ fontSize: '13px', color: '#666' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
        </div>

        {/* Guest Option */}
        <Link
          href="/readme-generator"
          style={{
            display: 'block',
            width: '100%',
            padding: '16px 24px',
            background: 'transparent',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            color: '#888',
            fontSize: '15px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3a3a3a';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2a2a2a';
            e.currentTarget.style.color = '#888';
          }}
        >
          Continue as Guest
        </Link>

        {/* Terms */}
        <p
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#666',
            lineHeight: 1.5,
          }}
        >
          By signing in, you agree to our{' '}
          <a href="/terms" style={{ color: '#22c55e', textDecoration: 'none' }}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" style={{ color: '#22c55e', textDecoration: 'none' }}>
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Features List */}
      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { icon: '⚡', text: 'AI README Generator' },
          { icon: '🎨', text: 'Beautiful Widgets' },
          { icon: '📊', text: 'GitHub Stats' },
        ].map((feature, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#888',
            }}
          >
            <span>{feature.icon}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
