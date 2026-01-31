'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/landing/Navigation';
import { landingThemes } from '@/lib/landing-themes';

export default function ThemeSpecPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyColor = async (hex: string, themeId: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedId(themeId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <Navigation />
      <main style={{ padding: '120px 24px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <Link
          href="/"
          style={{ fontSize: '14px', color: '#666', textDecoration: 'none', marginBottom: '24px', display: 'inline-block' }}
        >
          ← Home
        </Link>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Theme specification
        </h1>
        <p style={{ fontSize: '16px', color: '#a1a1a1', lineHeight: 1.7, marginBottom: '48px' }}>
          All GitSkins themes and their primary (accent) color. Use these values for consistency when building widgets or integrating with your profile. Click a color to copy its hex value.
        </p>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#a1a1a1', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Color palette by theme
          </h2>
          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            {landingThemes.map((theme) => {
              const isCopied = copiedId === theme.id;
              return (
                <div
                  key={theme.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 18px',
                    background: '#111',
                    border: '1px solid #1a1a1a',
                    borderRadius: '12px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => copyColor(theme.color, theme.id)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: theme.color,
                      border: '2px solid transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                    title={`Copy ${theme.color}`}
                    aria-label={`Copy color ${theme.color}`}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{theme.name}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{theme.description}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyColor(theme.color, theme.id)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: isCopied ? '#16a34a' : '#161616',
                      border: '1px solid #1f1f1f',
                      borderRadius: '8px',
                      color: isCopied ? '#fff' : '#a1a1a1',
                      cursor: 'pointer',
                    }}
                  >
                    {isCopied ? 'Copied' : theme.color}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ paddingTop: '24px', borderTop: '1px solid #1a1a1a' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#a1a1a1', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Using themes in widgets
          </h2>
          <p style={{ fontSize: '14px', color: '#a1a1a1', lineHeight: 1.7, marginBottom: '16px' }}>
            Append <code style={{ background: '#111', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>theme=THEME_ID</code> to any widget URL. Example:
          </p>
          <pre
            style={{
              background: '#111',
              border: '1px solid #1a1a1a',
              borderRadius: '10px',
              padding: '16px',
              fontSize: '13px',
              color: '#a1a1a1',
              overflow: 'auto',
            }}
          >
            {`https://gitskins.com/api/premium-card?username=octocat&theme=dracula`}
          </pre>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, marginTop: '24px' }}>
            Theme IDs match the table above (e.g. <code style={{ background: '#111', padding: '2px 4px', borderRadius: '4px' }}>github-dark</code>, <code style={{ background: '#111', padding: '2px 4px', borderRadius: '4px' }}>dracula</code>, <code style={{ background: '#111', padding: '2px 4px', borderRadius: '4px' }}>minimal</code>).
          </p>
        </section>
      </main>
    </div>
  );
}
