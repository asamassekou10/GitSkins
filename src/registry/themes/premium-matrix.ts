/**
 * Matrix Theme - Digital Rain
 *
 * Vibe: The Matrix, code rain, hacker aesthetic
 * Font: Share Tech Mono (monospace, techy)
 * Effects: Code rain, green glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const matrixPremiumTheme: PremiumTheme = {
  name: 'matrix',
  label: 'Matrix (Code Rain)',

  colors: {
    bg: 'linear-gradient(165deg, #000000 0%, #001a00 40%, #000000 100%)',
    cardBg: 'rgba(0, 26, 0, 0.6)',
    border: 'rgba(34, 197, 94, 0.4)',
    primary: '#22c55e',
    secondary: '#4ade80',
    accent: '#00ff00',
    ring: 'rgba(0, 255, 0, 0.5)',
  },

  font: {
    family: 'Share Tech Mono',
    url: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 10px rgba(0, 255, 0, 0.8), 0 0 30px rgba(34, 197, 94, 0.5)',
    cardShadow: '0 8px 32px rgba(0, 255, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.6)',
    backgroundPattern: 'rain',
  },

  graphColors: ['#001a00', '#003300', '#004d00', '#006600', '#22c55e', '#00ff00'],
};
