'use client';

import { useState } from 'react';
import { analytics } from '@/components/AnalyticsProvider';

interface HeroSectionProps {
  username: string;
  selectedTheme: string;
  onUsernameChange: (username: string) => void;
  onThemeChange: (theme: string) => void;
}

export function HeroSection({ username, selectedTheme, onUsernameChange, onThemeChange }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState(username);

  const handleTryIt = () => {
    if (inputValue.trim()) {
      onUsernameChange(inputValue.trim());
      analytics.trackConversion('landing_view', { action: 'try_username', username: inputValue.trim() });
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        padding: '100px 20px 80px',
        overflow: 'hidden',
      }}
    >
      {/* Gradient orb background */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(255, 69, 0, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <h1
          style={{
            fontSize: 'clamp(48px, 10vw, 80px)',
            fontWeight: 800,
            margin: 0,
            marginBottom: '16px',
            letterSpacing: '-2px',
            background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 50%, #ff8c00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GitSkins
        </h1>

        <p
          style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#888888',
            margin: 0,
            marginBottom: '12px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Beautiful, themed widgets for your GitHub README.
        </p>
        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#666666',
            margin: 0,
            marginBottom: '48px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Stand out with premium profile cards. <strong style={{ color: '#ff4500' }}>100% Free</strong>.
        </p>

        {/* Quick Try Input */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto 48px',
            padding: '0 20px',
          }}
        >
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTryIt()}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: '#161616',
              border: '2px solid #2a2a2a',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          <button
            onClick={handleTryIt}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 69, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Try It
          </button>
        </div>

        {/* Quick Preview */}
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
          <img
            key={`preview-${username}-${selectedTheme}`}
            src={`/api/premium-card?username=${username}&theme=${selectedTheme}`}
            alt="GitSkins Preview"
            loading="eager"
            fetchPriority="high"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>
    </section>
  );
}
