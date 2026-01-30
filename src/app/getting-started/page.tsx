'use client';

import { useState } from 'react';
import Link from 'next/link';
import { analytics } from '@/components/AnalyticsProvider';
import { Navigation } from '@/components/landing/Navigation';

const steps = [
  {
    number: 1,
    title: 'Choose Your Widget',
    description: 'Select from profile cards, stats, languages, streaks, or repos',
    code: `![Profile Card](https://gitskins.com/api/premium-card?username=YOUR_USERNAME&theme=satan)`,
  },
  {
    number: 2,
    title: 'Pick a Theme',
    description: 'Choose from 5 beautiful themes: Satan, Neon, Zen, GitHub Dark, or Dracula',
    code: `&theme=neon`,
  },
  {
    number: 3,
    title: 'Copy the Markdown',
    description: 'Copy the generated markdown code to your clipboard',
    code: `![Profile Card](https://gitskins.com/api/premium-card?username=octocat&theme=satan)`,
  },
  {
    number: 4,
    title: 'Add to Your README',
    description: 'Paste the markdown into your GitHub profile README.md file',
    code: `# My GitHub Profile\n\n![Profile Card](https://gitskins.com/api/premium-card?username=octocat&theme=satan)`,
  },
];

const widgets = [
  {
    name: 'Profile Card',
    path: '/api/premium-card',
    description: 'Full profile with contribution graph',
    example: '![Profile Card](https://gitskins.com/api/premium-card?username=octocat&theme=satan)',
  },
  {
    name: 'Stats',
    path: '/api/stats',
    description: 'Stars, contributions, repos, followers',
    example: '![Stats](https://gitskins.com/api/stats?username=octocat&theme=satan)',
  },
  {
    name: 'Languages',
    path: '/api/languages',
    description: 'Top 5 programming languages',
    example: '![Languages](https://gitskins.com/api/languages?username=octocat&theme=satan)',
  },
  {
    name: 'Streak',
    path: '/api/streak',
    description: 'Current streak and total days',
    example: '![Streak](https://gitskins.com/api/streak?username=octocat&theme=satan)',
  },
];

export default function GettingStartedPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedWidget, setSelectedWidget] = useState(0);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      analytics.trackConversion('markdown_copied', { source: 'getting_started' });
    } catch (error) {
      console.error('Failed to copy:', error);
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
      <Navigation />
      <div
        style={{
          padding: '100px 20px 60px',
        }}
      >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(40px, 8vw, 64px)',
              fontWeight: 800,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Getting Started
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#888888',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Follow these simple steps to add beautiful widgets to your GitHub profile
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            marginBottom: '80px',
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '32px',
                marginBottom: '48px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {step.number}
              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    color: '#ffffff',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#888888',
                    marginBottom: '16px',
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
                <div
                  style={{
                    background: '#161616',
                    border: '1px solid #2a2a2a',
                    borderRadius: '12px',
                    padding: '16px',
                    position: 'relative',
                  }}
                >
                  <code
                    style={{
                      color: '#ff6b35',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {step.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(step.code, index)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: copiedIndex === index ? '#238636' : '#2a2a2a',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    {copiedIndex === index ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Widget Examples */}
        <div
          style={{
            marginBottom: '60px',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Available Widgets
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {widgets.map((widget, index) => (
              <button
                key={index}
                onClick={() => setSelectedWidget(index)}
                style={{
                  background: selectedWidget === index ? '#161616' : '#0d0d0d',
                  border: selectedWidget === index ? '2px solid #ff4500' : '1px solid #2a2a2a',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    color: '#ffffff',
                  }}
                >
                  {widget.name}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#888888',
                    margin: 0,
                  }}
                >
                  {widget.description}
                </p>
              </button>
            ))}
          </div>
          <div
            style={{
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '24px',
              position: 'relative',
            }}
          >
            <code
              style={{
                color: '#ff6b35',
                fontSize: '14px',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}
            >
              {widgets[selectedWidget].example}
            </code>
            <button
              onClick={() => copyToClipboard(widgets[selectedWidget].example, 100)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: copiedIndex === 100 ? '#238636' : '#2a2a2a',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copiedIndex === 100 ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 69, 0, 0.2)',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#888888',
              marginBottom: '32px',
            }}
          >
            Create your first widget in seconds
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 69, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Try It Now
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
