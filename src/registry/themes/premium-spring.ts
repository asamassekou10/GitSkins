/**
 * Spring Theme - Cherry Blossom
 *
 * Vibe: Japanese spring, sakura petals, renewal
 * Font: Nunito (friendly, rounded)
 * Effects: Pink glow, floating petals
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const springPremiumTheme: PremiumTheme = {
  name: 'spring',
  label: 'Spring (Sakura)',

  colors: {
    bg: 'linear-gradient(165deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)',
    cardBg: 'rgba(253, 242, 248, 0.7)',
    border: 'rgba(244, 114, 182, 0.3)',
    primary: '#831843',
    secondary: '#be185d',
    accent: '#ec4899',
    ring: 'rgba(236, 72, 153, 0.5)',
  },

  font: {
    family: 'Nunito',
    url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@500;700&display=swap',
    weight: 500,
  },

  effects: {
    textGlow: '0 0 15px rgba(244, 114, 182, 0.4)',
    cardShadow: '0 8px 32px rgba(236, 72, 153, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
    backgroundPattern: 'blossoms',
  },

  graphColors: ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777'],
};
