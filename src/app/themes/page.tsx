'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { landingThemes } from '@/lib/landing-themes';

const categories = ['all', 'original', 'seasonal', 'holiday', 'developer', 'aesthetic'] as const;

function themeUrl(themeId: string) {
  return `/api/premium-card?username=octocat&theme=${themeId}&variant=persona&avatar=persona`;
}

export default function ThemesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('all');

  const filteredThemes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return landingThemes.filter((theme) => {
      const matchesCategory = category === 'all' || theme.category === category;
      const matchesQuery = !q || `${theme.name} ${theme.description} ${theme.category}`.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', overflow: 'hidden' }}>
      <section style={{ position: 'relative', padding: '120px 24px 54px', borderBottom: '1px solid #111' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 72% 12%, rgba(34,197,94,0.18), transparent 34%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 18 }}>
            {landingThemes.length} theme systems
          </div>
          <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(42px, 7vw, 86px)', lineHeight: 0.9, letterSpacing: '-0.06em', maxWidth: 880 }}>
            Browse the GitSkins theme universe.
          </h1>
          <p style={{ color: '#a1a1a1', fontSize: 18, lineHeight: 1.7, maxWidth: 700, margin: '0 0 30px' }}>
            Each theme is a complete developer identity system: profile cards, stats, streaks, languages, avatars, README motion, hosted profile skins, and extension previews.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto', gap: 12, alignItems: 'center' }} className="themes-toolbar">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search themes..."
              aria-label="Search themes"
              style={{
                minWidth: 0,
                height: 48,
                borderRadius: 14,
                border: '1px solid #242424',
                background: '#0d0d0d',
                color: '#fafafa',
                padding: '0 16px',
                fontSize: 15,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  style={{
                    height: 42,
                    padding: '0 14px',
                    borderRadius: 999,
                    border: `1px solid ${category === item ? '#22c55e' : '#242424'}`,
                    background: category === item ? 'rgba(34,197,94,0.14)' : '#0d0d0d',
                    color: category === item ? '#4ade80' : '#a1a1a1',
                    fontWeight: 800,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '42px 24px 96px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))', gap: 18 }}>
            {filteredThemes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: Math.min(index * 0.025, 0.25) }}
              >
                <Link
                  href={`/themes/${theme.id}`}
                  style={{
                    minHeight: 410,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 18,
                    borderRadius: 24,
                    background: `radial-gradient(circle at 82% 12%, ${theme.color}24, transparent 34%), #0b0b0b`,
                    border: '1px solid #1f1f1f',
                    color: '#fafafa',
                    textDecoration: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                      <div>
                        <h2 style={{ margin: '0 0 4px', fontSize: 24, letterSpacing: '-0.035em' }}>{theme.name}</h2>
                        <p style={{ margin: 0, color: '#888', fontSize: 13 }}>{theme.description}</p>
                      </div>
                      <span style={{ width: 34, height: 34, borderRadius: 12, background: theme.color, boxShadow: `0 0 32px ${theme.color}55`, flex: '0 0 auto' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      <span style={{ padding: '5px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: '#aaa', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7 }}>{theme.category}</span>
                      <span style={{ padding: '5px 8px', borderRadius: 999, background: theme.free ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: theme.free ? '#4ade80' : '#aaa', fontSize: 11, fontWeight: 800 }}>
                        {theme.free ? 'Free' : 'Pro'}
                      </span>
                    </div>
                  </div>
                  <img
                    src={themeUrl(theme.id)}
                    alt={`${theme.name} GitSkins preview`}
                    loading="lazy"
                    style={{ width: '118%', marginLeft: '-9%', borderRadius: 16, boxShadow: '0 26px 80px rgba(0,0,0,0.45)' }}
                  />
                  <span style={{ color: theme.color, fontSize: 13, fontWeight: 900, marginTop: 16 }}>View theme system →</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredThemes.length === 0 && (
            <div style={{ padding: 42, textAlign: 'center', color: '#777', border: '1px solid #1f1f1f', borderRadius: 22, background: '#0b0b0b' }}>
              No themes found for “{query}”.
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 850px) {
          .themes-toolbar {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
