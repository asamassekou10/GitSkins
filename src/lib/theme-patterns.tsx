/**
 * GitSkins - Theme-Specific Background Patterns
 *
 * Dynamic background elements that enhance each theme's visual identity.
 * All patterns are JSX components compatible with Satori.
 */

import type { Theme } from '@/types';

/**
 * Satan Theme - Animated flames and fire particles
 */
export function SatanBackground({ theme }: { theme: Theme }) {
  return (
    <>
      {/* Flame particles - layered for depth */}
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
            radial-gradient(circle at 75% 88%, ${theme.fireColors[1]}22 0%, transparent 32%),
            radial-gradient(circle at 88% 82%, ${theme.fireColors[2]}18 0%, transparent 28%)
          `,
          display: 'flex',
        }}
      />

      {/* Ember glow spots */}
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
          top: '70%',
          right: '15%',
          width: 90,
          height: 90,
          background: `radial-gradient(circle, ${theme.fireColors[2]}30 0%, ${theme.accentColor}15 40%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />

      {/* Heat wave lines */}
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
    </>
  );
}

/**
 * Neon Theme - Cyberpunk grid and scan lines
 */
export function NeonBackground({ theme }: { theme: Theme }) {
  return (
    <>
      {/* Cyberpunk grid */}
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

      {/* Diagonal scan lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            ${theme.accentColor}08 0px,
            transparent 1px,
            transparent 4px
          )`,
          display: 'flex',
        }}
      />

      {/* Glowing orbs */}
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
          bottom: '15%',
          left: '8%',
          width: 150,
          height: 150,
          background: `radial-gradient(circle, #ff00ff20 0%, transparent 70%)`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />

      {/* Corner accents */}
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
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 100,
          height: 100,
          borderBottom: `3px solid ${theme.accentColor}40`,
          borderRight: `3px solid ${theme.accentColor}40`,
          display: 'flex',
        }}
      />
    </>
  );
}

/**
 * Dracula Theme - Gothic moon, bats, and mystical elements
 */
export function DraculaBackground({ theme }: { theme: Theme }) {
  return (
    <>
      {/* Moon glow */}
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

      {/* Purple mist layers */}
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
          bottom: '20%',
          left: 0,
          right: 0,
          height: 120,
          background: `radial-gradient(ellipse at 70% 50%, #ff79c615 0%, transparent 60%)`,
          display: 'flex',
        }}
      />

      {/* Bat silhouettes (simple triangular shapes) */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: `12px solid ${theme.accentColor}40`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '25%',
          right: '30%',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: `9px solid ${theme.accentColor}30`,
          display: 'flex',
        }}
      />

      {/* Gothic vignette */}
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
    </>
  );
}

/**
 * Zen Theme - Bamboo stems and minimalist nature elements
 */
export function ZenBackground({ theme }: { theme: Theme }) {
  return (
    <>
      {/* Bamboo stems */}
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
          right: 50,
          top: 100,
          width: 6,
          height: 280,
          background: `linear-gradient(to bottom, ${theme.accentColor}28 0%, ${theme.accentColor}48 50%, ${theme.accentColor}28 100%)`,
          borderRadius: 3,
          display: 'flex',
        }}
      />

      {/* Bamboo nodes (horizontal lines) */}
      <div
        style={{
          position: 'absolute',
          left: 35,
          top: 200,
          width: 16,
          height: 2,
          background: theme.accentColor,
          opacity: 0.4,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 65,
          top: 250,
          width: 15,
          height: 2,
          background: theme.accentColor,
          opacity: 0.35,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 45,
          top: 220,
          width: 16,
          height: 2,
          background: theme.accentColor,
          opacity: 0.38,
          display: 'flex',
        }}
      />

      {/* Gentle circular ripples */}
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
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: '42%',
          width: 160,
          height: 160,
          border: `1px solid ${theme.accentColor}15`,
          borderRadius: '50%',
          display: 'flex',
        }}
      />

      {/* Subtle leaves/petals */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: 20,
          height: 30,
          background: `linear-gradient(135deg, ${theme.accentColor}25 0%, transparent 100%)`,
          borderRadius: '50% 0',
          display: 'flex',
        }}
      />
    </>
  );
}

/**
 * GitHub Dark Theme - Code elements and Octocat silhouette
 */
export function GitHubDarkBackground({ theme }: { theme: Theme }) {
  return (
    <>
      {/* Code-like grid pattern */}
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

      {/* Octagon shapes (simplified Octocat reference) - using rounded square instead of clipPath */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          right: 80,
          width: 80,
          height: 80,
          background: `${theme.accentColor}15`,
          borderRadius: 12,
          transform: 'rotate(45deg)',
          display: 'flex',
        }}
      />

      {/* Glowing blue accent orbs */}
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

      {/* Diagonal code lines */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '15%',
          width: 200,
          height: 2,
          background: `linear-gradient(to right, transparent 0%, ${theme.accentColor}30 50%, transparent 100%)`,
          transform: 'rotate(-15deg)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '55%',
          right: '20%',
          width: 180,
          height: 2,
          background: `linear-gradient(to right, transparent 0%, ${theme.accentColor}25 50%, transparent 100%)`,
          transform: 'rotate(12deg)',
          display: 'flex',
        }}
      />

      {/* Corner brackets (like code blocks) */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 60,
          height: 60,
          borderTop: `2px solid ${theme.accentColor}40`,
          borderLeft: `2px solid ${theme.accentColor}40`,
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderBottom: `2px solid ${theme.accentColor}40`,
          borderRight: `2px solid ${theme.accentColor}40`,
          display: 'flex',
        }}
      />
    </>
  );
}

/**
 * Get theme-specific background pattern component
 * Returns a wrapper div to ensure Satori compatibility
 */
export function getThemeBackground(themeName: string, theme: Theme): JSX.Element {
  let BackgroundComponent: JSX.Element;

  switch (themeName) {
    case 'satan':
      BackgroundComponent = <SatanBackground theme={theme} />;
      break;
    case 'neon':
      BackgroundComponent = <NeonBackground theme={theme} />;
      break;
    case 'dracula':
      BackgroundComponent = <DraculaBackground theme={theme} />;
      break;
    case 'zen':
      BackgroundComponent = <ZenBackground theme={theme} />;
      break;
    case 'github-dark':
      BackgroundComponent = <GitHubDarkBackground theme={theme} />;
      break;
    default:
      BackgroundComponent = <></>;
  }

  return BackgroundComponent;
}
