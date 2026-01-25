/**
 * Summer Theme - Golden Hour
 *
 * Vibe: Sunset beach, warm vibes, tropical
 * Font: Poppins (modern, geometric)
 * Effects: Warm glow, sun rays
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const summerPremiumTheme: PremiumTheme = {
  name: 'summer',
  label: 'Summer (Sunset)',

  colors: {
    bg: 'linear-gradient(165deg, #7c2d12 0%, #c2410c 30%, #ea580c 60%, #fb923c 100%)',
    cardBg: 'rgba(124, 45, 18, 0.5)',
    border: 'rgba(251, 146, 60, 0.4)',
    primary: '#fef3c7',
    secondary: '#fde68a',
    accent: '#fbbf24',
    ring: 'rgba(251, 191, 36, 0.6)',
  },

  font: {
    family: 'Poppins',
    url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&display=swap',
    weight: 500,
  },

  effects: {
    textGlow: '0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 146, 60, 0.3)',
    cardShadow: '0 8px 32px rgba(234, 88, 12, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)',
    backgroundPattern: 'sunrays',
  },

  graphColors: ['#7c2d12', '#c2410c', '#ea580c', '#f97316', '#fb923c', '#fef3c7'],
};
