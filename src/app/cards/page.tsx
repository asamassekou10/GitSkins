'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { landingThemes } from '@/lib/landing-themes';
import { isFreeTierTheme } from '@/config/subscription';
import { useUserPlan } from '@/hooks/useUserPlan';

type CardType = {
  id: string;
  label: string;
  desc: string;
  path: string;
  width: number;
  height: number;
};

const CARD_TYPES: CardType[] = [
  {
    id: 'premium-card',
    label: 'Profile Card',
    desc: 'Full profile header with identity, stats, and contribution story.',
    path: '/api/premium-card',
    width: 820,
    height: 420,
  },
  {
    id: 'stats',
    label: 'Stats Card',
    desc: 'Compact contribution and repository stats for README layouts.',
    path: '/api/stats',
    width: 600,
    height: 240,
  },
  {
    id: 'languages',
    label: 'Languages',
    desc: 'Top language breakdown with theme-matched colors.',
    path: '/api/languages',
    width: 450,
    height: 280,
  },
  {
    id: 'streak',
    label: 'Streak',
    desc: 'Current and longest coding streak with a focused visual read.',
    path: '/api/streak',
    width: 600,
    height: 200,
  },
  {
    id: 'animated',
    label: 'Animated Card',
    desc: 'Animated SVG profile card for a more expressive README.',
    path: '/api/card-animated',
    width: 820,
    height: 420,
  },
];

function buildCardUrl(origin: string, path: string, username: string, theme: string) {
  const params = new URLSearchParams({ username: username || 'octocat', theme });
  return `${origin}${path}?${params.toString()}`;
}

export default function CardsPage() {
  const { plan } = useUserPlan();
  const userIsPro = plan === 'pro';
  const [username, setUsername] = useState('octocat');
  const [theme, setTheme] = useState('github-dark');
  const [cardType, setCardType] = useState<CardType>(CARD_TYPES[0]);
  const [copied, setCopied] = useState<'markdown' | 'html' | 'url' | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gitskins.com';
  const cardUrl = useMemo(() => buildCardUrl(origin, cardType.path, username, theme), [cardType.path, origin, theme, username]);
  const publicUrl = cardUrl.replace(origin, 'https://gitskins.com');
  const markdown = `![GitSkins ${cardType.label}](${publicUrl})`;
  const html = `<img src="${publicUrl}" alt="GitSkins ${cardType.label}" width="${cardType.width}" />`;
  const selectedTheme = landingThemes.find((item) => item.id === theme);

  async function copy(text: string, kind: 'markdown' | 'html' | 'url') {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  }

  function goToPricing() {
    window.location.href = '/pricing';
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '108px clamp(16px, 4vw, 28px) 90px' }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.92fr) minmax(320px, 1.08fr)', gap: 34, alignItems: 'start' }}
        >
          <div style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: '#22c55e', fontSize: 12, fontWeight: 750, marginBottom: 18 }}>
                README card builder
              </div>
              <h1 style={{ margin: 0, fontSize: 'clamp(34px, 5vw, 58px)', lineHeight: 0.95, letterSpacing: '-0.045em', fontWeight: 850 }}>
                Build your GitHub cards without editing URLs.
              </h1>
              <p style={{ margin: '18px 0 0', color: '#8a8a8a', fontSize: 17, lineHeight: 1.65, maxWidth: 520 }}>
                Pick a card, choose a theme, preview it live, then copy Markdown or HTML straight into your GitHub profile README.
              </p>
            </div>

            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', color: '#666', fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
                  GitHub Username
                </label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value.trim())}
                  placeholder="octocat"
                  style={{ width: '100%', background: '#151515', border: '1px solid #242424', color: '#fff', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#666', fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
                  Card Type
                </label>
                <div style={{ display: 'grid', gap: 8 }}>
                  {CARD_TYPES.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setCardType(item)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.985 }}
                      style={{
                        textAlign: 'left',
                        border: `1px solid ${cardType.id === item.id ? 'rgba(34,197,94,0.45)' : '#1a1a1a'}`,
                        background: cardType.id === item.id ? 'rgba(34,197,94,0.1)' : '#111',
                        borderRadius: 12,
                        padding: 13,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', color: cardType.id === item.id ? '#fff' : '#aaa', fontSize: 14, fontWeight: 780, marginBottom: 4 }}>
                        <span>{item.label}</span>
                        <span style={{ color: cardType.id === item.id ? '#22c55e' : '#444', fontSize: 11 }}>{item.width}×{item.height}</span>
                      </div>
                      <div style={{ color: '#555', fontSize: 12, lineHeight: 1.45 }}>{item.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#666', fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
                  Theme — {selectedTheme?.name ?? theme}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {landingThemes.map((item) => {
                    const locked = !userIsPro && !isFreeTierTheme(item.id);
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          if (locked) {
                            goToPricing();
                            return;
                          }
                          setTheme(item.id);
                        }}
                        whileHover={{ scale: 1.14 }}
                        whileTap={{ scale: 0.92 }}
                        title={locked ? `${item.name} requires Pro` : item.name}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          border: theme === item.id ? '3px solid #fff' : '2px solid transparent',
                          outline: theme === item.id ? `2px solid ${item.color}` : 'none',
                          outlineOffset: 2,
                          background: item.color,
                          cursor: 'pointer',
                          opacity: locked ? 0.35 : 1,
                          boxShadow: theme === item.id ? `0 0 16px ${item.color}70` : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: 'radial-gradient(circle at top left, rgba(34,197,94,0.1), transparent 32%), #0b0b0b', border: '1px solid #1a1a1a', borderRadius: 22, padding: 18, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ color: '#fff', fontSize: 15, fontWeight: 760 }}>{cardType.label} Preview</div>
                  <div style={{ color: '#555', fontSize: 12, marginTop: 3 }}>{publicUrl}</div>
                </div>
                <a href={cardUrl} target="_blank" rel="noreferrer" style={{ color: '#22c55e', fontSize: 13, fontWeight: 750, textDecoration: 'none' }}>
                  Open image
                </a>
              </div>

              <div style={{ minHeight: 330, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #070707, #101010)', border: '1px solid #171717', borderRadius: 16, padding: 18, overflow: 'auto' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={cardUrl}
                    src={cardUrl}
                    alt={`${cardType.label} preview`}
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.985 }}
                    transition={{ duration: 0.24 }}
                    style={{ width: '100%', maxWidth: cardType.width, height: 'auto', borderRadius: 12, display: 'block' }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {[
              { kind: 'markdown' as const, label: 'Markdown', value: markdown },
              { kind: 'html' as const, label: 'HTML', value: html },
              { kind: 'url' as const, label: 'Image URL', value: publicUrl },
            ].map((block) => (
              <div key={block.kind} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <span style={{ color: '#777', fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0.6 }}>{block.label}</span>
                  <button
                    onClick={() => copy(block.value, block.kind)}
                    style={{ background: copied === block.kind ? 'rgba(34,197,94,0.12)' : '#151515', color: copied === block.kind ? '#22c55e' : '#aaa', border: `1px solid ${copied === block.kind ? 'rgba(34,197,94,0.35)' : '#242424'}`, borderRadius: 999, padding: '7px 11px', fontSize: 12, fontWeight: 750, cursor: 'pointer' }}
                  >
                    {copied === block.kind ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#777', background: '#070707', border: '1px solid #121212', borderRadius: 12, padding: 13, fontSize: 12, lineHeight: 1.55, fontFamily: 'var(--font-mono)' }}>
                  {block.value}
                </pre>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
