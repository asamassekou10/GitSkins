/**
 * Neon Theme - The Cyberpunk HUD
 *
 * Vibe: Tron, Blade Runner, High-Tech
 * Font: JetBrains Mono (Monospace, tech aesthetic)
 * Effects: Outer glow, grid pattern, hot pink and cyan
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const neonPremiumTheme: PremiumTheme = {
  name: 'neon',
  label: 'Neon (Cyberpunk)',

  colors: {
    // Cyberpunk gradient - Deep navy to electric blues
    bg: 'linear-gradient(165deg, #0a0e1a 0%, #0f1629 30%, #09090b 70%, #000000 100%)',
    cardBg: 'rgba(15, 22, 41, 0.5)', // Deep navy semi-transparent
    border: 'rgba(56, 189, 248, 0.6)', // Sky blue border
    primary: '#38bdf8', // Sky blue
    secondary: '#7dd3fc', // Lighter sky blue
    accent: '#0ea5e9', // Vibrant blue
    ring: 'rgba(14, 165, 233, 0.9)', // Blue glow
  },

  font: {
    family: 'JetBrains Mono',
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
    weight: 400,
  },

  effects: {
    // Enhanced multi-layered blue glow
    textGlow: '0 0 20px rgba(56, 189, 248, 0.7), 0 0 40px rgba(14, 165, 233, 0.4)',
    cardShadow: '0 8px 32px rgba(56, 189, 248, 0.4), 0 4px 16px rgba(0, 0, 0, 0.6)',
    backgroundPattern: 'grid',
  },

  // Modern blue spectrum: Deep Navy -> Steel Blue -> Sky Blue -> Bright Cyan -> Electric Blue -> Ice Blue
  graphColors: ['#1e3a8a', '#3b82f6', '#38bdf8', '#22d3ee', '#0ea5e9', '#bae6fd'],
};
