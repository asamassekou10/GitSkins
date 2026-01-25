/**
 * Sunset Theme - Twilight
 *
 * Vibe: Romantic sunset, pink and purple gradients
 * Font: DM Sans (elegant, modern)
 * Effects: Cloud patterns, warm glow
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const sunsetPremiumTheme: PremiumTheme = {
  name: 'sunset',
  label: 'Sunset (Twilight)',

  colors: {
    bg: 'linear-gradient(165deg, #581c87 0%, #be185d 50%, #f97316 100%)',
    cardBg: 'rgba(88, 28, 135, 0.5)',
    border: 'rgba(251, 146, 60, 0.4)',
    primary: '#fdf4ff',
    secondary: '#f5d0fe',
    accent: '#e879f9',
    ring: 'rgba(232, 121, 249, 0.6)',
  },

  font: {
    family: 'DM Sans',
    url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 20px rgba(232, 121, 249, 0.5), 0 0 40px rgba(249, 115, 22, 0.3)',
    cardShadow: '0 8px 32px rgba(190, 24, 93, 0.3), 0 4px 16px rgba(0, 0, 0, 0.4)',
    backgroundPattern: 'clouds',
  },

  graphColors: ['#581c87', '#7c3aed', '#a855f7', '#d946ef', '#f472b6', '#fb923c'],
};
