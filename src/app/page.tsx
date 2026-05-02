'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/components/AnalyticsProvider';
import { HeroSection } from '@/components/landing/HeroSection';
import { ThemeShowcase } from '@/components/landing/ThemeShowcase';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/landing/AnimatedSection';
import { ShareMenu } from '@/components/ShareMenu';
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

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Live README Agent',
    description: 'Watch AI think, draft, critique, and refine your README in real-time with live streaming.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2 6 5 7.5V20h6v-2.5c3-1.5 5-4.1 5-7.5a8 8 0 0 0-8-8z" />
        <path d="M10 22h4" />
      </svg>
    ),
    title: 'Smart AI Agent',
    description: 'Multi-pass generate-critique-refine loop produces career-tailored, high-quality output.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: 'Profile Intelligence',
    description: 'Deep insights and benchmarks powered by real-world industry data.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" y1="15" x2="9" y2="15" />
      </svg>
    ),
    title: '20 Themes',
    description: 'From minimal to bold, find the perfect style for your profile.',
  },
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
  const [copied, setCopied] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState(widgets[0]);
  const [activeAvatarStyle, setActiveAvatarStyle] = useState<(typeof avatarStyles)[number]['id']>('open-peeps');

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    analytics.trackThemeSelection(theme, 'landing', username);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gitskins.com';

  const copyToClipboard = async (widget: typeof widgets[0]) => {
    try {
      const url = buildWidgetUrl(baseUrl, widget, username, selectedTheme);
      const markdown = `![${widget.name}](${url})`;
      await navigator.clipboard.writeText(markdown);
      setCopied(widget.id);
      setTimeout(() => setCopied(null), 2000);
      analytics.trackMarkdownCopy(widget.id, selectedTheme, username, 'landing');
    } catch {
      // Fallback handled silently
    }
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
                  Live preview studio
                </div>
                <h2 style={{ fontSize: 'clamp(30px, 4.8vw, 56px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 900, margin: 0, maxWidth: 680 }}>
                  Show visitors the product before asking them to sign up.
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
                Avatar generator
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4.8vw, 56px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 900, margin: '0 0 18px' }}>
                Give developers a profile picture that matches the brand.
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
                Product system
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4.8vw, 56px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 900, margin: 0, maxWidth: 760 }}>
                Everything needed to turn a GitHub profile into a premium landing page.
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

        {/* Features Section */}
        <section
          style={{
            padding: '100px 24px',
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
                }}
              >
                Everything your profile needs
              </h2>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '560px', margin: '0 auto' }}>
                Streaming AI agent, smart multi-pass thinking, 20 themes, dynamic widgets, GitHub Wrapped, repo visualizer, daily dev cards, and more.
              </p>
            </AnimatedSection>

            <StaggerContainer
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
              }}
            >
              {features.map((feature) => (
                <StaggerItem key={feature.title}>
                  <motion.div
                    whileHover={{
                      y: -4,
                      borderColor: '#2a2a2a',
                      boxShadow: '0 8px 30px rgba(34, 197, 94, 0.08)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: '28px',
                      background: '#0a0a0a',
                      border: '1px solid #161616',
                      borderRadius: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        color: '#22c55e',
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, margin: 0 }}>
                      {feature.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* AI Section */}
        <section
          id="ai"
          style={{
            padding: '100px 24px',
            background: '#0a0a0a',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <AnimatedSection style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 700,
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                AI-Powered Features
              </h2>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                Seven AI-powered tools that analyze your GitHub profile, generate READMEs, and build your portfolio.
              </p>
            </AnimatedSection>

            <StaggerContainer
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                {
                  title: 'Live README Agent',
                  description: 'Watch AI think, draft, critique, and refine your README with live streaming.',
                  href: '/readme-agent',
                  featured: true,
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  ),
                },
                {
                  title: 'README Generator',
                  description: 'Generate a complete, professional README in seconds.',
                  href: '/readme-generator',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  ),
                },
                {
                  title: 'Profile Intelligence',
                  description: 'Search-grounded insights and recommendations for your profile.',
                  href: '/ai',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  ),
                },
                {
                  title: 'Portfolio Website Builder',
                  description: 'Build a full portfolio website with AI chat editing & download.',
                  href: `/portfolio/${username}/build`,
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  ),
                },
                {
                  title: 'GitHub Wrapped',
                  description: 'Spotify-style year in review with AI analysis and industry benchmarks.',
                  href: '/wrapped',
                  featured: true,
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ),
                },
                {
                  title: 'Repo Visualizer',
                  description: 'AI-generated architecture diagrams and Mermaid visualizations.',
                  href: '/visualize',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="4" cy="6" r="2" />
                      <circle cx="20" cy="6" r="2" />
                      <circle cx="4" cy="18" r="2" />
                      <circle cx="20" cy="18" r="2" />
                      <path d="M6 7l4.5 3.5M14 9.5L18 7M6 17l4.5-3.5M14 14.5L18 17" />
                    </svg>
                  ),
                },
                {
                  title: 'Daily Dev Card',
                  description: 'Shareable #BuildInPublic card with AI summaries and 20 themes.',
                  href: '/daily',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                },
              ].map((card) => (
                <StaggerItem key={card.title}>
                  <motion.div
                    whileHover={{
                      borderColor: '#22c55e',
                      y: -2,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%' }}
                  >
                    <Link
                      href={card.href}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '24px',
                        background: card.featured ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)' : '#111',
                        border: card.featured ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid #1a1a1a',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#fafafa',
                        transition: 'all 0.2s ease',
                        boxShadow: card.featured ? '0 0 30px rgba(34, 197, 94, 0.15)' : 'none',
                        height: '100%',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: card.featured ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#22c55e',
                          flexShrink: 0,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                            {card.title}
                          </h3>
                          {card.featured && (
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '2px 6px',
                              background: '#22c55e',
                              color: '#000',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                            }}>
                              New
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.5 }}>
                          {card.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
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

        {/* Widget Generator Section */}
        <section
          id="create"
          style={{
            padding: '100px 24px',
            background: '#0a0a0a',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <AnimatedSection style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 700,
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                Create Your Widgets
              </h2>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                Preview and copy markdown for your GitHub profile.
              </p>
            </AnimatedSection>

            {/* Controls */}
            <AnimatedSection delay={0.1}>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '40px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="GitHub username"
                  style={{
                    padding: '12px 18px',
                    fontSize: '15px',
                    background: '#111',
                    border: '1px solid #1f1f1f',
                    borderRadius: '10px',
                    color: '#fafafa',
                    width: '200px',
                    outline: 'none',
                  }}
                />
                <select
                  value={selectedTheme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  style={{
                    padding: '12px 18px',
                    fontSize: '15px',
                    background: '#111',
                    border: '1px solid #1f1f1f',
                    borderRadius: '10px',
                    color: '#fafafa',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </AnimatedSection>

            {/* Widget Grid */}
            <StaggerContainer
              staggerDelay={0.1}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              {widgets.map((widget) => (
                <StaggerItem key={widget.id}>
                  <motion.div
                    whileHover={{
                      borderColor: '#2a2a2a',
                      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.06)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: '#111',
                      borderRadius: '14px',
                      border: '1px solid #1a1a1a',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Widget Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderBottom: '1px solid #1a1a1a',
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, marginBottom: '2px' }}>
                          {widget.name}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                          {widget.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <ShareMenu
                          shareUrl={`${baseUrl}/showcase/${username}?theme=${selectedTheme}`}
                          shareText={`Check out my GitHub ${widget.name} widget — generated with GitSkins`}
                          imageUrl={buildWidgetUrl(baseUrl, widget, username, selectedTheme)}
                          downloadFilename={`gitskins-${widget.id}-${username}.png`}
                          context={{ username, theme: selectedTheme, widget: widget.id, source: 'landing' }}
                        />
                        <button
                          onClick={() => copyToClipboard(widget)}
                          style={{
                            padding: '8px 14px',
                            fontSize: '13px',
                            fontWeight: 600,
                            background: copied === widget.id ? '#16a34a' : '#22c55e',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#050505',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {copied === widget.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Widget Preview */}
                    <div style={{ padding: '16px', background: '#0a0a0a' }}>
                      <img
                        key={`${widget.id}-${username}-${selectedTheme}`}
                        src={buildWidgetUrl('', widget, username, selectedTheme)}
                        alt={`${widget.name} preview`}
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                      />
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Quick Start Section */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <AnimatedSection style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 700,
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                Quick Start
              </h2>
            </AnimatedSection>

            <StaggerContainer staggerDelay={0.12} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { step: '1', title: 'Choose a widget', description: 'Profile card, stats, languages, or streak.' },
                { step: '2', title: 'Select a theme', description: 'Pick from 20 carefully crafted themes.' },
                { step: '3', title: 'Copy the markdown', description: 'Paste it into your README.md file.' },
              ].map((item) => (
                <StaggerItem key={item.step}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
                      padding: '20px 24px',
                      background: '#0a0a0a',
                      borderRadius: '12px',
                      border: '1px solid #161616',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#050505',
                        flexShrink: 0,
                      }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, marginBottom: '2px' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <BenefitsSection />

        {/* CTA Section */}
        <AnimatedSection>
          <section
            style={{
              padding: '120px 24px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated green blob */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 1) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 700,
                  color: '#fafafa',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                }}
              >
                Your GitHub profile is your resume. Make it count.
              </h2>
              <p
                style={{
                  fontSize: '18px',
                  color: '#a1a1a1',
                  marginBottom: '40px',
                  lineHeight: 1.6,
                }}
              >
                Join thousands of developers who use GitSkins to stand out.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Link
                    href="/auth"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 32px',
                      fontSize: '16px',
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
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#22c55e';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Get Started Free →
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Link
                    href="#themes"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 32px',
                      fontSize: '16px',
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
                    View Themes
                  </Link>
                </motion.div>
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
