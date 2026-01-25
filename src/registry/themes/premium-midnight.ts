/**
 * Midnight Theme - Starry Night
 *
 * Vibe: Deep space, stars, mysterious
 * Font: Space Grotesk (futuristic)
 * Effects: Star patterns, cosmic glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const midnightPremiumTheme: PremiumTheme = {
  name: 'midnight',
  label: 'Midnight (Cosmic)',

  colors: {
    bg: 'linear-gradient(165deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)',
    cardBg: 'rgba(15, 23, 42, 0.6)',
    border: 'rgba(129, 140, 248, 0.4)',
    primary: '#e0e7ff',
    secondary: '#a5b4fc',
    accent: '#818cf8',
    ring: 'rgba(129, 140, 248, 0.6)',
  },

  font: {
    family: 'Space Grotesk',
    url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 20px rgba(129, 140, 248, 0.5), 0 0 40px rgba(99, 102, 241, 0.3)',
    cardShadow: '0 8px 32px rgba(99, 102, 241, 0.2), 0 4px 16px rgba(0, 0, 0, 0.5)',
    backgroundPattern: 'stars',
  },

  graphColors: ['#020617', '#1e1b4b', '#3730a3', '#4f46e5', '#6366f1', '#a5b4fc'],
};
