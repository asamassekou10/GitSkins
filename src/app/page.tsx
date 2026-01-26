'use client';

import { useState } from 'react';
import { analytics } from '@/components/AnalyticsProvider';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsCounter } from '@/components/landing/StatsCounter';
import { SocialProof } from '@/components/landing/SocialProof';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { ThemeShowcase } from '@/components/landing/ThemeShowcase';

const themes = [
  // Original themes
  { id: 'satan', name: 'Satan', color: '#ff4500', description: 'Hellfire aesthetic', category: 'original' },
  { id: 'neon', name: 'Neon', color: '#38bdf8', description: 'Cyberpunk HUD', category: 'original' },
  { id: 'zen', name: 'Zen', color: '#66bb6a', description: 'Japanese garden', category: 'original' },
  { id: 'github-dark', name: 'GitHub Dark', color: '#58a6ff', description: 'Pro standard', category: 'original', free: true },
  { id: 'dracula', name: 'Dracula', color: '#bd93f9', description: 'Coding classic', category: 'original' },
  // Seasonal themes
  { id: 'winter', name: 'Winter', color: '#60a5fa', description: 'Frozen elegance', category: 'seasonal' },
  { id: 'spring', name: 'Spring', color: '#ec4899', description: 'Cherry blossom', category: 'seasonal' },
  { id: 'summer', name: 'Summer', color: '#fbbf24', description: 'Golden hour', category: 'seasonal' },
  { id: 'autumn', name: 'Autumn', color: '#d97706', description: 'Falling leaves', category: 'seasonal' },
  // Holiday themes
  { id: 'christmas', name: 'Christmas', color: '#ef4444', description: 'Festive spirit', category: 'holiday' },
  { id: 'halloween', name: 'Halloween', color: '#f97316', description: 'Spooky night', category: 'holiday' },
  // Developer themes
  { id: 'ocean', name: 'Ocean', color: '#38bdf8', description: 'Deep sea', category: 'developer', free: true },
  { id: 'forest', name: 'Forest', color: '#4ade80', description: 'Woodland', category: 'developer', free: true },
  { id: 'sunset', name: 'Sunset', color: '#e879f9', description: 'Twilight', category: 'developer' },
  { id: 'midnight', name: 'Midnight', color: '#818cf8', description: 'Starry night', category: 'developer', free: true },
  { id: 'aurora', name: 'Aurora', color: '#2dd4bf', description: 'Northern lights', category: 'developer' },
  // Aesthetic themes
  { id: 'retro', name: 'Retro', color: '#ec4899', description: 'Synthwave', category: 'aesthetic' },
  { id: 'minimal', name: 'Minimal', color: '#64748b', description: 'Clean & modern', category: 'aesthetic', free: true },
  { id: 'pastel', name: 'Pastel', color: '#a78bfa', description: 'Soft & friendly', category: 'aesthetic' },
  { id: 'matrix', name: 'Matrix', color: '#22c55e', description: 'Code rain', category: 'aesthetic' },
];

const widgets = [
  { id: 'card', name: 'Profile Card', path: '/api/premium-card', description: 'Full profile with contribution graph' },
  { id: 'stats', name: 'Stats', path: '/api/stats', description: 'Stars, contributions, repos, followers' },
  { id: 'languages', name: 'Languages', path: '/api/languages', description: 'Top 5 programming languages' },
  { id: 'streak', name: 'Streak', path: '/api/streak', description: 'Current streak and total days' },
];

export default function Home() {
  const [username, setUsername] = useState('octocat');
  const [selectedTheme, setSelectedTheme] = useState('satan');
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
      analytics.trackConversion('markdown_copied', { widget_type: widget.id, theme: selectedTheme });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      const url = `${baseUrl}${widget.path}?username=${username}&theme=${selectedTheme}`;
      const markdown = `![${widget.name}](${url})`;
      const textArea = document.createElement('textarea');
      textArea.value = markdown;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(widget.id);
        setTimeout(() => setCopied(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
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
            description: 'Generate dynamic, custom-themed widgets for your GitHub profile. Stats, languages, streaks, and more.',
            url: 'https://gitskins.com',
            author: {
              '@type': 'Organization',
              name: 'GitSkins',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5',
              ratingCount: '1',
            },
            featureList: [
              'GitHub Profile Cards',
              'Contribution Graphs',
              'Language Statistics',
              'Streak Tracking',
              'Multiple Themes',
              'Customizable Widgets',
              'AI README Generator',
            ],
          }),
        }}
      />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <HeroSection
          username={username}
          selectedTheme={selectedTheme}
          onUsernameChange={setUsername}
          onThemeChange={handleThemeChange}
        />

        {/* Stats Counter */}
        <StatsCounter
          stats={[
            { label: 'Cards Generated', value: 12500, suffix: '+' },
            { label: 'Active Users', value: 3200, suffix: '+' },
            { label: 'Themes Available', value: 5 },
            { label: 'Widget Types', value: 6 },
          ]}
        />

        {/* Benefits Section */}
        <section id="features">
          <BenefitsSection />
        </section>

        {/* Theme Showcase */}
        <section id="themes">
          <ThemeShowcase
            themes={themes}
            selectedTheme={selectedTheme}
            onThemeSelect={handleThemeChange}
            username={username}
          />
        </section>

        {/* Social Proof */}
        <SocialProof />

        {/* Generator Section */}
        <section
          id="create"
          style={{
            padding: '80px 20px',
            background: '#0d0d0d',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '40px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '4px',
                  height: '32px',
                  background: '#22c55e',
                  marginRight: '12px',
                  verticalAlign: 'middle',
                  borderRadius: '2px',
                }}
              />
              Create Your Widgets
            </h2>

            {/* Controls */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '48px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {/* Username Input */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <label
                  style={{
                    fontSize: '14px',
                    color: '#888',
                    fontWeight: 500,
                  }}
                >
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="octocat"
                  style={{
                    padding: '14px 20px',
                    fontSize: '16px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#fff',
                    width: '250px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              {/* Theme Selector */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <label
                  style={{
                    fontSize: '14px',
                    color: '#888',
                    fontWeight: 500,
                  }}
                >
                  Theme
                </label>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeChange(theme.id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        background: selectedTheme === theme.id ? theme.color + '20' : '#1a1a1a',
                        border: `1px solid ${selectedTheme === theme.id ? theme.color : '#333'}`,
                        borderRadius: '12px',
                        color: selectedTheme === theme.id ? theme.color : '#888',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
              }}
            >
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  style={{
                    background: '#161616',
                    borderRadius: '16px',
                    border: '1px solid #2a2a2a',
                    padding: '24px',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                >
                  {/* Widget Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          margin: 0,
                          marginBottom: '4px',
                        }}
                      >
                        {widget.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#666',
                          margin: 0,
                        }}
                      >
                        {widget.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(widget)}
                      style={{
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        background: copied === widget.id ? '#238636' : '#22c55e',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {copied === widget.id ? 'Copied!' : 'Copy Markdown'}
                    </button>
                  </div>

                  {/* Widget Preview */}
                  <div
                    style={{
                      background: '#0d0d0d',
                      borderRadius: '12px',
                      padding: '16px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      key={`${widget.id}-${username}-${selectedTheme}`}
                      src={`${widget.path}?username=${username}&theme=${selectedTheme}&_t=${Date.now()}`}
                      alt={`${widget.name} preview`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* URL Preview */}
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#0d0d0d',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {widget.path}?username={username}&theme={selectedTheme}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Usage Section */}
        <section
          style={{
            padding: '80px 20px',
          }}
        >
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '40px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '4px',
                  height: '32px',
                  background: '#22c55e',
                  marginRight: '12px',
                  verticalAlign: 'middle',
                  borderRadius: '2px',
                }}
              />
              Quick Start
            </h2>

            {/* Steps */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {[
                {
                  step: '1',
                  title: 'Choose your widget',
                  description: 'Select from Profile Card, Stats, Languages, or Streak widgets.',
                },
                {
                  step: '2',
                  title: 'Pick a theme',
                  description: 'Satan, Neon, Zen, GitHub Dark, or Dracula - match your style.',
                },
                {
                  step: '3',
                  title: 'Copy the markdown',
                  description: 'Click "Copy Markdown" and paste it into your README.md file.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    padding: '24px',
                    background: '#161616',
                    borderRadius: '16px',
                    border: '1px solid #2a2a2a',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#000',
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        margin: 0,
                        marginBottom: '4px',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#888',
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Code Example */}
            <div
              style={{
                marginTop: '48px',
                padding: '24px',
                background: '#161616',
                borderRadius: '16px',
                border: '1px solid #2a2a2a',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: '#888',
                    fontWeight: 500,
                  }}
                >
                  README.md
                </span>
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27ca40' }} />
                </div>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: '20px',
                  background: '#0d0d0d',
                  borderRadius: '12px',
                  overflow: 'auto',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  lineHeight: 1.6,
                }}
              >
                <code style={{ color: '#888' }}># My GitHub Profile</code>
                {'\n\n'}
                <code style={{ color: '#4ade80' }}>![Profile Card]</code>
                <code style={{ color: '#888' }}>(https://gitskins.com/api/card?username=</code>
                <code style={{ color: '#22c55e' }}>{username}</code>
                <code style={{ color: '#888' }}>&theme=</code>
                <code style={{ color: '#22c55e' }}>{selectedTheme}</code>
                <code style={{ color: '#888' }}>)</code>
                {'\n\n'}
                <code style={{ color: '#888' }}>## Stats</code>
                {'\n\n'}
                <code style={{ color: '#4ade80' }}>![Stats]</code>
                <code style={{ color: '#888' }}>(https://gitskins.com/api/stats?username=</code>
                <code style={{ color: '#22c55e' }}>{username}</code>
                <code style={{ color: '#888' }}>&theme=</code>
                <code style={{ color: '#22c55e' }}>{selectedTheme}</code>
                <code style={{ color: '#888' }}>)</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: '60px 20px 40px',
            borderTop: '1px solid #1a1a1a',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {/* Footer Links */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '40px',
                marginBottom: '40px',
              }}
            >
              {/* Brand */}
              <div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '12px',
                  }}
                >
                  GitSkins
                </h3>
                <p style={{ color: '#666', fontSize: '14px', maxWidth: '250px', lineHeight: 1.6 }}>
                  Beautiful GitHub profile widgets and AI-powered README generator.
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h4 style={{ color: '#888', fontSize: '13px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Product
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="#features" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Features</a>
                  <a href="#themes" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Themes</a>
                  <a href="/readme-generator" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>README Generator</a>
                  <a href="/pricing" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Pricing</a>
                </div>
              </div>

              {/* Resources Links */}
              <div>
                <h4 style={{ color: '#888', fontSize: '13px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Resources
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="/getting-started" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Getting Started</a>
                  <a href="/support" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Support</a>
                  <a href="https://github.com/gitskins/gitskins" target="_blank" rel="noopener noreferrer" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>GitHub</a>
                </div>
              </div>

              {/* Legal Links */}
              <div>
                <h4 style={{ color: '#888', fontSize: '13px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Legal
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="/terms" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Terms of Service</a>
                  <a href="/privacy" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div
              style={{
                paddingTop: '24px',
                borderTop: '1px solid #1a1a1a',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <p style={{ color: '#444', fontSize: '13px', margin: 0 }}>
                © 2026 GitSkins. All rights reserved.
              </p>
              <p style={{ color: '#444', fontSize: '13px', margin: 0 }}>
                Made with 💚 for developers
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
