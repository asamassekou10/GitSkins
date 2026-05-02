'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { landingThemes } from '@/lib/landing-themes';
import type { AvatarStyle } from '@/lib/avatar-generator';

const STYLES: { id: AvatarStyle; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'nebula',
    label: 'Nebula',
    desc: 'Glowing orbs with depth and specular light',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: 'crystal',
    label: 'Crystal',
    desc: 'Radial diamond grid — dense centre, sparse edges',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="8.5" x2="22" y2="8.5" />
      </svg>
    ),
  },
  {
    id: 'circuit',
    label: 'Circuit',
    desc: 'Symmetric pixel identicon with centre-lit ramp',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="4" height="4" />
        <rect x="10" y="3" width="4" height="4" />
        <rect x="17" y="3" width="4" height="4" />
        <rect x="3" y="10" width="4" height="4" />
        <rect x="17" y="10" width="4" height="4" />
        <rect x="3" y="17" width="4" height="4" />
        <rect x="10" y="17" width="4" height="4" />
        <rect x="17" y="17" width="4" height="4" />
      </svg>
    ),
  },
  {
    id: 'constellation',
    label: 'Constellation',
    desc: 'Star-field map with connected points — personal as a fingerprint',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="18" cy="17" r="1.5" fill="currentColor" stroke="none" />
        <line x1="5" y1="5" x2="19" y2="6" strokeWidth="1" />
        <line x1="5" y1="5" x2="12" y2="14" strokeWidth="1" />
        <line x1="19" y1="6" x2="12" y2="14" strokeWidth="1" />
        <line x1="12" y1="14" x2="6" y2="18" strokeWidth="1" />
        <line x1="12" y1="14" x2="18" y2="17" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'terminal',
    label: 'Terminal',
    desc: 'Code-grid with scanlines — built for developers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <polyline points="8 10 4 14 8 18" />
        <line x1="12" y1="18" x2="20" y2="18" />
      </svg>
    ),
  },
];

function buildAvatarUrl(base: string, username: string, theme: string, style: AvatarStyle) {
  return `${base}/api/avatar?username=${encodeURIComponent(username)}&theme=${encodeURIComponent(theme)}&style=${style}`;
}

export default function AvatarPage() {
  const { data: session } = useSession();
  const user = session?.user as { username?: string; name?: string } | undefined;

  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('github-dark');
  const [style, setStyle] = useState<AvatarStyle>('nebula');
  const [copied, setCopied] = useState<'url' | 'md' | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (user?.username && !username) setUsername(user.username);
  }, [user?.username]);

  const base = typeof window !== 'undefined' ? window.location.origin : 'https://gitskins.com';
  const avatarUrl = buildAvatarUrl(base, username || 'octocat', theme, style);
  const markdownCode = `![GitSkins Avatar](${avatarUrl})`;

  function handleApply() {
    setPreviewKey((k) => k + 1);
  }

  async function copyText(text: string, kind: 'url' | 'md') {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  }

  async function downloadPng() {
    setDownloading(true);
    try {
      const res = await fetch(avatarUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `gitskins-avatar-${username || 'user'}-${theme}-${style}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // silently fail
    } finally {
      setDownloading(false);
    }
  }

  const selectedTheme = landingThemes.find((t) => t.id === theme);

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px clamp(16px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#22c55e', marginBottom: '24px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
            </svg>
            Free for everyone
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px', background: 'linear-gradient(135deg, #fff 0%, #22c55e 60%, #4ade80 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Themed Avatars
          </h1>
          <p style={{ color: '#888', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Generate a unique profile picture that matches your GitSkins theme. Every username produces a different, deterministic design.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(280px, 35%, 340px) 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Username */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
                GitHub Username
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  placeholder="octocat"
                  style={{ flex: 1, background: '#161616', border: '1px solid #222', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '15px', outline: 'none' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#222'; }}
                />
                <button
                  onClick={handleApply}
                  style={{ padding: '10px 16px', background: '#22c55e', border: 'none', borderRadius: '10px', color: '#000', fontWeight: 700, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Style picker */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
                Style
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {STYLES.map((s) => (
                  <motion.button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      background: style === s.id ? 'rgba(34,197,94,0.1)' : '#111',
                      border: `1px solid ${style === s.id ? 'rgba(34,197,94,0.4)' : '#1a1a1a'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ color: style === s.id ? '#22c55e' : '#555', flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: style === s.id ? '#fff' : '#aaa', marginBottom: '2px' }}>{s.label}</div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.4 }}>{s.desc}</div>
                    </div>
                    {style === s.id && (
                      <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Theme picker */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
                Theme — {selectedTheme?.name}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {landingThemes.map((t) => (
                  <motion.button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    title={t.name}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: t.color,
                      border: theme === t.id ? '3px solid #fff' : '2px solid transparent',
                      cursor: 'pointer',
                      outline: theme === t.id ? `2px solid ${t.color}` : 'none',
                      outlineOffset: '2px',
                      boxShadow: theme === t.id ? `0 0 10px ${t.color}60` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Preview + Actions */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Avatar Preview */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ position: 'relative' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${previewKey}-${username}-${theme}-${style}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 40px ${selectedTheme?.color ?? '#22c55e'}30, 0 20px 60px rgba(0,0,0,0.5)` }}
                  >
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      width={280}
                      height={280}
                      style={{ display: 'block', borderRadius: '50%' }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Size comparison chips */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
                {[{ size: 20, label: '20px' }, { size: 36, label: '36px' }, { size: 56, label: '56px' }].map(({ size, label }) => (
                  <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <img
                      src={avatarUrl}
                      alt=""
                      width={size}
                      height={size}
                      style={{ borderRadius: '50%', display: 'block' }}
                    />
                    <span style={{ fontSize: '11px', color: '#555' }}>{label}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', margin: 0 }}>
                Each username produces a unique design. Try different usernames to explore.
              </p>
            </div>

            {/* Actions */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Export & Share</div>

              {/* Download */}
              <motion.button
                onClick={downloadPng}
                disabled={downloading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 20px', background: '#22c55e', border: 'none', borderRadius: '10px', color: '#000', fontSize: '14px', fontWeight: 700, cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.7 : 1 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {downloading ? 'Downloading…' : 'Download PNG'}
              </motion.button>

              {/* Copy URL */}
              <button
                onClick={() => copyText(avatarUrl, 'url')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 20px', background: copied === 'url' ? 'rgba(34,197,94,0.1)' : '#111', border: `1px solid ${copied === 'url' ? 'rgba(34,197,94,0.4)' : '#1a1a1a'}`, borderRadius: '10px', color: copied === 'url' ? '#22c55e' : '#888', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copied === 'url' ? 'Copied!' : 'Copy Image URL'}
              </button>

              {/* Copy Markdown */}
              <button
                onClick={() => copyText(markdownCode, 'md')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 20px', background: copied === 'md' ? 'rgba(34,197,94,0.1)' : '#111', border: `1px solid ${copied === 'md' ? 'rgba(34,197,94,0.4)' : '#1a1a1a'}`, borderRadius: '10px', color: copied === 'md' ? '#22c55e' : '#888', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                {copied === 'md' ? 'Copied!' : 'Copy Markdown'}
              </button>

              {/* URL preview */}
              <div style={{ marginTop: '4px', padding: '10px 12px', background: '#080808', border: '1px solid #111', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#555', wordBreak: 'break-all', lineHeight: 1.5 }}>
                {avatarUrl.replace(base, 'https://gitskins.com')}
              </div>
            </div>

            {/* Usage hint */}
            <div style={{ padding: '16px 20px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', marginBottom: '6px' }}>How to use as a GitHub profile picture</div>
              <ol style={{ color: '#666', fontSize: '13px', lineHeight: 1.7, margin: 0, paddingLeft: '18px' }}>
                <li>Download your PNG above</li>
                <li>Go to <span style={{ color: '#888' }}>github.com → Settings → Profile</span></li>
                <li>Click your avatar → Upload the PNG</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
