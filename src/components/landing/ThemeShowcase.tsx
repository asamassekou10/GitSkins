'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '@/components/AnalyticsProvider';
import { isPro } from '@/lib/usage-tracker';
import { isFreeTierTheme } from '@/config/subscription';

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

// Lazy loading card component with intersection observer
function ThemeCard({
  theme,
  username,
  isSelected,
  onSelect,
  isLocked,
  onLockedClick,
}: {
  theme: Theme;
  username: string;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
  onLockedClick: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  const handleClick = () => {
    if (isLocked) {
      onLockedClick();
    } else {
      onSelect();
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      style={{
        background: '#161616',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? theme.color : '#2a2a2a',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s',
        position: 'relative',
        overflow: 'hidden',
        opacity: isLocked ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = theme.color;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#2a2a2a';
        }
      }}
    >
      {/* Lock overlay for premium themes */}
      {isLocked && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            borderRadius: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 600 }}>
              PRO
            </span>
          </div>
        </div>
      )}

      {/* Badges */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
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
        {!theme.free && !isLocked && (
          <span
            style={{
              background: '#fbbf2420',
              color: '#fbbf24',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            PRO
          </span>
        )}
        {isSelected && (
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
          position: 'relative',
        }}
      >
        {/* Placeholder skeleton */}
        {(!isVisible || !imageLoaded) && !imageError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${theme.color}10 0%, #1a1a1a 50%, ${theme.color}10 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: `3px solid ${theme.color}30`,
                borderTopColor: theme.color,
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ color: '#666', fontSize: '12px' }}>Loading preview...</span>
          </div>
        )}

        {/* Error state */}
        {imageError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${theme.color}15 0%, #0a0a0a 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: `${theme.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '24px' }}>{theme.name.split(' ')[0]}</span>
            </div>
            <span style={{ color: theme.color, fontSize: '14px', fontWeight: 600 }}>{theme.name}</span>
          </div>
        )}

        {/* Actual image - only loads when visible */}
        {isVisible && !imageError && (
          <img
            src={`/api/premium-card?username=${username}&theme=${theme.id}`}
            alt={`${theme.name} theme preview`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
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
  );
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userIsPro, setUserIsPro] = useState(false);

  // Check pro status on mount
  useEffect(() => {
    setUserIsPro(isPro());
  }, []);

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

  // Check if a theme is locked for the current user
  const isThemeLocked = (themeId: string) => {
    if (userIsPro) return false;
    return !isFreeTierTheme(themeId);
  };

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
            <ThemeCard
              key={theme.id}
              theme={theme}
              username={username}
              isSelected={selectedTheme === theme.id}
              isLocked={isThemeLocked(theme.id)}
              onSelect={() => {
                onThemeSelect(theme.id);
                analytics.trackThemeSelection(theme.id, 'landing', username);
              }}
              onLockedClick={() => setShowUpgradeModal(true)}
            />
          ))}
        </div>

        {/* CSS for loading spinner animation */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Upgrade modal removed - all themes free for hackathon */}
      </div>
    </section>
  );
}
