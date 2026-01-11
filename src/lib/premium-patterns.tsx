/**
 * GitSkins - Premium Background Patterns
 *
 * High-fidelity background patterns for premium themes.
 * These are rendered as absolute-positioned elements behind the main content.
 */

import type { PremiumTheme } from '@/types/premium-theme';

/**
 * Flames pattern for Satan theme
 * Layered fire effects with particle embers
 */
export function FlamesPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  // Generate particle embers with varied positions and sizes
  const embers = [
    { bottom: '8%', left: '12%', size: 100, opacity: 0.4 },
    { bottom: '15%', left: '25%', size: 80, opacity: 0.35 },
    { bottom: '5%', right: '18%', size: 120, opacity: 0.4 },
    { bottom: '12%', right: '30%', size: 90, opacity: 0.3 },
    { bottom: '20%', left: '45%', size: 70, opacity: 0.25 },
    { bottom: '10%', right: '50%', size: 85, opacity: 0.35 },
    { bottom: '18%', left: '60%', size: 95, opacity: 0.3 },
    { bottom: '7%', right: '10%', size: 110, opacity: 0.38 },
  ];

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', display: 'flex' }}>
      {/* Primary flame layer - deep red base */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `linear-gradient(to top, ${accent}40 0%, ${accent}20 30%, transparent 70%)`,
          display: 'flex',
        }}
      />

      {/* Secondary flame layer - orange/yellow tips */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80%',
          background: `linear-gradient(to top, #ff450030 0%, #ff8c0020 20%, transparent 50%)`,
          display: 'flex',
        }}
      />

      {/* Particle embers - glowing orbs */}
      {embers.map((ember, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            bottom: ember.bottom,
            left: ember.left,
            right: ember.right,
            width: ember.size,
            height: ember.size,
            background: `radial-gradient(circle, ${accent}60 0%, #ff450040 30%, transparent 70%)`,
            borderRadius: '50%',
            opacity: ember.opacity,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Grid pattern for Neon theme
 * Cyberpunk graph paper with glowing intersections
 */
export function GridPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;
  const gridSize = 60;

  // Generate glowing intersection points
  const intersections = [
    { top: 60, left: 120 },
    { top: 120, left: 180 },
    { top: 180, left: 240 },
    { top: 240, left: 60 },
    { top: 300, left: 300 },
    { top: 120, left: 420 },
    { top: 240, left: 360 },
    { top: 360, left: 180 },
    { top: 420, left: 480 },
    { top: 180, left: 540 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {/* Base grid lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${accent}15 1px, transparent 1px),
            linear-gradient(90deg, ${accent}15 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          display: 'flex',
        }}
      />

      {/* Enhanced grid with glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${accent}08 2px, transparent 2px),
            linear-gradient(90deg, ${accent}08 2px, transparent 2px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          filter: 'blur(1px)',
          display: 'flex',
        }}
      />

      {/* Glowing intersection points */}
      {intersections.map((point, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: point.top,
            left: point.left,
            width: 8,
            height: 8,
            background: `radial-gradient(circle, ${accent}80 0%, ${accent}40 50%, transparent 100%)`,
            borderRadius: '50%',
            boxShadow: `0 0 15px ${accent}60, 0 0 30px ${accent}30`,
            display: 'flex',
          }}
        />
      ))}

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
 * Brush stroke effect with concentric circles and texture
 */
export function EnsoPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  // Concentric circles for layered brush effect
  const circles = [
    { size: 550, thickness: 14, opacity: 0.12, blur: 0 },
    { size: 500, thickness: 16, opacity: 0.18, blur: 0.5 },
    { size: 450, thickness: 12, opacity: 0.15, blur: 1 },
    { size: 520, thickness: 8, opacity: 0.08, blur: 2 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Multiple brush stroke layers for depth */}
      {circles.map((circle, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: circle.size,
            height: circle.size,
            border: `${circle.thickness}px solid ${accent}`,
            borderRadius: '50%',
            opacity: circle.opacity,
            filter: circle.blur > 0 ? `blur(${circle.blur}px)` : 'none',
            display: 'flex',
          }}
        />
      ))}

      {/* Texture overlay - subtle brush texture */}
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${accent}05 0%, transparent 50%)`,
          opacity: 0.4,
          display: 'flex',
        }}
      />

      {/* Highlight for dimensional effect */}
      <div
        style={{
          position: 'absolute',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: `radial-gradient(circle at 70% 70%, transparent 40%, ${accent}03 60%, transparent 80%)`,
          opacity: 0.5,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Dots pattern for Dracula theme
 * Constellation effect with connecting lines
 */
export function DotsPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  // Dots positioned to form a constellation
  const dots = [
    { top: '10%', right: '10%', size: 8, glow: true },
    { top: '12%', right: '15%', size: 6, glow: false },
    { top: '15%', right: '12%', size: 10, glow: true },
    { top: '8%', right: '18%', size: 7, glow: false },
    { top: '18%', right: '8%', size: 9, glow: true },
    { top: '14%', right: '20%', size: 5, glow: false },
    { top: '20%', right: '14%', size: 7, glow: false },
    { top: '16%', right: '16%', size: 6, glow: true },
  ];

  // Connection lines between dots (constellation style)
  const connections = [
    { x1: '90%', y1: '10%', x2: '85%', y2: '12%' },
    { x1: '88%', y1: '15%', x2: '85%', y2: '12%' },
    { x1: '90%', y1: '10%', x2: '82%', y2: '8%' },
    { x1: '92%', y1: '18%', x2: '88%', y2: '15%' },
    { x1: '84%', y1: '16%', x2: '88%', y2: '15%' },
    { x1: '84%', y1: '16%', x2: '86%', y2: '20%' },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {/* Connecting lines */}
      {connections.map((line, index) => (
        <div
          key={`line-${index}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(
              to bottom right,
              transparent calc(${line.y1} - 0.5px),
              ${accent}15 ${line.y1},
              ${accent}15 ${line.y2},
              transparent calc(${line.y2} + 0.5px)
            )`,
            opacity: 0.3,
            display: 'flex',
          }}
        />
      ))}

      {/* Dots with optional glow */}
      {dots.map((dot, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: dot.top,
            right: dot.right,
            width: dot.size,
            height: dot.size,
            background: `radial-gradient(circle, ${accent} 0%, ${accent}80 50%, transparent 100%)`,
            borderRadius: '50%',
            opacity: 0.4,
            boxShadow: dot.glow ? `0 0 12px ${accent}60, 0 0 24px ${accent}30` : 'none',
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
