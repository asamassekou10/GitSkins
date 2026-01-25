/**
 * Ocean Theme - Deep Sea
 *
 * Vibe: Underwater, calm, deep blues
 * Font: Outfit (clean, modern)
 * Effects: Wave patterns, water glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const oceanPremiumTheme: PremiumTheme = {
  name: 'ocean',
  label: 'Ocean (Deep Sea)',

  colors: {
    bg: 'linear-gradient(165deg, #0c4a6e 0%, #075985 40%, #0369a1 100%)',
    cardBg: 'rgba(7, 89, 133, 0.5)',
    border: 'rgba(56, 189, 248, 0.4)',
    primary: '#e0f2fe',
    secondary: '#7dd3fc',
    accent: '#38bdf8',
    ring: 'rgba(56, 189, 248, 0.6)',
  },

  font: {
    family: 'Outfit',
    url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 20px rgba(56, 189, 248, 0.5)',
    cardShadow: '0 8px 32px rgba(14, 165, 233, 0.3), 0 4px 16px rgba(0, 0, 0, 0.4)',
    backgroundPattern: 'waves',
  },

  graphColors: ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc'],
};
