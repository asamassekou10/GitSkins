'use client';

import { useState } from 'react';
import { analytics } from '@/components/AnalyticsProvider';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsCounter } from '@/components/landing/StatsCounter';
import { SocialProof } from '@/components/landing/SocialProof';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { ThemeShowcase } from '@/components/landing/ThemeShowcase';

/**
 * GitSkins - Premium Landing Page
 *
 * A dark, modern landing page showcasing the GitHub profile widgets.
 * Features: gradient backgrounds, smooth animations, widget previews, and copy-to-clipboard.
 */

const themes = [
  { id: 'satan', name: 'Satan', color: '#ff4500', description: 'Fiery red on dark' },
  { id: 'neon', name: 'Neon', color: '#00ffff', description: 'Cyberpunk vibes' },
  { id: 'zen', name: 'Zen', color: '#00ff88', description: 'Calm and minimal' },
  { id: 'github-dark', name: 'GitHub Dark', color: '#238636', description: 'Official GitHub dark' },
  { id: 'dracula', name: 'Dracula', color: '#ff79c6', description: 'Developer favorite' },
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

  // Track theme selection
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
      
      // Track markdown copy event
      analytics.trackMarkdownCopy(widget.id, selectedTheme, username, 'landing');
      analytics.trackConversion('markdown_copied', { widget_type: widget.id, theme: selectedTheme });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
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
      {/* Structured Data (JSON-LD) for SEO */}
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
      <BenefitsSection />

      {/* Theme Showcase */}
      <ThemeShowcase
        themes={themes}
        selectedTheme={selectedTheme}
        onThemeSelect={handleThemeChange}
        username={username}
      />

      {/* Social Proof */}
      <SocialProof />

      {/* Interactive Showcase Section */}
      <section
        style={{
          padding: '80px 20px',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(255, 20, 147, 0.2) 100%)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#c084fc',
              marginBottom: '24px',
            }}
          >
            NEW
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 6vw, 56px)',
              fontWeight: 800,
              margin: 0,
              marginBottom: '20px',
              letterSpacing: '-1px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Interactive Showcase
          </h2>

          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: '#aaa',
              margin: '0 auto',
              marginBottom: '40px',
              maxWidth: '700px',
              lineHeight: 1.6,
            }}
          >
            Experience your GitHub profile with <strong style={{ color: '#c084fc' }}>full animations</strong>,{' '}
            <strong style={{ color: '#ec4899' }}>interactive effects</strong>, and{' '}
            <strong style={{ color: '#f97316' }}>3D transitions</strong> - no GitHub restrictions!
          </p>

          {/* Feature highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              maxWidth: '900px',
              margin: '0 auto',
              marginBottom: '40px',
            }}
          >
            {[
              { icon: '✨', label: 'Animated Gradients' },
              { icon: '🎬', label: '3D Card Flips' },
              { icon: '🎨', label: 'Theme Morphing' },
              { icon: '💫', label: 'Glow Effects' },
            ].map((feature) => (
              <div
                key={feature.label}
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{feature.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href={`/showcase/@${username}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 40px',
              fontSize: '18px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: '16px',
              color: '#fff',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(168, 85, 247, 0.3)';
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            View Interactive Showcase
          </a>

          <p
            style={{
              fontSize: '14px',
              color: '#666',
              margin: 0,
              marginTop: '20px',
            }}
          >
            Try it: <code style={{
              background: '#1a1a1a',
              padding: '4px 12px',
              borderRadius: '6px',
              color: '#a855f7',
              fontSize: '13px',
            }}>
              gitskins.com/showcase/@{username}
            </code>
          </p>
        </div>
      </section>

      {/* Generator Section */}
      <section
        style={{
          padding: '60px 20px',
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
                background: '#ff4500',
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
                      background: copied === widget.id ? '#238636' : '#ff4500',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
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
                    src={`${widget.path}?username=${username}&theme=${selectedTheme}`}
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
                background: '#ff4500',
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
                    background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
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
              <code style={{ color: '#ff6b35' }}>![Profile Card]</code>
              <code style={{ color: '#888' }}>(https://gitskins.com/api/card?username=</code>
              <code style={{ color: '#ff4500' }}>{username}</code>
              <code style={{ color: '#888' }}>&theme=</code>
              <code style={{ color: '#ff4500' }}>{selectedTheme}</code>
              <code style={{ color: '#888' }}>)</code>
              {'\n\n'}
              <code style={{ color: '#888' }}>## Stats</code>
              {'\n\n'}
              <code style={{ color: '#ff6b35' }}>![Stats]</code>
              <code style={{ color: '#888' }}>(https://gitskins.com/api/stats?username=</code>
              <code style={{ color: '#ff4500' }}>{username}</code>
              <code style={{ color: '#888' }}>&theme=</code>
              <code style={{ color: '#ff4500' }}>{selectedTheme}</code>
              <code style={{ color: '#888' }}>)</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 20px',
          borderTop: '1px solid #1a1a1a',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: '#444',
            fontSize: '14px',
            margin: 0,
          }}
        >
          GitSkins - Beautiful GitHub README Widgets
        </p>
      </footer>
    </div>
    </>
  );
}
