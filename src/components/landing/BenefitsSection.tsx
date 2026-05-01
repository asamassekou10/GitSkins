'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from './AnimatedSection';
import { AnimatedSection } from './AnimatedSection';

const benefits = [
  {
    title: 'Beautiful Themes',
    description: 'Choose from 20 stunning themes that match your style and personality.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 10 10c0 2.76-2.24 5-5 5s-5-2.24-5-5-2.24-5-5-5S2 9.24 2 12" />
      </svg>
    ),
    accent: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.25)',
    color: '#22c55e',
  },
  {
    title: 'Lightning Fast',
    description: 'Edge-rendered widgets with smart caching — load in under 100ms globally.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    accent: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.25)',
    color: '#fbbf24',
  },
  {
    title: '100% Free',
    description: 'Core widgets, themes, and the README generator — no credit card needed.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    accent: 'rgba(96,165,250,0.12)',
    border: 'rgba(96,165,250,0.25)',
    color: '#60a5fa',
  },
  {
    title: 'One-Line Setup',
    description: 'Copy one line of Markdown. No build step, no config, no dependencies.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    accent: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
    color: '#a78bfa',
  },
  {
    title: 'Live GitHub Data',
    description: 'Stats, streaks, and languages update automatically from your GitHub activity.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    accent: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.25)',
    color: '#22c55e',
  },
  {
    title: 'Global CDN',
    description: 'Hosted on Vercel Edge with worldwide distribution. Always fast, always available.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    accent: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.25)',
    color: '#fbbf24',
  },
];

export function BenefitsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
        borderTop: '1px solid #111',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <AnimatedSection style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              color: '#fafafa',
            }}
          >
            Why developers choose GitSkins
          </h2>
          <p style={{ fontSize: '16px', color: '#666', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything your GitHub profile needs — built for speed, simplicity, and style.
          </p>
        </AnimatedSection>

        <StaggerContainer
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <motion.div
                whileHover={prefersReducedMotion ? undefined : {
                  y: -5,
                  boxShadow: `0 12px 40px ${benefit.accent.replace('0.12', '0.2')}`,
                  borderColor: benefit.border,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #1a1a1a',
                  borderRadius: '16px',
                  padding: '28px',
                  height: '100%',
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: benefit.accent,
                    border: `1px solid ${benefit.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: benefit.color,
                  }}
                >
                  {benefit.icon}
                </div>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#fafafa',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {benefit.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                  {benefit.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
