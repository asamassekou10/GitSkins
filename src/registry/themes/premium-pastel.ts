/**
 * Pastel Theme - Soft & Friendly
 *
 * Vibe: Soft colors, approachable, friendly
 * Font: Comfortaa (rounded, friendly)
 * Effects: Bubble patterns, soft glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const pastelPremiumTheme: PremiumTheme = {
  name: 'pastel',
  label: 'Pastel (Soft)',

  colors: {
    bg: 'linear-gradient(165deg, #faf5ff 0%, #fdf2f8 50%, #eff6ff 100%)',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(196, 181, 253, 0.4)',
    primary: '#4c1d95',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    ring: 'rgba(167, 139, 250, 0.5)',
  },

  font: {
    family: 'Comfortaa',
    url: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 15px rgba(167, 139, 250, 0.3)',
    cardShadow: '0 8px 32px rgba(167, 139, 250, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05)',
    backgroundPattern: 'bubbles',
  },

  graphColors: ['#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed'],
};
