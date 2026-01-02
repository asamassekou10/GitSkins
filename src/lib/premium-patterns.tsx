/**
 * GitSkins - Premium Background Patterns
 *
 * High-fidelity background patterns for premium themes.
 * These are rendered as absolute-positioned elements behind the main content.
 */

import type { PremiumTheme } from '@/types/premium-theme';

/**
 * Flames pattern for Satan theme
 * Jagged noise and flame shapes at the bottom
 */
export function FlamesPattern({ theme }: { theme: PremiumTheme }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', display: 'flex' }}>
      {/* Layered flame gradients */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `linear-gradient(to top, #3d0000 0%, transparent 60%)`,
          display: 'flex',
        }}
      />

      {/* Ember glows */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '15%',
          width: 150,
          height: 150,
          background: `radial-gradient(circle, #ff4500 0%, #990000 30%, transparent 70%)`,
          borderRadius: '50%',
          opacity: 0.4,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '20%',
          width: 120,
          height: 120,
          background: `radial-gradient(circle, #ff6b35 0%, #3d0000 30%, transparent 70%)`,
          borderRadius: '50%',
          opacity: 0.3,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Grid pattern for Neon theme
 * Cyberpunk graph paper grid lines
 */
export function GridPattern({ theme }: { theme: PremiumTheme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {/* Grid lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${theme.colors.accent}10 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.accent}10 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          display: 'flex',
        }}
      />

      {/* Scanline effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            ${theme.colors.primary}05 1px,
            transparent 2px,
            transparent 4px
          )`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Enso circle for Zen theme
 * Large brush stroke circle in background
 */
export function EnsoPattern({ theme }: { theme: PremiumTheme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Enso circle - brush stroke effect using borders */}
      <div
        style={{
          width: 500,
          height: 500,
          border: `12px solid ${theme.colors.accent}15`,
          borderRadius: '50%',
          opacity: 0.3,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Dots pattern for Dracula theme
 * Minimalist geometric dots in top right
 */
export function DotsPattern({ theme }: { theme: PremiumTheme }) {
  const dots = [
    { top: '10%', right: '10%', size: 8 },
    { top: '12%', right: '15%', size: 6 },
    { top: '15%', right: '12%', size: 10 },
    { top: '8%', right: '18%', size: 7 },
    { top: '18%', right: '8%', size: 9 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {dots.map((dot, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: dot.top,
            right: dot.right,
            width: dot.size,
            height: dot.size,
            background: theme.colors.accent,
            borderRadius: '50%',
            opacity: 0.2,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Get background pattern component for a theme
 */
export function getPremiumBackgroundPattern(theme: PremiumTheme): JSX.Element | null {
  switch (theme.effects.backgroundPattern) {
    case 'flames':
      return <FlamesPattern theme={theme} />;
    case 'grid':
      return <GridPattern theme={theme} />;
    case 'enso':
      return <EnsoPattern theme={theme} />;
    case 'dots':
      return <DotsPattern theme={theme} />;
    case 'none':
    default:
      return null;
  }
}
