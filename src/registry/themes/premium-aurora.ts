/**
 * Aurora Theme - Northern Lights
 *
 * Vibe: Arctic aurora borealis, magical, colorful
 * Font: Rubik (modern, geometric)
 * Effects: Aurora waves, multicolor glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const auroraPremiumTheme: PremiumTheme = {
  name: 'aurora',
  label: 'Aurora (Northern Lights)',

  colors: {
    bg: 'linear-gradient(165deg, #042f2e 0%, #134e4a 30%, #0f766e 60%, #14b8a6 100%)',
    cardBg: 'rgba(19, 78, 74, 0.5)',
    border: 'rgba(45, 212, 191, 0.4)',
    primary: '#ccfbf1',
    secondary: '#5eead4',
    accent: '#2dd4bf',
    ring: 'rgba(45, 212, 191, 0.6)',
  },

  font: {
    family: 'Rubik',
    url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 20px rgba(45, 212, 191, 0.5), 0 0 40px rgba(34, 211, 238, 0.3)',
    cardShadow: '0 8px 32px rgba(20, 184, 166, 0.3), 0 4px 16px rgba(0, 0, 0, 0.4)',
    backgroundPattern: 'northern-lights',
  },

  graphColors: ['#042f2e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
};
