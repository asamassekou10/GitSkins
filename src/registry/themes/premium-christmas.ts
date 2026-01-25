/**
 * Christmas Theme - Holiday Spirit
 *
 * Vibe: Festive, cozy, red and green
 * Font: Mountains of Christmas (festive)
 * Effects: Sparkle glow, ornament patterns
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const christmasPremiumTheme: PremiumTheme = {
  name: 'christmas',
  label: 'Christmas (Festive)',

  colors: {
    bg: 'linear-gradient(165deg, #14532d 0%, #166534 40%, #0f172a 100%)',
    cardBg: 'rgba(22, 101, 52, 0.5)',
    border: 'rgba(239, 68, 68, 0.5)',
    primary: '#fef2f2',
    secondary: '#fca5a5',
    accent: '#ef4444',
    ring: 'rgba(239, 68, 68, 0.6)',
  },

  font: {
    family: 'Mountains of Christmas',
    url: 'https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap',
    weight: 700,
  },

  effects: {
    textGlow: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)',
    cardShadow: '0 8px 32px rgba(239, 68, 68, 0.3), 0 4px 16px rgba(0, 0, 0, 0.4)',
    backgroundPattern: 'christmas',
  },

  graphColors: ['#14532d', '#166534', '#22c55e', '#ef4444', '#dc2626', '#fef2f2'],
};
