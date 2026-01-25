/**
 * Autumn Theme - Falling Leaves
 *
 * Vibe: Cozy fall, warm browns, golden leaves
 * Font: Merriweather (classic, readable)
 * Effects: Warm glow, leaf patterns
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const autumnPremiumTheme: PremiumTheme = {
  name: 'autumn',
  label: 'Autumn (Harvest)',

  colors: {
    bg: 'linear-gradient(165deg, #1c1917 0%, #44403c 40%, #292524 100%)',
    cardBg: 'rgba(68, 64, 60, 0.5)',
    border: 'rgba(217, 119, 6, 0.4)',
    primary: '#fef3c7',
    secondary: '#fcd34d',
    accent: '#d97706',
    ring: 'rgba(217, 119, 6, 0.6)',
  },

  font: {
    family: 'Merriweather',
    url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 15px rgba(217, 119, 6, 0.4)',
    cardShadow: '0 8px 32px rgba(217, 119, 6, 0.2), 0 4px 16px rgba(0, 0, 0, 0.5)',
    backgroundPattern: 'leaves',
  },

  graphColors: ['#292524', '#78350f', '#92400e', '#b45309', '#d97706', '#fbbf24'],
};
