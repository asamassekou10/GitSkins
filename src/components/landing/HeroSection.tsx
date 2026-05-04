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

function cardUrl(username: string, theme: string) {
  return `/api/premium-card?username=${encodeURIComponent(username)}&theme=${theme}&variant=glass&avatar=persona&avatarFallback=v2`;
}

function avatarUrl(username: string, theme: string, style = 'open-peeps') {
  return `/api/avatar?username=${encodeURIComponent(username)}&theme=${theme}&family=dicebear&dicebearStyle=${style}&size=400`;
}

export function HeroSection({ username, selectedTheme, onUsernameChange, onThemeChange }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState(username);
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.25, 0.1, 0.25, 1] as const;

  function previewUsername() {
    const next = inputValue.trim().replace(/^@/, '');
    if (!next) return;
    onUsernameChange(next);
    analytics.trackConversion('landing_view', { action: 'hero_preview', username: next });
    document.getElementById('live-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        padding: '140px 24px 88px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="grid-background" />
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: [0.35, 0.65, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '0 auto auto 50%',
          transform: 'translateX(-50%)',
          width: 'min(1200px, 95vw)',
          height: 620,
          background: 'radial-gradient(ellipse at top, rgba(34,197,94,0.16), rgba(45,212,191,0.08) 34%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1220,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: 42,
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 800, letterSpacing: 0.4, marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: '#22c55e', boxShadow: '0 0 18px #22c55e', display: 'inline-flex' }} />
            Developer identity suite
          </div>

          <h1
            style={{
              fontSize: 'clamp(44px, 6.8vw, 82px)',
              lineHeight: 0.93,
              letterSpacing: '-0.06em',
              fontWeight: 900,
              color: '#fff',
              margin: '0 0 22px',
              maxWidth: 650,
            }}
          >
            Give your GitHub the polish of a product launch.
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: 'clamp(17px, 2vw, 20px)', lineHeight: 1.65, margin: '0 0 30px', maxWidth: 570 }}>
            GitSkins turns your profile into a complete developer brand: cinematic README cards, theme-matched avatars, AI profile tools, and copy-ready embeds.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}>
            <Link
              href="/auth"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '15px 24px', borderRadius: 12, background: '#22c55e', color: '#031007', textDecoration: 'none', fontSize: 15, fontWeight: 850, boxShadow: '0 14px 38px rgba(34,197,94,0.28)' }}
            >
              Create your GitSkin
              <span>→</span>
            </Link>
            <Link
              href="/pricing"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '15px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#f5f5f5', border: '1px solid #242424', textDecoration: 'none', fontSize: 15, fontWeight: 750 }}
            >
              See Pro plans
            </Link>
          </div>

          <div style={{ padding: 8, borderRadius: 16, background: 'rgba(255,255,255,0.045)', border: '1px solid #202020', display: 'flex', gap: 8, maxWidth: 480 }}>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && previewUsername()}
              placeholder="GitHub username"
              style={{ flex: 1, minWidth: 0, background: '#0c0c0c', border: '1px solid #1d1d1d', borderRadius: 11, color: '#fff', padding: '12px 14px', fontSize: 15, outline: 'none' }}
            />
            <button
              onClick={previewUsername}
              style={{ border: 0, borderRadius: 11, background: '#f5f5f5', color: '#050505', padding: '0 16px', fontWeight: 850, cursor: 'pointer' }}
            >
              Preview
            </button>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 28 }}>
            {[
              ['20+', 'themes'],
              ['15+', 'avatar styles'],
              ['4', 'premium cards'],
              ['AI', 'profile tools'],
            ].map(([value, label]) => (
              <div key={label}>
                <div style={{ color: '#fff', fontSize: 24, fontWeight: 900 }}>{value}</div>
                <div style={{ color: '#666', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9 }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: 28, scale: 0.97 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          style={{ position: 'relative', minHeight: 560 }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -10, 0], rotate: [-1.2, -0.4, -1.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: 8, top: 28, width: '86%', borderRadius: 24, overflow: 'hidden', boxShadow: '0 34px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,197,94,0.18)' }}
          >
            <img src={cardUrl(username, selectedTheme)} alt="GitSkins premium profile card" style={{ width: '100%', display: 'block' }} />
          </motion.div>

          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 12, 0], rotate: [2.5, 1.4, 2.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', right: 0, top: 250, width: '58%', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(88,166,255,0.22)' }}
          >
            <img src={`/api/stats?username=${encodeURIComponent(username)}&theme=${selectedTheme}`} alt="GitSkins stats card" style={{ width: '100%', display: 'block' }} />
          </motion.div>

          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -14, 0], rotate: [-3, -1.8, -3] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: 30, bottom: 0, width: 156, height: 156, borderRadius: 36, padding: 8, background: 'linear-gradient(135deg, rgba(34,197,94,0.24), rgba(255,255,255,0.06))', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 70px rgba(0,0,0,0.48)' }}
          >
            <img src={avatarUrl(username, selectedTheme, 'open-peeps')} alt="Theme-matched avatar" style={{ width: '100%', height: '100%', borderRadius: 28, display: 'block' }} />
          </motion.div>

          <div style={{ position: 'absolute', right: 36, bottom: 36, padding: '13px 16px', borderRadius: 16, background: 'rgba(5,5,5,0.78)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', color: '#d4d4d4', fontSize: 13, lineHeight: 1.5, maxWidth: 230 }}>
            <strong style={{ color: '#fff' }}>Live assets, not mockups.</strong><br />
            Every preview is generated by GitSkins APIs.
          </div>

          <div style={{ position: 'absolute', top: 0, right: 58, display: 'flex', gap: 8 }}>
            {['github-dark', 'matrix', 'dracula'].map((theme) => (
              <button
                key={theme}
                onClick={() => onThemeChange(theme)}
                aria-label={`Use ${theme}`}
                style={{ width: 28, height: 28, borderRadius: 999, border: selectedTheme === theme ? '2px solid #fff' : '1px solid rgba(255,255,255,0.18)', background: theme === 'matrix' ? '#22c55e' : theme === 'dracula' ? '#bd93f9' : '#58a6ff', cursor: 'pointer', boxShadow: selectedTheme === theme ? '0 0 20px rgba(255,255,255,0.25)' : 'none' }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
