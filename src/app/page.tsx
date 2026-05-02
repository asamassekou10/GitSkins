'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/components/AnalyticsProvider';
import { HeroSection } from '@/components/landing/HeroSection';
import { ThemeShowcase } from '@/components/landing/ThemeShowcase';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/landing/AnimatedSection';
import { landingThemes } from '@/lib/landing-themes';

const themes = landingThemes;

const widgets = [
  { id: 'card', name: 'Glass Profile Card', path: '/api/premium-card', description: 'Modern profile card with avatar, languages, stats, and contribution graph', params: { variant: 'glass', avatar: 'persona' } },
  { id: 'stats', name: 'Stats', path: '/api/stats', description: 'Stars, contributions, repos' },
  { id: 'languages', name: 'Languages', path: '/api/languages', description: 'Top programming languages' },
  { id: 'streak', name: 'Streak', path: '/api/streak', description: 'Current and longest streak' },
];

function buildWidgetUrl(baseUrl: string, widget: typeof widgets[number], username: string, theme: string) {
  const params = new URLSearchParams({ username, theme });
  if ('params' in widget && widget.params) {
    Object.entries(widget.params).forEach(([key, value]) => params.set(key, value));
  }
  return `${baseUrl}${widget.path}?${params.toString()}`;
}

const MARQUEE_ITEMS = [
  '20 Themes',
  'Live README Agent',
  'GitHub Wrapped',
  'Profile Intelligence',
  'Avatar Generator',
  'Repo Visualizer',
  'Daily Dev Card',
  'Portfolio Builder',
  'AI Analysis',
  'Free Forever',
];

const avatarStyles = [
  { id: 'open-peeps', label: 'Open Peeps' },
  { id: 'bottts', label: 'Bottts' },
  { id: 'pixel-art', label: 'Pixel Art' },
  { id: 'toon-head', label: 'Toon Head' },
] as const;

const productTiles = [
  {
    title: 'Premium profile cards',
    copy: 'Show identity, languages, activity, stats, and a matching persona avatar in one README-ready card.',
    href: '/cards',
    size: 'large',
  },
  {
    title: 'Theme-matched avatars',
    copy: 'Generate GitHub profile pictures that match your card, theme, and developer persona.',
    href: '/avatar',
    size: 'tall',
  },
  {
    title: 'AI README Agent',
    copy: 'Turn messy repo signal into a sharper README with live streaming and critique/refine loops.',
    href: '/readme-agent',
    size: 'wide',
  },
  {
    title: 'Project Persona',
    copy: 'Analyze your projects and turn your work into a character system.',
    href: '/avatar/persona',
    size: 'small',
  },
  {
    title: 'GitHub Wrapped',
    copy: 'A shareable story of your year in code.',
    href: '/wrapped',
    size: 'small',
  },
] as const;

function buildAvatarUrl(username: string, theme: string, style: string) {
  return `/api/avatar?username=${encodeURIComponent(username)}&theme=${theme}&family=dicebear&dicebearStyle=${style}&size=400`;
}

export default function Home() {
  const [username, setUsername] = useState('octocat');
  const [selectedTheme, setSelectedTheme] = useState('github-dark');
  const [activePreview, setActivePreview] = useState(widgets[0]);
  const [activeAvatarStyle, setActiveAvatarStyle] = useState<(typeof avatarStyles)[number]['id']>('open-peeps');

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    analytics.trackThemeSelection(theme, 'landing', username);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'GitSkins',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            description: 'Generate dynamic, custom-themed widgets for your GitHub profile.',
            url: 'https://gitskins.com',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />

      <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
        <HeroSection
          username={username}
          selectedTheme={selectedTheme}
          onUsernameChange={setUsername}
          onThemeChange={handleThemeChange}
        />

        {/* Marquee Strip */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div
          style={{
            overflow: 'hidden',
            borderTop: '1px solid #111',
            borderBottom: '1px solid #111',
            padding: '14px 0',
            background: '#080808',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0',
              animation: 'marquee 25s linear infinite',
              width: 'max-content',
            }}
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span
                  style={{
                    color: '#444',
                    fontSize: '13px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    padding: '0 16px',
                  }}
                >
                  {item}
                </span>
                <span style={{ color: '#22c55e', fontSize: '10px' }}>•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Live Preview Studio */}
        <section
          id="live-preview"
          style={{
            padding: '110px 24px',
            borderTop: '1px solid #111',
            background: 'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.08), transparent 34%), #050505',
          }}
        >
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            <AnimatedSection style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'end', marginBottom: 34, flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 10 }}>
                  Live product preview
                </div>
                <h2 style={{ fontSize: 'clamp(30px, 4.8vw, 56px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 900, margin: 0, maxWidth: 680 }}>
                  See your GitHub identity come to life.
                </h2>
              </div>
              <Link href="/cards" style={{ color: '#050505', background: '#22c55e', borderRadius: 12, padding: '13px 18px', textDecoration: 'none', fontWeight: 850 }}>
                Open Card Builder
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 22, alignItems: 'stretch' }}>
                <div style={{ background: '#0b0b0b', border: '1px solid #1b1b1b', borderRadius: 22, padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ color: '#666', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>GitHub username</label>
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value.trim())}
                      style={{ width: '100%', background: '#111', border: '1px solid #242424', color: '#fff', borderRadius: 12, padding: '12px 14px', outline: 'none', fontSize: 15 }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#666', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Preview type</label>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {widgets.map((widget) => (
                        <button
                          key={widget.id}
                          onClick={() => setActivePreview(widget)}
                          style={{ textAlign: 'left', padding: 12, borderRadius: 12, border: `1px solid ${activePreview.id === widget.id ? 'rgba(34,197,94,0.46)' : '#1a1a1a'}`, background: activePreview.id === widget.id ? 'rgba(34,197,94,0.1)' : '#101010', color: '#fff', cursor: 'pointer' }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 850 }}>{widget.name}</div>
                          <div style={{ color: '#666', fontSize: 12, marginTop: 3 }}>{widget.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#666', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Theme</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {themes.slice(0, 10).map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          title={theme.name}
                          style={{ width: 28, height: 28, borderRadius: 999, background: theme.color, border: selectedTheme === theme.id ? '3px solid #fff' : '1px solid rgba(255,255,255,0.16)', cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ minHeight: 430, borderRadius: 28, border: '1px solid #1d1d1d', background: 'linear-gradient(135deg, #080808, #101010)', padding: 26, display: 'grid', placeItems: 'center', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 72% 18%, ${themes.find((theme) => theme.id === selectedTheme)?.color ?? '#22c55e'}22, transparent 42%)`, pointerEvents: 'none' }} />
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${activePreview.id}-${username}-${selectedTheme}`}
                      src={buildWidgetUrl('', activePreview, username || 'octocat', selectedTheme)}
                      alt={`${activePreview.name} preview`}
                      initial={{ opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                      transition={{ duration: 0.28 }}
                      style={{ width: '100%', maxWidth: activePreview.id === 'card' ? 780 : 610, height: 'auto', display: 'block', borderRadius: 14, position: 'relative', boxShadow: '0 26px 90px rgba(0,0,0,0.45)' }}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Avatar Showcase */}
        <section style={{ padding: '110px 24px', background: '#080808' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 42, alignItems: 'center' }}>
            <AnimatedSection>
              <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 12 }}>
                Avatar identity system
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4.8vw, 56px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 900, margin: '0 0 18px' }}>
                A profile picture that belongs with the rest of the kit.
              </h2>
              <p style={{ color: '#888', fontSize: 17, lineHeight: 1.7, margin: '0 0 24px' }}>
                Cards get attention. Matching avatars make the profile feel intentional. GitSkins can generate a complete visual system from one GitHub username.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {avatarStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setActiveAvatarStyle(style.id)}
                    style={{ padding: '9px 12px', borderRadius: 999, border: `1px solid ${activeAvatarStyle === style.id ? '#22c55e' : '#242424'}`, background: activeAvatarStyle === style.id ? 'rgba(34,197,94,0.12)' : '#101010', color: activeAvatarStyle === style.id ? '#4ade80' : '#aaa', fontWeight: 750, cursor: 'pointer' }}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.08}>
              <div style={{ position: 'relative', minHeight: 430 }}>
                {[0, 1, 2, 3].map((index) => (
                  <motion.div
                    key={`${activeAvatarStyle}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    style={{ position: 'absolute', left: `${(index % 2) * 46}%`, top: `${Math.floor(index / 2) * 48}%`, width: 180, height: 180, borderRadius: 36, padding: 8, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(34,197,94,0.14))', border: '1px solid rgba(255,255,255,0.13)', boxShadow: '0 24px 80px rgba(0,0,0,0.45)' }}
                  >
                    <img src={buildAvatarUrl(`${username}${index}`, selectedTheme, activeAvatarStyle)} alt="Generated avatar" style={{ width: '100%', height: '100%', borderRadius: 28, display: 'block' }} />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Premium Product Bento */}
        <section id="features" style={{ padding: '110px 24px', background: '#050505', borderTop: '1px solid #111' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <AnimatedSection style={{ marginBottom: 42 }}>
              <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 12 }}>
                Premium toolkit
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4.8vw, 56px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 900, margin: 0, maxWidth: 760 }}>
                Every surface a developer needs to look intentional.
              </h2>
            </AnimatedSection>
            <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 16 }}>
              {productTiles.map((tile, index) => (
                <StaggerItem key={tile.title}>
                  <Link href={tile.href} style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: tile.size === 'large' || tile.size === 'tall' ? 330 : 180, padding: 22, overflow: 'hidden', borderRadius: 22, border: '1px solid #1d1d1d', background: index === 0 ? 'radial-gradient(circle at 85% 12%, rgba(34,197,94,0.22), transparent 42%), #0d0d0d' : '#0b0b0b', textDecoration: 'none', color: '#fff' }}>
                    <div style={{ position: 'absolute', right: -30, bottom: -34, width: 180, height: 180, borderRadius: 999, background: 'rgba(34,197,94,0.08)', pointerEvents: 'none' }} />
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: tile.size === 'large' ? 28 : 18, lineHeight: 1.05, letterSpacing: -0.5 }}>{tile.title}</h3>
                      <p style={{ margin: 0, color: '#777', fontSize: 14, lineHeight: 1.55, maxWidth: 420 }}>{tile.copy}</p>
                    </div>
                    <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 850 }}>Explore →</span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Themes Section */}
        <section id="themes">
          <ThemeShowcase
            themes={themes}
            selectedTheme={selectedTheme}
            onThemeSelect={handleThemeChange}
            username={username}
          />
        </section>

        {/* CTA Section */}
        <AnimatedSection>
          <section
            style={{
              padding: '120px 24px',
              position: 'relative',
              overflow: 'hidden',
              borderTop: '1px solid #111',
              background: 'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.12), transparent 36%), #050505',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.07, 0.14, 0.07] }}
              transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '560px',
                height: '560px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 40, alignItems: 'center' }}>
              <div>
                <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 12 }}>
                  Start free. Upgrade the full identity.
                </div>
                <h2 style={{ fontSize: 'clamp(34px, 5.4vw, 62px)', fontWeight: 900, color: '#fafafa', letterSpacing: '-0.05em', lineHeight: 0.98, margin: '0 0 20px' }}>
                  Make your GitHub feel like a product, not a profile.
                </h2>
                <p style={{ fontSize: 18, color: '#a1a1a1', margin: '0 0 30px', lineHeight: 1.65, maxWidth: 560 }}>
                  Start with free cards and themes. Upgrade when you want premium avatars, AI profile tools, project personas, and the full visual kit.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                    <Link href="/auth" style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 24px', fontSize: 15, fontWeight: 850, background: '#22c55e', borderRadius: 12, color: '#050505', textDecoration: 'none', boxShadow: '0 18px 45px rgba(34,197,94,0.22)' }}>
                      Create free profile kit
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                    <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 24px', fontSize: 15, fontWeight: 850, background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a', borderRadius: 12, color: '#fafafa', textDecoration: 'none' }}>
                      Compare plans
                    </Link>
                  </motion.div>
                </div>
              </div>

              <div style={{ position: 'relative', minHeight: 390 }}>
                <motion.img
                  src={buildWidgetUrl('', widgets[0], username || 'octocat', selectedTheme)}
                  alt="Premium profile card preview"
                  animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
                  transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
                  style={{ width: '100%', maxWidth: 610, borderRadius: 18, boxShadow: '0 32px 100px rgba(0,0,0,0.55)', display: 'block' }}
                />
                <motion.img
                  src={buildAvatarUrl(username || 'octocat', selectedTheme, activeAvatarStyle)}
                  alt="Generated GitSkins avatar"
                  animate={{ y: [0, 12, 0], rotate: [3, -2, 3] }}
                  transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
                  style={{ position: 'absolute', right: 0, bottom: 0, width: 150, height: 150, borderRadius: 32, border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 24px 70px rgba(0,0,0,0.48)' }}
                />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection preset="fadeIn" duration={0.8} as="div">
          <footer
            style={{
              padding: '60px 24px 40px',
              borderTop: '1px solid #111',
            }}
          >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '40px',
                  marginBottom: '48px',
                }}
              >
                {/* Brand */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '18px',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="4" fill="#22c55e" />
                      <path d="M7 12h10M12 7v10" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    GitSkins
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, maxWidth: '200px' }}>
                    Beautiful GitHub profile widgets and AI-powered README generator.
                  </p>
                </div>

                {/* Product */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Product
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a href="#features" style={{ fontSize: '14px', color: '#a1a1a1' }}>Features</a>
                    <a href="#themes" style={{ fontSize: '14px', color: '#a1a1a1' }}>Themes</a>
                    <Link href="/readme-generator" style={{ fontSize: '14px', color: '#a1a1a1' }}>README Generator</Link>
                    <Link href="/readme-agent" style={{ fontSize: '14px', color: '#22c55e' }}>Live Agent</Link>
                    <Link href="/ai" style={{ fontSize: '14px', color: '#a1a1a1' }}>AI Features</Link>
                    <Link href="/wrapped" style={{ fontSize: '14px', color: '#a1a1a1' }}>GitHub Wrapped</Link>
                    <Link href="/avatar" style={{ fontSize: '14px', color: '#a1a1a1' }}>Avatar Generator</Link>
                    <Link href="/visualize" style={{ fontSize: '14px', color: '#a1a1a1' }}>Repo Visualizer</Link>
                    <Link href="/daily" style={{ fontSize: '14px', color: '#a1a1a1' }}>Daily Dev Card</Link>
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Resources
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/getting-started" style={{ fontSize: '14px', color: '#a1a1a1' }}>Getting Started</Link>
                    <Link href="/docs/themes" style={{ fontSize: '14px', color: '#a1a1a1' }}>Theme Spec</Link>
                    <Link href="/support" style={{ fontSize: '14px', color: '#a1a1a1' }}>Support</Link>
                  </div>
                </div>

                {/* Community */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Community
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a href="https://github.com/asamassekou10/GitSkins" target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#a1a1a1' }}>GitHub</a>
                    <a href="https://github.com/asamassekou10/GitSkins/issues" target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#a1a1a1' }}>Request a theme</a>
                  </div>
                </div>

                {/* Legal */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Legal
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/terms" style={{ fontSize: '14px', color: '#a1a1a1' }}>Terms</Link>
                    <Link href="/privacy" style={{ fontSize: '14px', color: '#a1a1a1' }}>Privacy</Link>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div
                style={{
                  paddingTop: '24px',
                  borderTop: '1px solid #111',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <p style={{ fontSize: '13px', color: '#404040', margin: 0 }}>
                  2026 GitSkins. All rights reserved.
                </p>
                <p style={{ fontSize: '13px', color: '#404040', margin: 0 }}>
                  Made for developers, by developers.
                </p>
              </div>
            </div>
          </footer>
        </AnimatedSection>
      </div>
    </>
  );
}
