/**
 * Retro Theme - Synthwave
 *
 * Vibe: 80s vaporwave, neon pink and cyan
 * Font: Orbitron (futuristic retro)
 * Effects: Grid patterns, neon glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const retroPremiumTheme: PremiumTheme = {
  name: 'retro',
  label: 'Retro (Synthwave)',

  colors: {
    bg: 'linear-gradient(165deg, #0c0a09 0%, #1f1f3d 40%, #2d1b4e 100%)',
    cardBg: 'rgba(31, 31, 61, 0.6)',
    border: 'rgba(236, 72, 153, 0.5)',
    primary: '#fce7f3',
    secondary: '#f9a8d4',
    accent: '#ec4899',
    ring: 'rgba(236, 72, 153, 0.6)',
  },

  font: {
    family: 'Orbitron',
    url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 20px rgba(236, 72, 153, 0.7), 0 0 40px rgba(34, 211, 238, 0.5)',
    cardShadow: '0 8px 32px rgba(236, 72, 153, 0.3), 0 4px 16px rgba(0, 0, 0, 0.5)',
    backgroundPattern: 'synthwave',
  },

  graphColors: ['#1f1f3d', '#7c3aed', '#a855f7', '#ec4899', '#f472b6', '#22d3ee'],
};
