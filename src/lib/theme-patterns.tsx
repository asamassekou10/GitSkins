/**
 * GitSkins - Theme-Specific Background Patterns
 *
 * Dynamic background elements that enhance each theme's visual identity.
 * All patterns are JSX components compatible with Satori.
 */

import type { Theme } from '@/types';

/**
 * Satan Theme - Flames and fire particles
 */
export function SatanBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 15% 85%, ${theme.fireColors[2]}25 0%, transparent 35%),
            radial-gradient(circle at 45% 90%, ${theme.accentColor}20 0%, transparent 30%),
            radial-gradient(circle at 75% 88%, ${theme.fireColors[1]}22 0%, transparent 32%)
          `,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '10%',
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${theme.accentColor}35 0%, ${theme.fireColors[1]}20 40%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to top, ${theme.fireColors[0]}15 0%, transparent 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Neon Theme - Cyberpunk grid
 */
export function NeonBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${theme.accentColor}20 1.5px, transparent 1.5px),
            linear-gradient(90deg, ${theme.accentColor}20 1.5px, transparent 1.5px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.4,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${theme.accentColor}25 0%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 100,
          height: 100,
          borderTop: `3px solid ${theme.accentColor}40`,
          borderLeft: `3px solid ${theme.accentColor}40`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Dracula Theme - Gothic moon
 */
export function DraculaBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: 100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, #ffff0040 0%, #bd93f930 30%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: 0,
          right: 0,
          height: 150,
          background: `radial-gradient(ellipse at 30% 50%, ${theme.accentColor}15 0%, transparent 60%)`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, ${theme.bg}40 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Zen Theme - Bamboo stems
 */
export function ZenBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 80,
          width: 6,
          height: 300,
          background: `linear-gradient(to bottom, ${theme.accentColor}30 0%, ${theme.accentColor}50 50%, ${theme.accentColor}30 100%)`,
          borderRadius: 3,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 120,
          width: 5,
          height: 250,
          background: `linear-gradient(to bottom, ${theme.accentColor}25 0%, ${theme.accentColor}45 50%, ${theme.accentColor}25 100%)`,
          borderRadius: 3,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '40%',
          width: 180,
          height: 180,
          border: `1px solid ${theme.accentColor}20`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * GitHub Dark Theme - Code grid
 */
export function GitHubDarkBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${theme.borderColor}30 1px, transparent 1px),
            linear-gradient(90deg, ${theme.borderColor}30 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.3,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 100,
          width: 140,
          height: 140,
          background: `radial-gradient(circle, ${theme.accentColor}20 0%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Winter Theme - Snowflakes
 */
export function WinterBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${10 + (i * 12) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            width: 8 + (i % 3) * 4,
            height: 8 + (i % 3) * 4,
            background: `radial-gradient(circle, ${theme.accentColor}40 0%, transparent 70%)`,
            borderRadius: '50%',
            display: 'flex',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          background: `linear-gradient(to top, ${theme.accentColor}15 0%, transparent 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Spring Theme - Cherry blossoms
 */
export function SpringBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${15 + (i * 14) % 70}%`,
            left: `${8 + (i * 16) % 85}%`,
            width: 12 + (i % 2) * 6,
            height: 12 + (i % 2) * 6,
            background: `radial-gradient(circle, ${theme.accentColor}35 0%, transparent 70%)`,
            borderRadius: '50%',
            display: 'flex',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${theme.accentColor}20 0%, transparent 60%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Summer Theme - Sun rays
 */
export function SummerBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${theme.accentColor}30 0%, transparent 60%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to top, ${theme.accentColor}20 0%, transparent 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Autumn Theme - Falling leaves
 */
export function AutumnBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${20 + (i * 15) % 60}%`,
            left: `${10 + (i * 18) % 80}%`,
            width: 16,
            height: 20,
            background: `linear-gradient(135deg, ${theme.accentColor}40 0%, transparent 100%)`,
            borderRadius: '50% 0',
            transform: `rotate(${45 + i * 30}deg)`,
            display: 'flex',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: `linear-gradient(to top, ${theme.accentColor}15 0%, transparent 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Christmas Theme - Festive ornaments
 */
export function ChristmasBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${10 + (i * 12) % 50}%`,
            left: `${5 + (i * 17) % 90}%`,
            width: 14,
            height: 14,
            background: i % 2 === 0 ? '#ef444460' : '#22c55e60',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: `linear-gradient(to top, #ffffff15 0%, transparent 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Halloween Theme - Spooky elements
 */
export function HalloweenBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: 80,
          width: 180,
          height: 180,
          background: `radial-gradient(circle, #fbbf2440 0%, transparent 60%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${25 + (i * 18) % 50}%`,
            left: `${15 + (i * 22) % 70}%`,
            width: 20,
            height: 16,
            background: `${theme.accentColor}30`,
            borderRadius: '50% 50% 0 0',
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Ocean Theme - Waves
 */
export function OceanBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to top, ${theme.accentColor}25 0%, transparent 100%)`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: 300,
          height: 150,
          background: `radial-gradient(ellipse, ${theme.accentColor}15 0%, transparent 70%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Forest Theme - Trees
 */
export function ForestBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${10 + i * 25}%`,
            width: 8,
            height: 200 + i * 30,
            background: `linear-gradient(to top, ${theme.accentColor}40 0%, ${theme.accentColor}20 100%)`,
            borderRadius: '4px 4px 0 0',
            display: 'flex',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: `linear-gradient(to top, ${theme.accentColor}20 0%, transparent 100%)`,
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Sunset Theme - Clouds
 */
export function SunsetBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${20 + i * 25}%`,
            left: `${10 + i * 30}%`,
            width: 120 + i * 20,
            height: 40,
            background: `radial-gradient(ellipse, ${theme.accentColor}25 0%, transparent 70%)`,
            borderRadius: '50%',
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Midnight Theme - Stars
 */
export function MidnightBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${5 + (i * 8) % 90}%`,
            left: `${3 + (i * 9) % 94}%`,
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            background: theme.accentColor,
            borderRadius: '50%',
            opacity: 0.4 + (i % 5) * 0.1,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Aurora Theme - Northern lights
 */
export function AuroraBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80%',
          height: 150,
          background: `linear-gradient(90deg, transparent 0%, ${theme.accentColor}30 30%, #22d3ee30 70%, transparent 100%)`,
          borderRadius: '50%',
          transform: 'skewY(-5deg)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '5%',
          width: '90%',
          height: 100,
          background: `linear-gradient(90deg, transparent 0%, #a78bfa25 40%, ${theme.accentColor}25 60%, transparent 100%)`,
          borderRadius: '50%',
          transform: 'skewY(3deg)',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Retro Theme - Synthwave grid
 */
export function RetroBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          backgroundImage: `
            linear-gradient(${theme.accentColor}30 1px, transparent 1px),
            linear-gradient(90deg, ${theme.accentColor}30 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 200,
          background: `radial-gradient(circle, #22d3ee40 0%, ${theme.accentColor}20 50%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Minimal Theme - Subtle dots
 */
export function MinimalBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(${theme.accentColor}20 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          display: 'flex',
        }}
      />
    </div>
  );
}

/**
 * Pastel Theme - Soft bubbles
 */
export function PastelBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${15 + (i * 14) % 70}%`,
            left: `${8 + (i * 16) % 85}%`,
            width: 60 + (i % 3) * 30,
            height: 60 + (i % 3) * 30,
            background: `radial-gradient(circle, ${theme.accentColor}20 0%, transparent 70%)`,
            borderRadius: '50%',
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Matrix Theme - Code rain
 */
export function MatrixBackground({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${3 + i * 7}%`,
            width: 2,
            height: `${30 + (i * 17) % 70}%`,
            background: `linear-gradient(to bottom, transparent 0%, ${theme.accentColor}40 50%, transparent 100%)`,
            display: 'flex',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Get theme-specific background pattern component
 */
export function getThemeBackground(themeName: string, theme: Theme): JSX.Element {
  switch (themeName) {
    case 'satan':
      return <SatanBackground theme={theme} />;
    case 'neon':
      return <NeonBackground theme={theme} />;
    case 'dracula':
      return <DraculaBackground theme={theme} />;
    case 'zen':
      return <ZenBackground theme={theme} />;
    case 'github-dark':
      return <GitHubDarkBackground theme={theme} />;
    case 'winter':
      return <WinterBackground theme={theme} />;
    case 'spring':
      return <SpringBackground theme={theme} />;
    case 'summer':
      return <SummerBackground theme={theme} />;
    case 'autumn':
      return <AutumnBackground theme={theme} />;
    case 'christmas':
      return <ChristmasBackground theme={theme} />;
    case 'halloween':
      return <HalloweenBackground theme={theme} />;
    case 'ocean':
      return <OceanBackground theme={theme} />;
    case 'forest':
      return <ForestBackground theme={theme} />;
    case 'sunset':
      return <SunsetBackground theme={theme} />;
    case 'midnight':
      return <MidnightBackground theme={theme} />;
    case 'aurora':
      return <AuroraBackground theme={theme} />;
    case 'retro':
      return <RetroBackground theme={theme} />;
    case 'minimal':
      return <MinimalBackground theme={theme} />;
    case 'pastel':
      return <PastelBackground theme={theme} />;
    case 'matrix':
      return <MatrixBackground theme={theme} />;
    default:
      return <div style={{ display: 'flex' }} />;
  }
}
