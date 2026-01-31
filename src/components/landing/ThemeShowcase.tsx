'use client';

import { useState, useRef, useEffect } from 'react';
import { analytics } from '@/components/AnalyticsProvider';
import { AnimatedSection, StaggerContainer, StaggerItem } from './AnimatedSection';

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

function ThemeCard({
  theme,
  username,
  isSelected,
  onSelect,
}: {
  theme: Theme;
  username: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      style={{
        background: '#111',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? theme.color : '#1a1a1a',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = '#2a2a2a';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#1a1a1a';
        }
      }}
    >
      {/* Theme Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '4px',
              background: theme.color,
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fafafa' }}>
            {theme.name}
          </span>
        </div>
        {isSelected && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.color} strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Preview Image */}
      <div
        style={{
          background: '#0a0a0a',
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: '80px',
          position: 'relative',
        }}
      >
        {!imageLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #111 25%, #161616 50%, #111 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}
        {isVisible && (
          <img
            src={`/api/stats?username=${username}&theme=${theme.id}`}
            alt={`${theme.name} theme preview`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '12px',
          color: '#666',
          margin: '10px 0 0',
          lineHeight: 1.4,
        }}
      >
        {theme.description}
      </p>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

const categories = [
  { id: null, label: 'All' },
  { id: 'original', label: 'Original' },
  { id: 'developer', label: 'Developer' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'aesthetic', label: 'Aesthetic' },
  { id: 'holiday', label: 'Holiday' },
];

export function ThemeShowcase({ themes, selectedTheme, onThemeSelect, username }: ThemeShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredThemes = activeCategory
    ? themes.filter((t) => t.category === activeCategory)
    : themes;

  const handleThemeSelect = (themeId: string) => {
    onThemeSelect(themeId);
    analytics.trackThemeSelection(themeId, 'showcase', username);
  };

  return (
    <section
      style={{
        padding: '100px 24px',
        background: '#050505',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <AnimatedSection style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              color: '#fafafa',
            }}
          >
            Choose Your Theme
          </h2>
          <p style={{ fontSize: '16px', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
            20 carefully crafted themes to match your style.
          </p>
        </AnimatedSection>

        {/* Category Filter */}
        <AnimatedSection delay={0.1} style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id || 'all'}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                background: activeCategory === cat.id ? '#22c55e' : '#111',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? '#22c55e' : '#1f1f1f',
                borderRadius: '8px',
                color: activeCategory === cat.id ? '#050505' : '#a1a1a1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat.id) {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.color = '#fafafa';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat.id) {
                  e.currentTarget.style.borderColor = '#1f1f1f';
                  e.currentTarget.style.color = '#a1a1a1';
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </AnimatedSection>

        {/* Theme Grid */}
        <StaggerContainer
          staggerDelay={0.06}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredThemes.map((theme) => (
            <StaggerItem key={theme.id}>
              <ThemeCard
                theme={theme}
                username={username}
                isSelected={selectedTheme === theme.id}
                onSelect={() => handleThemeSelect(theme.id)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Selected Theme Info */}
        {selectedTheme && (
          <div
            style={{
              marginTop: '40px',
              padding: '20px 24px',
              background: '#0a0a0a',
              border: '1px solid #161616',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: themes.find((t) => t.id === selectedTheme)?.color || '#22c55e',
                }}
              />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#fafafa' }}>
                {themes.find((t) => t.id === selectedTheme)?.name} selected
              </span>
            </div>
            <a
              href="#create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#22c55e',
                borderRadius: '8px',
                color: '#050505',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4ade80';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#22c55e';
              }}
            >
              Create Widget
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
