'use client';

import { useState } from 'react';
import { analytics } from '@/components/AnalyticsProvider';

interface Theme {
  id: string;
  name: string;
  color: string;
  description: string;
  category?: string;
  free?: boolean;
}

interface ThemeShowcaseProps {
  themes: Theme[];
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
  username: string;
}

const categoryLabels: Record<string, string> = {
  original: 'Original',
  seasonal: 'Seasonal',
  holiday: 'Holiday',
  developer: 'Developer',
  aesthetic: 'Aesthetic',
};

const categoryOrder = ['original', 'seasonal', 'holiday', 'developer', 'aesthetic'];

export function ThemeShowcase({ themes, selectedTheme, onThemeSelect, username }: ThemeShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group themes by category
  const groupedThemes = themes.reduce((acc, theme) => {
    const category = theme.category || 'original';
    if (!acc[category]) acc[category] = [];
    acc[category].push(theme);
    return acc;
  }, {} as Record<string, Theme[]>);

  // Filter themes based on active category
  const displayThemes = activeCategory
    ? themes.filter((t) => t.category === activeCategory)
    : themes;

  return (
    <section
      id="themes"
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
            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          20 Premium Themes
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: '#888888',
            fontSize: '18px',
            marginBottom: '32px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          From seasonal to aesthetic, find your perfect match
        </p>

        {/* Category Filter */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '48px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '10px 20px',
              background: activeCategory === null ? '#22c55e' : '#1a1a1a',
              border: '1px solid',
              borderColor: activeCategory === null ? '#22c55e' : '#2a2a2a',
              borderRadius: '24px',
              color: activeCategory === null ? '#000' : '#888',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            All ({themes.length})
          </button>
          {categoryOrder.map((category) => {
            const count = groupedThemes[category]?.length || 0;
            if (count === 0) return null;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '10px 20px',
                  background: activeCategory === category ? '#22c55e' : '#1a1a1a',
                  border: '1px solid',
                  borderColor: activeCategory === category ? '#22c55e' : '#2a2a2a',
                  borderRadius: '24px',
                  color: activeCategory === category ? '#000' : '#888',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {categoryLabels[category]} ({count})
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {displayThemes.map((theme) => (
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
              {/* Badges */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {theme.free && (
                  <span
                    style={{
                      background: '#22c55e20',
                      color: '#22c55e',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    FREE
                  </span>
                )}
                {selectedTheme === theme.id && (
                  <span
                    style={{
                      background: theme.color,
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Selected
                  </span>
                )}
              </div>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: theme.color,
                  }}
                />
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  {theme.name}
                </h3>
              </div>
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
