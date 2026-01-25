/**
 * Winter Theme - Frozen Elegance
 *
 * Vibe: Arctic frost, snowfall, ice crystals
 * Font: Quicksand (soft, modern)
 * Effects: Blue glow, snowflake patterns
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const winterPremiumTheme: PremiumTheme = {
  name: 'winter',
  label: 'Winter (Frozen)',

  colors: {
    bg: 'linear-gradient(165deg, #0f172a 0%, #1e3a5f 40%, #0c1929 100%)',
    cardBg: 'rgba(30, 58, 95, 0.4)',
    border: 'rgba(147, 197, 253, 0.3)',
    primary: '#e0f2fe',
    secondary: '#93c5fd',
    accent: '#60a5fa',
    ring: 'rgba(96, 165, 250, 0.6)',
  },

  font: {
    family: 'Quicksand',
    url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap',
    weight: 500,
  },

  effects: {
    textGlow: '0 0 20px rgba(147, 197, 253, 0.5), 0 0 40px rgba(96, 165, 250, 0.3)',
    cardShadow: '0 8px 32px rgba(96, 165, 250, 0.2), 0 4px 16px rgba(0, 0, 0, 0.4)',
    backgroundPattern: 'snowflakes',
  },

  graphColors: ['#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#e0f2fe'],
};
