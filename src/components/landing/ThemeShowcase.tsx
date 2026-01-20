'use client';

import { analytics } from '@/components/AnalyticsProvider';

interface Theme {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface ThemeShowcaseProps {
  themes: Theme[];
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
  username: string;
}

export function ThemeShowcase({ themes, selectedTheme, onThemeSelect, username }: ThemeShowcaseProps) {
  return (
    <section
      style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)',
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
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Choose Your Theme
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: '#888888',
            fontSize: '18px',
            marginBottom: '48px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Preview all available themes and find your perfect match
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '48px',
          }}
        >
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => {
                onThemeSelect(theme.id);
                analytics.trackThemeSelection(theme.id, 'landing', username);
              }}
              style={{
                background: '#161616',
                border: selectedTheme === theme.id ? '2px solid' : '1px solid',
                borderColor: selectedTheme === theme.id ? theme.color : '#2a2a2a',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (selectedTheme !== theme.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = theme.color;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTheme !== theme.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#2a2a2a';
                }
              }}
            >
              {selectedTheme === theme.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: theme.color,
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Selected
                </div>
              )}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '800/400',
                  background: '#0a0a0a',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                  border: `2px solid ${theme.color}20`,
                }}
              >
                <img
                  src={`/api/premium-card?username=${username}&theme=${theme.id}`}
                  alt={`${theme.name} theme preview`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
              </div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '8px',
                }}
              >
                {theme.name}
              </h3>
              <p
                style={{
                  color: '#888888',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
