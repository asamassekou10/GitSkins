'use client';

import { useState } from 'react';

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
  { id: 'card', name: 'Profile Card', path: '/api/card', description: 'Full profile with contribution graph' },
  { id: 'stats', name: 'Stats', path: '/api/stats', description: 'Stars, contributions, repos, followers' },
  { id: 'languages', name: 'Languages', path: '/api/languages', description: 'Top 5 programming languages' },
  { id: 'streak', name: 'Streak', path: '/api/streak', description: 'Current streak and total days' },
];

export default function Home() {
  const [username, setUsername] = useState('octocat');
  const [selectedTheme, setSelectedTheme] = useState('satan');
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gitskins.com';

  const copyToClipboard = async (widget: typeof widgets[0]) => {
    try {
      const url = `${baseUrl}${widget.path}?username=${username}&theme=${selectedTheme}`;
      const markdown = `![${widget.name}](${url})`;
      await navigator.clipboard.writeText(markdown);
      setCopied(widget.id);
      setTimeout(() => setCopied(null), 2000);
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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '100px 20px 80px',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orb background */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(255, 69, 0, 0.15) 0%, transparent 70%)',
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
          {/* Logo */}
          <h1
            style={{
              fontSize: 'clamp(48px, 10vw, 80px)',
              fontWeight: 800,
              margin: 0,
              marginBottom: '16px',
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 50%, #ff8c00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            GitSkins
          </h1>

          <p
            style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              color: '#888888',
              margin: 0,
              marginBottom: '48px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Beautiful, themed widgets for your GitHub README.
            <br />
            Stand out with premium profile cards.
          </p>

          {/* Quick Preview */}
          <div
            style={{
              background: '#161616',
              borderRadius: '20px',
              border: '1px solid #2a2a2a',
              padding: '32px',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <img
              key={`preview-${username}-${selectedTheme}`}
              src={`/api/card?username=${username}&theme=${selectedTheme}`}
              alt="GitSkins Preview"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
              }}
            />
          </div>
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
                    onClick={() => setSelectedTheme(theme.id)}
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
  );
}
