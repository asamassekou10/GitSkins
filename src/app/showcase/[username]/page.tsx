'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { PremiumThemeName } from '@/types/premium-theme';
import { analytics } from '@/components/AnalyticsProvider';
import { Navigation } from '@/components/landing/Navigation';

const themes: PremiumThemeName[] = [
  'satan', 'neon', 'zen', 'github-dark', 'dracula',
  'winter', 'spring', 'summer', 'autumn',
  'christmas', 'halloween',
  'ocean', 'forest', 'sunset', 'midnight', 'aurora',
  'retro', 'minimal', 'pastel', 'matrix',
];

const themeLabels: Record<PremiumThemeName, string> = {
  'satan': 'Satan',
  'neon': 'Neon',
  'zen': 'Zen',
  'github-dark': 'GitHub Dark',
  'dracula': 'Dracula',
  'winter': 'Winter',
  'spring': 'Spring',
  'summer': 'Summer',
  'autumn': 'Autumn',
  'christmas': 'Christmas',
  'halloween': 'Halloween',
  'ocean': 'Ocean',
  'forest': 'Forest',
  'sunset': 'Sunset',
  'midnight': 'Midnight',
  'aurora': 'Aurora',
  'retro': 'Retro',
  'minimal': 'Minimal',
  'pastel': 'Pastel',
  'matrix': 'Matrix',
};

const accent = '#22c55e';
const accentLight = '#4ade80';
const bgPrimary = '#050505';
const bgCard = '#111111';
const bgElevated = '#161616';
const border = '#2a2a2a';
const textPrimary = '#fafafa';
const textSecondary = '#a1a1a1';
const textMuted = '#737373';

function ShowcaseContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawUsername = params.username as string;
  const username = rawUsername?.startsWith('@') ? rawUsername.slice(1) : (rawUsername || '');
  const initialTheme = (searchParams.get('theme') || 'satan') as PremiumThemeName;

  const [selectedTheme, setSelectedTheme] = useState<PremiumThemeName>(initialTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productionUrl = 'https://gitskins.com';
  const cardUrl = `${baseUrl}/api/premium-card?username=${encodeURIComponent(username)}&theme=${selectedTheme}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCardError(false);
  }, [username, selectedTheme]);

  const copyMarkdown = useCallback(async () => {
    const markdown = `![GitSkins Card](${productionUrl}/api/premium-card?username=${username}&theme=${selectedTheme})`;
    await navigator.clipboard.writeText(markdown);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    analytics.trackMarkdownCopy('premium-card', selectedTheme, username, 'showcase');
  }, [username, selectedTheme]);

  const shareUrl = `${baseUrl}/showcase/${username}?theme=${selectedTheme}`;

  const handleCardError = useCallback(() => {
    setCardError(true);
  }, []);

  const retryCard = useCallback(() => {
    setCardError(false);
    setCardKey((k) => k + 1);
  }, []);

  if (!username) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: bgPrimary,
          color: textPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Missing username</h1>
          <p style={{ color: textSecondary, marginBottom: 24 }}>Use /showcase/yourname or /showcase/octocat</p>
          <Link href="/" style={{ color: accent, fontWeight: 600 }}>Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bgPrimary,
        color: textPrimary,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Navigation />
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1200,
          height: 500,
          background: `radial-gradient(ellipse at top, rgba(34, 197, 94, 0.08) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '100px 24px 64px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              margin: 0,
              marginBottom: 8,
              background: `linear-gradient(135deg, ${textPrimary} 0%, ${accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            GitSkins Showcase
          </h1>
          <p style={{ color: textSecondary, fontSize: 16, margin: 0 }}>
            @{username}
          </p>
        </motion.div>

        {/* Theme selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 32,
          }}
        >
          {themes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => {
                setSelectedTheme(theme);
                analytics.trackThemeSelection(theme, 'showcase', username);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                border: `1px solid ${selectedTheme === theme ? accent : border}`,
                background: selectedTheme === theme ? 'rgba(34, 197, 94, 0.15)' : bgElevated,
                color: selectedTheme === theme ? accent : textSecondary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {themeLabels[theme]}
            </button>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            background: bgCard,
            border: `1px solid ${border}`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 32,
          }}
        >
          {isLoading ? (
            <div
              style={{
                aspectRatio: '800 / 600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
            <div
              className="animate-spin"
              style={{
                width: 40,
                height: 40,
                border: `3px solid ${border}`,
                borderTopColor: accent,
                borderRadius: '50%',
              }}
            />
            </div>
          ) : cardError ? (
            <div
              style={{
                aspectRatio: '800 / 600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                background: bgElevated,
                borderRadius: 12,
                padding: 24,
                textAlign: 'center',
              }}
            >
              <p style={{ color: textSecondary, fontSize: 16, margin: 0 }}>Card could not be loaded.</p>
              <p style={{ color: textMuted, fontSize: 14, margin: 0 }}>
                Check that the username exists. If you run this site, add GITHUB_TOKEN in Vercel (or .env.local).
              </p>
              <button
                type="button"
                onClick={retryCard}
                style={{
                  padding: '10px 20px',
                  background: accent,
                  color: '#050505',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <img
              key={cardKey}
              src={cardUrl}
              alt={`${username}'s GitSkins card`}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 12,
                display: 'block',
              }}
              loading="eager"
              fetchPriority="high"
              onError={handleCardError}
            />
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 40,
          }}
        >
          <button
            type="button"
            onClick={copyMarkdown}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: accent,
              color: '#050505',
              border: 'none',
              borderRadius: 10,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showCopied ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy Markdown
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              analytics.track('share_link_copied', { username, theme: selectedTheme });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: bgElevated,
              color: textPrimary,
              border: `1px solid ${border}`,
              borderRadius: 10,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            Share Link
          </button>
          <Link
            href={`/portfolio/${username}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: bgElevated,
              color: textPrimary,
              border: `1px solid ${border}`,
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            AI Portfolio
          </Link>
          <Link
            href="https://gitskins.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: bgElevated,
              color: textPrimary,
              border: `1px solid ${border}`,
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
            Create Your Own
          </Link>
        </motion.div>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ maxWidth: 560, margin: '0 auto' }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 600, color: textSecondary, marginBottom: 12, textAlign: 'center' }}>
            Use in your README
          </h3>
          <div
            style={{
              background: bgCard,
              border: `1px solid ${border}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <code
              style={{
                fontSize: 13,
                color: accent,
                wordBreak: 'break-all',
                display: 'block',
              }}
            >
              {`![GitSkins Card](${productionUrl}/api/premium-card?username=${username}&theme=${selectedTheme})`}
            </code>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            textAlign: 'center',
            marginTop: 48,
            color: textMuted,
            fontSize: 14,
          }}
        >
          Made with GitSkins —{' '}
          <a href="https://gitskins.com" style={{ color: accent, textDecoration: 'none' }}>
            gitskins.com
          </a>
        </motion.p>
      </div>
    </div>
  );
}

function ShowcaseLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="animate-spin"
        style={{
          width: 40,
          height: 40,
          border: '3px solid #2a2a2a',
          borderTopColor: '#22c55e',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}

export default function ShowcasePage() {
  return (
    <Suspense fallback={<ShowcaseLoading />}>
      <ShowcaseContent />
    </Suspense>
  );
}
