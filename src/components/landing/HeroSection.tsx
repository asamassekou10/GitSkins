'use client';

import { useState } from 'react';
import { analytics } from '@/components/AnalyticsProvider';
import { AuroraBackground } from './AuroraBackground';
import { DashboardMockup } from './DashboardMockup';

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

  const scrollToCreate = () => {
    const element = document.getElementById('create');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        padding: '140px 20px 80px',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Aurora Background */}
      <AuroraBackground intensity="high" position="top" />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Trust Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '24px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#22c55e',
            marginBottom: '32px',
          }}
        >
          Trusted by 5,000+ developers
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 800,
            margin: 0,
            marginBottom: '8px',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            color: '#fff',
          }}
        >
          Your GitHub Profile
        </h1>
        <h1
          style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 800,
            margin: 0,
            marginBottom: '24px',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          At A Glance
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#888',
            margin: '0 auto',
            marginBottom: '48px',
            maxWidth: '600px',
            lineHeight: 1.6,
          }}
        >
          Generate beautiful, themed widgets for your README. Stats, languages, streaks,
          and contribution graphs. <strong style={{ color: '#fff' }}>100% Free</strong>.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '80px',
          }}
        >
          {/* Primary CTA */}
          <button
            onClick={scrollToCreate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 600,
              background: '#22c55e',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4ade80';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#22c55e';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Create Your Widgets
          </button>

          {/* Secondary CTA */}
          <a
            href="/readme-generator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              color: '#fff',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22c55e';
              e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2a2a2a';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            AI README Generator
          </a>
        </div>

        {/* Dashboard Mockup */}
        <DashboardMockup />

        {/* Quick username input below mockup */}
        <div
          style={{
            marginTop: '60px',
            padding: '0 20px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '16px',
            }}
          >
            Try it with your username
          </p>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              maxWidth: '400px',
              margin: '0 auto',
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
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              onClick={handleTryIt}
              style={{
                padding: '14px 28px',
                background: '#22c55e',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4ade80';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#22c55e';
              }}
            >
              Try It
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
