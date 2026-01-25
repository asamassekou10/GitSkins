/**
 * Minimal Theme - Clean & Modern
 *
 * Vibe: Simple, clean, professional grayscale
 * Font: Inter (clean, universal)
 * Effects: Subtle shadows, clean lines
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const minimalPremiumTheme: PremiumTheme = {
  name: 'minimal',
  label: 'Minimal (Clean)',

  colors: {
    bg: 'linear-gradient(165deg, #ffffff 0%, #f8fafc 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(148, 163, 184, 0.3)',
    primary: '#0f172a',
    secondary: '#475569',
    accent: '#334155',
    ring: 'rgba(51, 65, 85, 0.4)',
  },

  font: {
    family: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: 'none',
    cardShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
    backgroundPattern: 'minimal-dots',
  },

  graphColors: ['#f1f5f9', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'],
};
