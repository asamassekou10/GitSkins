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
    bg: '#09090b', // Deep void
    cardBg: '#18181b',
    border: '#00ffff',
    primary: '#00ffff', // Cyan
    secondary: '#00d9ff',
    accent: '#ff00ff', // Hot pink
    ring: '#00ffff',
  },

  font: {
    family: 'JetBrains Mono',
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 10px #00ffff',
    cardShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.2)',
    backgroundPattern: 'grid',
  },

  // Neon gradient: dark -> cyan -> magenta
  graphColors: ['#1a0033', '#6b46c1', '#00ffff', '#ff00ff', '#00d9ff'],
};
