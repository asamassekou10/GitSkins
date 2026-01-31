'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { analytics } from '@/components/AnalyticsProvider';

interface HeroSectionProps {
  username: string;
  selectedTheme: string;
  onUsernameChange: (username: string) => void;
  onThemeChange: (theme: string) => void;
}

export function HeroSection({ username, onUsernameChange }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState(username);
  const prefersReducedMotion = useReducedMotion();

  const handleTryIt = () => {
    if (inputValue.trim()) {
      onUsernameChange(inputValue.trim());
      analytics.trackConversion('landing_view', { action: 'try_username', username: inputValue.trim() });

      const element = document.getElementById('create');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const ease = [0.25, 0.1, 0.25, 1] as const;

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease },
        };

  return (
    <section
      style={{
        position: 'relative',
        padding: '160px 24px 100px',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Modern grid background */}
      <div className="grid-background" />

      {/* Subtle gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1400px',
          height: '600px',
          background: 'radial-gradient(ellipse at top, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <motion.div
          {...(prefersReducedMotion ? {} : {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.2, ease },
          })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#22c55e',
            marginBottom: '32px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Powered by Gemini 3
        </motion.div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(36px, 7vw, 64px)',
            fontWeight: 700,
            margin: 0,
            marginBottom: '20px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#fafafa',
          }}
        >
          <motion.span
            {...fadeUp(0.4)}
            style={{ display: 'block' }}
          >
            Watch AI think
          </motion.span>
          <motion.span
            {...fadeUp(0.6)}
            className="gradient-text-animated"
            style={{ display: 'block', paddingBottom: '4px' }}
          >
            then build your profile
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.8)}
          style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: '#a1a1a1',
            margin: '0 auto',
            marginBottom: '12px',
            maxWidth: '580px',
            lineHeight: 1.7,
          }}
        >
          Live streaming README agent with Extended Thinking. 20 themes, dynamic widgets,
          portfolio case studies, and Google Search-grounded intelligence. All free.
        </motion.p>
        <motion.p
          {...fadeUp(0.9)}
          style={{
            fontSize: '14px',
            color: '#737373',
            margin: '0 auto 40px',
            maxWidth: '400px',
          }}
        >
          Enter your username → watch Gemini 3 reason and generate.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          {...fadeUp(1.0)}
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '64px',
          }}
        >
          <motion.div
            whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -2 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Link
              href="/readme-agent"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 600,
                background: '#22c55e',
                border: 'none',
                borderRadius: '10px',
                color: '#050505',
                textDecoration: 'none',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4ade80';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#22c55e';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Try Live Agent
            </Link>
          </motion.div>

          <motion.div
            whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -2 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Link
              href="/readme-generator"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 600,
                background: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                color: '#fafafa',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#404040';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Generate README
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Input */}
        <motion.div
          {...fadeUp(1.2)}
          style={{
            maxWidth: '420px',
            margin: '0 auto',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#666',
              marginBottom: '12px',
              fontWeight: 500,
            }}
          >
            Try with your GitHub username
          </p>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTryIt()}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: '#111',
                border: '1px solid #1f1f1f',
                borderRadius: '10px',
                color: '#fafafa',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1f1f1f';
              }}
            />
            <button
              onClick={handleTryIt}
              style={{
                padding: '12px 24px',
                background: '#161616',
                border: '1px solid #1f1f1f',
                borderRadius: '10px',
                color: '#fafafa',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.color = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1f1f1f';
                e.currentTarget.style.color = '#fafafa';
              }}
            >
              Preview
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginTop: '64px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '20', label: 'Themes' },
            { value: 'Live', label: 'Streaming' },
            { value: '3-Pass', label: 'Agent Loop' },
            { value: '100%', label: 'Free' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              {...(prefersReducedMotion ? {} : {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 1.3 + i * 0.1, ease },
              })}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#fafafa',
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                  fontWeight: 500,
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
