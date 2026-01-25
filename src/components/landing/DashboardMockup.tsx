'use client';

export function DashboardMockup() {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #111 0%, #0a0a0a 100%)',
        borderRadius: '20px',
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
          padding: '12px 16px',
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27ca40' }} />
        </div>
        <div
          style={{
            flex: 1,
            background: '#0d0d0d',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            color: '#666',
            marginLeft: '12px',
          }}
        >
          gitskins.com/readme-generator
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{ display: 'flex', minHeight: '380px' }}>
        {/* Sidebar */}
        <div
          style={{
            width: '220px',
            background: '#0d0d0d',
            borderRight: '1px solid #1a1a1a',
            padding: '20px 12px',
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

          {/* Username Input */}
          <div
            style={{
              background: '#161616',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #22c55e40',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span style={{ fontSize: '13px', color: '#fff' }}>octocat</span>
          </div>

          {/* Sections */}
          <div style={{ fontSize: '13px' }}>
            <div style={{ color: '#666', fontSize: '10px', fontWeight: 600, marginBottom: '8px', paddingLeft: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Sections
            </div>
            {['About Me', 'Skills & Tools', 'GitHub Stats', 'Projects'].map((section, i) => (
              <div
                key={section}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: i === 2 ? '#22c55e15' : 'transparent',
                  borderRadius: '8px',
                  color: i === 2 ? '#22c55e' : '#888',
                  marginBottom: '4px',
                  borderLeft: i === 2 ? '3px solid #22c55e' : '3px solid transparent',
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    border: `2px solid ${i < 3 ? '#22c55e' : '#444'}`,
                    background: i < 3 ? '#22c55e' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i < 3 && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {section}
              </div>
            ))}
          </div>

          {/* Theme Selector */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#666', fontSize: '10px', fontWeight: 600, marginBottom: '8px', paddingLeft: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Theme
            </div>
            <div style={{ display: 'flex', gap: '6px', paddingLeft: '8px' }}>
              {['#22c55e', '#8b5cf6', '#f97316', '#3b82f6'].map((color, i) => (
                <div
                  key={color}
                  style={{
                    width: '24px',
                    height: '24px',
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

        {/* Main Content - Preview */}
        <div style={{ flex: 1, padding: '20px', background: '#0f0f0f' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>README Preview</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#666', marginTop: '2px' }}>AI-powered generation</p>
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
                Generate
              </button>
            </div>
          </div>

          {/* README Preview Card */}
          <div
            style={{
              background: '#161616',
              borderRadius: '12px',
              border: '1px solid #2a2a2a',
              padding: '20px',
              fontFamily: 'monospace',
            }}
          >
            {/* Mock README Content */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                  }}
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Hi there! 👋</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>I&apos;m @octocat</div>
                </div>
              </div>
            </div>

            {/* Mock Stats Widget */}
            <div
              style={{
                background: '#0d0d0d',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid #22c55e30',
              }}
            >
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                GitHub Stats
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>1,842</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>Contributions</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>156</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>Repositories</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>12.4k</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>Followers</div>
                </div>
              </div>
            </div>

            {/* Mock Languages */}
            <div
              style={{
                background: '#0d0d0d',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #22c55e30',
              }}
            >
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Top Languages
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {[
                  { name: 'TypeScript', pct: 45, color: '#3178c6' },
                  { name: 'Python', pct: 30, color: '#3572A5' },
                  { name: 'Go', pct: 25, color: '#00ADD8' },
                ].map((lang) => (
                  <div
                    key={lang.name}
                    style={{
                      flex: lang.pct,
                      height: '8px',
                      background: lang.color,
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[
                  { name: 'TypeScript', pct: 45, color: '#3178c6' },
                  { name: 'Python', pct: 30, color: '#3572A5' },
                  { name: 'Go', pct: 25, color: '#00ADD8' },
                ].map((lang) => (
                  <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: lang.color }} />
                    <span style={{ fontSize: '10px', color: '#888' }}>{lang.name}</span>
                    <span style={{ fontSize: '10px', color: '#555' }}>{lang.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
