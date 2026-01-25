/**
 * Forest Theme - Woodland
 *
 * Vibe: Deep forest, nature, earthy greens
 * Font: Source Sans 3 (natural, readable)
 * Effects: Tree patterns, forest glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const forestPremiumTheme: PremiumTheme = {
  name: 'forest',
  label: 'Forest (Woodland)',

  colors: {
    bg: 'linear-gradient(165deg, #14532d 0%, #166534 40%, #15803d 100%)',
    cardBg: 'rgba(22, 101, 52, 0.5)',
    border: 'rgba(74, 222, 128, 0.4)',
    primary: '#dcfce7',
    secondary: '#86efac',
    accent: '#4ade80',
    ring: 'rgba(74, 222, 128, 0.6)',
  },

  font: {
    family: 'Source Sans 3',
    url: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 15px rgba(74, 222, 128, 0.4)',
    cardShadow: '0 8px 32px rgba(34, 197, 94, 0.25), 0 4px 16px rgba(0, 0, 0, 0.4)',
    backgroundPattern: 'trees',
  },

  graphColors: ['#14532d', '#166534', '#15803d', '#22c55e', '#4ade80', '#86efac'],
};
