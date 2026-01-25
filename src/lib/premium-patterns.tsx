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
 * Snowflakes pattern for Winter theme
 * Floating snowflakes with varying sizes
 */
export function SnowflakesPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  const snowflakes = [
    { top: '8%', left: '15%', size: 12, opacity: 0.5 },
    { top: '15%', left: '45%', size: 8, opacity: 0.4 },
    { top: '12%', right: '20%', size: 14, opacity: 0.55 },
    { top: '25%', left: '25%', size: 10, opacity: 0.45 },
    { top: '5%', right: '35%', size: 6, opacity: 0.35 },
    { top: '20%', left: '60%', size: 11, opacity: 0.5 },
    { top: '30%', right: '15%', size: 9, opacity: 0.4 },
    { top: '18%', left: '80%', size: 7, opacity: 0.35 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {/* Soft gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top, ${accent}15 0%, transparent 60%)`,
          display: 'flex',
        }}
      />
      {/* Snowflakes */}
      {snowflakes.map((flake, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: flake.top,
            left: flake.left,
            right: flake.right,
            width: flake.size,
            height: flake.size,
            background: `radial-gradient(circle, ${accent} 0%, ${accent}80 40%, transparent 70%)`,
            borderRadius: '50%',
            opacity: flake.opacity,
            boxShadow: `0 0 ${flake.size}px ${accent}60`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Blossoms pattern for Spring theme
 * Cherry blossom petals floating
 */
export function BlossomsPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  const petals = [
    { top: '10%', left: '10%', rotation: 15, size: 16, opacity: 0.4 },
    { top: '15%', right: '15%', rotation: -20, size: 12, opacity: 0.5 },
    { top: '8%', left: '40%', rotation: 45, size: 14, opacity: 0.45 },
    { top: '22%', right: '30%', rotation: -10, size: 10, opacity: 0.35 },
    { top: '5%', left: '70%', rotation: 30, size: 13, opacity: 0.4 },
    { top: '18%', left: '25%', rotation: -35, size: 11, opacity: 0.45 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top right, ${accent}20 0%, transparent 50%)`,
          display: 'flex',
        }}
      />
      {petals.map((petal, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: petal.top,
            left: petal.left,
            right: petal.right,
            width: petal.size,
            height: petal.size * 0.6,
            background: `linear-gradient(135deg, ${accent}90 0%, ${accent}50 100%)`,
            borderRadius: '50% 0 50% 0',
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg)`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Sunrays pattern for Summer theme
 * Warm radiating sun rays
 */
export function SunraysPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '60%',
          height: '80%',
          background: `radial-gradient(circle at center, ${accent}40 0%, ${accent}20 30%, transparent 70%)`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '50%',
          background: `conic-gradient(from 180deg, transparent 0deg, ${accent}15 20deg, transparent 40deg, ${accent}10 60deg, transparent 80deg, ${accent}15 100deg, transparent 120deg)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Christmas pattern
 * Festive ornaments and sparkles
 */
export function ChristmasPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  const ornaments = [
    { top: '8%', left: '12%', size: 20, color: accent },
    { top: '15%', right: '18%', size: 16, color: '#22c55e' },
    { top: '5%', left: '50%', size: 14, color: accent },
    { top: '20%', left: '30%', size: 12, color: '#fbbf24' },
    { top: '12%', right: '40%', size: 18, color: '#22c55e' },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {ornaments.map((ornament, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: ornament.top,
            left: ornament.left,
            right: ornament.right,
            width: ornament.size,
            height: ornament.size,
            background: `radial-gradient(circle, ${ornament.color} 0%, ${ornament.color}80 50%, transparent 100%)`,
            borderRadius: '50%',
            opacity: 0.5,
            boxShadow: `0 0 ${ornament.size}px ${ornament.color}60`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Leaves pattern for Autumn theme
 * Falling autumn leaves
 */
export function LeavesPattern({ theme }: { theme: PremiumTheme }) {
  const leaves = [
    { top: '5%', left: '10%', size: 18, rotation: 25, color: '#ea580c' },
    { top: '12%', right: '15%', size: 14, rotation: -15, color: '#dc2626' },
    { top: '8%', left: '45%', size: 16, rotation: 40, color: '#ca8a04' },
    { top: '18%', left: '25%', size: 12, rotation: -30, color: '#ea580c' },
    { top: '15%', right: '35%', size: 15, rotation: 20, color: '#dc2626' },
    { top: '22%', left: '65%', size: 13, rotation: -10, color: '#ca8a04' },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {leaves.map((leaf, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: leaf.top,
            left: leaf.left,
            right: leaf.right,
            width: leaf.size,
            height: leaf.size * 0.7,
            background: `linear-gradient(135deg, ${leaf.color} 0%, ${leaf.color}80 100%)`,
            borderRadius: '50% 0 50% 0',
            opacity: 0.45,
            transform: `rotate(${leaf.rotation}deg)`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Waves pattern for Ocean theme
 * Gentle ocean waves
 */
export function WavesPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          height: '30%',
          background: `linear-gradient(180deg, transparent 0%, ${accent}10 50%, ${accent}20 100%)`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: 0,
          right: 0,
          height: '20%',
          background: `linear-gradient(180deg, transparent 0%, ${accent}08 60%, ${accent}15 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Pumpkins pattern for Halloween theme
 * Spooky pumpkin orbs
 */
export function PumpkinsPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  const pumpkins = [
    { top: '8%', left: '12%', size: 24, opacity: 0.4 },
    { top: '18%', right: '15%', size: 18, opacity: 0.35 },
    { top: '5%', left: '55%', size: 20, opacity: 0.4 },
    { top: '22%', left: '30%', size: 16, opacity: 0.3 },
    { top: '12%', right: '40%', size: 22, opacity: 0.35 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {pumpkins.map((pumpkin, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: pumpkin.top,
            left: pumpkin.left,
            right: pumpkin.right,
            width: pumpkin.size,
            height: pumpkin.size * 0.8,
            background: `radial-gradient(ellipse, ${accent} 0%, ${accent}60 60%, transparent 100%)`,
            borderRadius: '50%',
            opacity: pumpkin.opacity,
            boxShadow: `0 0 ${pumpkin.size}px ${accent}50`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Trees pattern for Forest theme
 * Subtle tree silhouettes
 */
export function TreesPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `linear-gradient(to top, ${accent}20 0%, ${accent}10 40%, transparent 80%)`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '10%',
          width: 0,
          height: 0,
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderBottom: `60px solid ${accent}15`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '15%',
          width: 0,
          height: 0,
          borderLeft: '25px solid transparent',
          borderRight: '25px solid transparent',
          borderBottom: `50px solid ${accent}12`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Clouds pattern for Sunset theme
 * Soft sunset clouds
 */
export function CloudsPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '25%',
          height: '15%',
          background: `radial-gradient(ellipse, ${accent}25 0%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: '30%',
          height: '12%',
          background: `radial-gradient(ellipse, ${accent}20 0%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '40%',
          width: '20%',
          height: '10%',
          background: `radial-gradient(ellipse, ${accent}15 0%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Stars pattern for Midnight theme
 * Twinkling night stars
 */
export function StarsPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  const stars = [
    { top: '5%', left: '10%', size: 4, opacity: 0.8 },
    { top: '12%', left: '25%', size: 3, opacity: 0.6 },
    { top: '8%', right: '15%', size: 5, opacity: 0.9 },
    { top: '18%', left: '45%', size: 3, opacity: 0.5 },
    { top: '15%', right: '30%', size: 4, opacity: 0.7 },
    { top: '22%', left: '60%', size: 3, opacity: 0.6 },
    { top: '10%', right: '50%', size: 4, opacity: 0.75 },
    { top: '25%', left: '80%', size: 3, opacity: 0.55 },
    { top: '6%', left: '70%', size: 5, opacity: 0.85 },
    { top: '20%', right: '70%', size: 3, opacity: 0.5 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {stars.map((star, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            right: star.right,
            width: star.size,
            height: star.size,
            background: accent,
            borderRadius: '50%',
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px ${accent}`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Minimal dots pattern for Minimal theme
 * Subtle grid of dots
 */
export function MinimalDotsPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(${accent}20 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Rain pattern for Matrix theme
 * Digital rain effect
 */
export function RainPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  const drops = [
    { left: '5%', height: '35%', delay: 0 },
    { left: '15%', height: '45%', delay: 0.3 },
    { left: '25%', height: '30%', delay: 0.1 },
    { left: '35%', height: '50%', delay: 0.5 },
    { left: '45%', height: '40%', delay: 0.2 },
    { left: '55%', height: '35%', delay: 0.4 },
    { left: '65%', height: '45%', delay: 0.15 },
    { left: '75%', height: '30%', delay: 0.35 },
    { left: '85%', height: '40%', delay: 0.25 },
    { left: '95%', height: '35%', delay: 0.45 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {drops.map((drop, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: drop.left,
            width: '2px',
            height: drop.height,
            background: `linear-gradient(to bottom, ${accent}80 0%, ${accent}40 50%, transparent 100%)`,
            opacity: 0.4,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Bubbles pattern for Pastel theme
 * Soft floating bubbles
 */
export function BubblesPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  const bubbles = [
    { top: '8%', left: '12%', size: 40, opacity: 0.15 },
    { top: '15%', right: '20%', size: 30, opacity: 0.12 },
    { top: '5%', left: '50%', size: 25, opacity: 0.1 },
    { top: '20%', left: '30%', size: 35, opacity: 0.13 },
    { top: '12%', right: '45%', size: 28, opacity: 0.11 },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: bubble.top,
            left: bubble.left,
            right: bubble.right,
            width: bubble.size,
            height: bubble.size,
            background: `radial-gradient(circle at 30% 30%, ${accent}40 0%, ${accent}20 50%, transparent 100%)`,
            borderRadius: '50%',
            opacity: bubble.opacity,
            border: `1px solid ${accent}30`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Northern lights pattern for Aurora theme
 * Flowing aurora borealis
 */
export function NorthernLightsPattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          width: '40%',
          height: '60%',
          background: `linear-gradient(180deg, ${accent}30 0%, #22c55e20 30%, #3b82f615 60%, transparent 100%)`,
          filter: 'blur(30px)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '15%',
          width: '35%',
          height: '50%',
          background: `linear-gradient(180deg, #8b5cf620 0%, ${accent}25 40%, #06b6d415 70%, transparent 100%)`,
          filter: 'blur(25px)',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Synthwave pattern for Retro theme
 * 80s synthwave grid
 */
export function SynthwavePattern({ theme }: { theme: PremiumTheme }) {
  const accent = theme.colors.accent;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {/* Horizon gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: `linear-gradient(to top, ${accent}25 0%, #f472b620 30%, transparent 100%)`,
          display: 'flex',
        }}
      />
      {/* Grid lines */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          backgroundImage: `
            linear-gradient(${accent}15 1px, transparent 1px),
            linear-gradient(90deg, ${accent}15 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
          display: 'flex',
        }}
      />
      {/* Sun */}
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '50%',
          width: '100px',
          height: '100px',
          background: `radial-gradient(circle, #f472b640 0%, ${accent}30 50%, transparent 100%)`,
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
        }}
      />
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
    case 'snowflakes':
      return <SnowflakesPattern theme={theme} />;
    case 'blossoms':
      return <BlossomsPattern theme={theme} />;
    case 'sunrays':
      return <SunraysPattern theme={theme} />;
    case 'christmas':
      return <ChristmasPattern theme={theme} />;
    case 'leaves':
      return <LeavesPattern theme={theme} />;
    case 'waves':
      return <WavesPattern theme={theme} />;
    case 'pumpkins':
      return <PumpkinsPattern theme={theme} />;
    case 'trees':
      return <TreesPattern theme={theme} />;
    case 'clouds':
      return <CloudsPattern theme={theme} />;
    case 'stars':
      return <StarsPattern theme={theme} />;
    case 'minimal-dots':
      return <MinimalDotsPattern theme={theme} />;
    case 'rain':
      return <RainPattern theme={theme} />;
    case 'bubbles':
      return <BubblesPattern theme={theme} />;
    case 'northern-lights':
      return <NorthernLightsPattern theme={theme} />;
    case 'synthwave':
      return <SynthwavePattern theme={theme} />;
    case 'none':
    default:
      return null;
  }
}
