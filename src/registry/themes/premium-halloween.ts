/**
 * Halloween Theme - Spooky Night
 *
 * Vibe: Haunted, eerie, purple and orange
 * Font: Creepster (spooky)
 * Effects: Eerie glow, pumpkin patterns
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const halloweenPremiumTheme: PremiumTheme = {
  name: 'halloween',
  label: 'Halloween (Spooky)',

  colors: {
    bg: 'linear-gradient(165deg, #0c0a09 0%, #1c1917 30%, #2e1065 100%)',
    cardBg: 'rgba(46, 16, 101, 0.5)',
    border: 'rgba(249, 115, 22, 0.5)',
    primary: '#fed7aa',
    secondary: '#fdba74',
    accent: '#f97316',
    ring: 'rgba(249, 115, 22, 0.6)',
  },

  font: {
    family: 'Creepster',
    url: 'https://fonts.googleapis.com/css2?family=Creepster&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 20px rgba(249, 115, 22, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)',
    cardShadow: '0 8px 32px rgba(168, 85, 247, 0.3), 0 4px 16px rgba(0, 0, 0, 0.5)',
    backgroundPattern: 'pumpkins',
  },

  graphColors: ['#1c1917', '#581c87', '#7c3aed', '#f97316', '#fb923c', '#fed7aa'],
};
