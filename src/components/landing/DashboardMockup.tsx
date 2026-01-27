'use client';

import { useState, useEffect } from 'react';

export function DashboardMockup() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #111 0%, #0a0a0a 100%)',
        borderRadius: isMobile ? '16px' : '20px',
        border: '1px solid #2a2a2a',
        overflow: 'hidden',
        maxWidth: '900px',
        margin: '0 auto',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.1)',
      }}
    >
      {/* Browser Chrome */}
      <div
        style={{
          background: '#161616',
          padding: isMobile ? '10px 12px' : '12px 16px',
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: isMobile ? '10px' : '12px', height: isMobile ? '10px' : '12px', borderRadius: '50%', background: '#ff5f56' }} />
          <span style={{ width: isMobile ? '10px' : '12px', height: isMobile ? '10px' : '12px', borderRadius: '50%', background: '#ffbd2e' }} />
          <span style={{ width: isMobile ? '10px' : '12px', height: isMobile ? '10px' : '12px', borderRadius: '50%', background: '#27ca40' }} />
        </div>
        <div
          style={{
            flex: 1,
            background: '#0d0d0d',
            borderRadius: '6px',
            padding: isMobile ? '5px 10px' : '6px 12px',
            fontSize: isMobile ? '10px' : '12px',
            color: '#666',
            marginLeft: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          gitskins.com/showcase/octocat
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : '380px'
      }}>
        {/* Sidebar - Hidden on mobile, show compact version */}
        {!isMobile && (
          <div
            style={{
              width: '200px',
              background: '#0d0d0d',
              borderRight: '1px solid #1a1a1a',
              padding: '20px 12px',
              flexShrink: 0,
            }}
          >
            {/* Logo */}
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#22c55e',
                marginBottom: '24px',
                paddingLeft: '8px',
              }}
            >
              GitSkins
            </div>

            {/* User Profile */}
            <div
              style={{
                background: '#161616',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid #22c55e40',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                    border: '2px solid #22c55e',
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>octocat</div>
                  <div style={{ fontSize: '10px', color: '#22c55e' }}>Pro Member</div>
                </div>
              </div>
            </div>

            {/* Widget Types */}
            <div style={{ fontSize: '13px' }}>
              <div style={{ color: '#666', fontSize: '10px', fontWeight: 600, marginBottom: '8px', paddingLeft: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Widgets
              </div>
              {['Profile Card', 'GitHub Stats', 'Top Languages', 'Streak'].map((widget, i) => (
                <div
                  key={widget}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: i === 0 ? '#22c55e15' : 'transparent',
                    borderRadius: '8px',
                    color: i === 0 ? '#22c55e' : '#888',
                    marginBottom: '4px',
                    borderLeft: i === 0 ? '3px solid #22c55e' : '3px solid transparent',
                    fontSize: '13px',
                  }}
                >
                  {widget}
                </div>
              ))}
            </div>

            {/* Theme Selector */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ color: '#666', fontSize: '10px', fontWeight: 600, marginBottom: '8px', paddingLeft: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Theme
              </div>
              <div style={{ display: 'flex', gap: '6px', paddingLeft: '8px', flexWrap: 'wrap' }}>
                {['#22c55e', '#8b5cf6', '#f97316', '#3b82f6', '#ec4899'].map((color, i) => (
                  <div
                    key={color}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: color,
                      border: i === 0 ? '2px solid #fff' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Widget Preview */}
        <div style={{
          flex: 1,
          padding: isMobile ? '16px' : '20px',
          background: '#0f0f0f',
          overflow: 'hidden',
        }}>
          {/* Mobile Header */}
          {isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #1a1a1a',
            }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                  border: '2px solid #22c55e',
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>octocat</div>
                <div style={{ fontSize: '10px', color: '#888' }}>GitHub Profile Widgets</div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['#22c55e', '#8b5cf6', '#f97316'].map((color, i) => (
                  <div
                    key={color}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      background: color,
                      border: i === 0 ? '2px solid #fff' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>Widget Preview</h2>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', marginTop: '2px' }}>20+ premium themes</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    color: '#888',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Embed
                </button>
              </div>
            </div>
          )}

          {/* Profile Card Widget */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
              borderRadius: isMobile ? '10px' : '12px',
              border: '1px solid #22c55e30',
              padding: isMobile ? '16px' : '20px',
              marginBottom: isMobile ? '12px' : '16px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '12px' : '16px',
              flexWrap: 'wrap',
            }}>
              <div
                style={{
                  width: isMobile ? '50px' : '60px',
                  height: isMobile ? '50px' : '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                  border: '3px solid #22c55e',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: '120px' }}>
                <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700, color: '#fff' }}>The Octocat</div>
                <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#22c55e', marginTop: '2px' }}>@octocat</div>
                <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#8b949e', marginTop: '4px' }}>
                  {isMobile ? 'GitHub mascot' : 'The friendly GitHub mascot and coding companion'}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '16px' : '24px',
              marginTop: isMobile ? '14px' : '16px',
              paddingTop: isMobile ? '14px' : '16px',
              borderTop: '1px solid #22c55e20',
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'Repos', value: '156' },
                { label: 'Stars', value: '2.4k' },
                { label: 'Followers', value: '12.4k' },
              ].map((stat) => (
                <div key={stat.label} style={{ minWidth: isMobile ? '60px' : '70px' }}>
                  <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 700, color: '#22c55e' }}>{stat.value}</div>
                  <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#8b949e' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '12px' : '12px',
          }}>
            {/* GitHub Stats */}
            <div
              style={{
                background: '#0d0d0d',
                borderRadius: '8px',
                padding: isMobile ? '14px' : '16px',
                border: '1px solid #22c55e30',
              }}
            >
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                GitHub Stats
              </div>
              <div style={{ display: 'flex', gap: isMobile ? '16px' : '20px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 700, color: '#22c55e' }}>1,842</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>Contributions</div>
                </div>
                <div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 700, color: '#22c55e' }}>A+</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>Rank</div>
                </div>
              </div>
            </div>

            {/* Top Languages */}
            <div
              style={{
                background: '#0d0d0d',
                borderRadius: '8px',
                padding: isMobile ? '14px' : '16px',
                border: '1px solid #22c55e30',
              }}
            >
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Top Languages
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {[
                  { pct: 45, color: '#3178c6' },
                  { pct: 30, color: '#3572A5' },
                  { pct: 25, color: '#00ADD8' },
                ].map((lang, i) => (
                  <div
                    key={i}
                    style={{
                      flex: lang.pct,
                      height: '6px',
                      background: lang.color,
                      borderRadius: '3px',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { name: 'TS', color: '#3178c6' },
                  { name: 'Python', color: '#3572A5' },
                  { name: 'Go', color: '#00ADD8' },
                ].map((lang) => (
                  <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: lang.color }} />
                    <span style={{ fontSize: '10px', color: '#888' }}>{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          {isMobile && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  color: '#888',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Copy Code
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#22c55e',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Create Yours
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
