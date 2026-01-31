'use client';

import { useState } from 'react';
import Link from 'next/link';
import { analytics } from '@/components/AnalyticsProvider';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { ThemeShowcase } from '@/components/landing/ThemeShowcase';
import { landingThemes } from '@/lib/landing-themes';

const themes = landingThemes;

const widgets = [
  { id: 'card', name: 'Profile Card', path: '/api/premium-card', description: 'Full profile with contribution graph' },
  { id: 'stats', name: 'Stats', path: '/api/stats', description: 'Stars, contributions, repos' },
  { id: 'languages', name: 'Languages', path: '/api/languages', description: 'Top programming languages' },
  { id: 'streak', name: 'Streak', path: '/api/streak', description: 'Current and longest streak' },
];

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: 'Dynamic Widgets',
    description: 'Real-time stats that update automatically with your GitHub activity.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Always Fresh',
    description: 'Smart caching ensures your widgets load fast and stay current.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'AI-Powered',
    description: 'Generate professional READMEs with Gemini AI in seconds.',
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

export default function Home() {
  const [username, setUsername] = useState('octocat');
  const [selectedTheme, setSelectedTheme] = useState('github-dark');
  const [copied, setCopied] = useState<string | null>(null);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    analytics.trackThemeSelection(theme, 'landing', username);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gitskins.com';

  const copyToClipboard = async (widget: typeof widgets[0]) => {
    try {
      const url = `${baseUrl}${widget.path}?username=${username}&theme=${selectedTheme}`;
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
        <Navigation />
        
        <HeroSection
          username={username}
          selectedTheme={selectedTheme}
          onUsernameChange={setUsername}
          onThemeChange={handleThemeChange}
        />

        {/* Features Section */}
        <section
          id="features"
          style={{
            padding: '100px 24px',
            borderTop: '1px solid #111',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 700,
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                All features in one place
              </h2>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '560px', margin: '0 auto' }}>
                Widgets, 20 themes, README generator, portfolio case studies, website builder with AI edit, profile intelligence, and AI chat.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
              }}
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    padding: '28px',
                    background: '#0a0a0a',
                    border: '1px solid #161616',
                    borderRadius: '14px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1f1f1f';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#161616';
                    e.currentTarget.style.transform = 'translateY(0)';
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
                </div>
              ))}
            </div>
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
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
                Let Gemini AI craft the perfect README for your profile.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {[
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
                  description: 'Get insights and recommendations for your profile.',
                  href: '/ai',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  ),
                },
                {
                  title: 'Portfolio Builder',
                  description: 'Auto-generate case studies from your repositories.',
                  href: `/portfolio/${username}`,
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 3h-8l-2 4h12l-2-4z" />
                    </svg>
                  ),
                },
                {
                  title: 'Portfolio Website Builder',
                  description: 'Build a full portfolio website with AI chat editing & download.',
                  href: `/portfolio/${username}/build`,
                  featured: true,
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  ),
                },
              ].map((card) => (
                <Link
                  key={card.title}
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#22c55e';
                    e.currentTarget.style.background = card.featured ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.08) 100%)' : '#121212';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = card.featured ? 'rgba(34, 197, 94, 0.4)' : '#1a1a1a';
                    e.currentTarget.style.background = card.featured ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)' : '#111';
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
              ))}
            </div>
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
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            </div>

            {/* Controls */}
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

            {/* Widget Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  style={{
                    background: '#111',
                    borderRadius: '14px',
                    border: '1px solid #1a1a1a',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#222';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1a1a1a';
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

                  {/* Widget Preview */}
                  <div style={{ padding: '16px', background: '#0a0a0a' }}>
                    <img
                      key={`${widget.id}-${username}-${selectedTheme}`}
                      src={`${widget.path}?username=${username}&theme=${selectedTheme}`}
                      alt={`${widget.name} preview`}
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { step: '1', title: 'Choose a widget', description: 'Profile card, stats, languages, or streak.' },
                { step: '2', title: 'Select a theme', description: 'Pick from 20 carefully crafted themes.' },
                { step: '3', title: 'Copy the markdown', description: 'Paste it into your README.md file.' },
              ].map((item) => (
                <div
                  key={item.step}
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
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
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
                  <Link href="/ai" style={{ fontSize: '14px', color: '#a1a1a1' }}>AI Features</Link>
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
                Made for developers · Powered by Google Gemini
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
