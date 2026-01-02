/**
 * GitHub Dark Theme - The Pro Standard
 *
 * Vibe: Native, Official, Invisible
 * Font: Inter (standard sans-serif)
 * Effects: Clean minimalism, exact GitHub colors
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const githubDarkPremiumTheme: PremiumTheme = {
  name: 'github-dark',
  label: 'GitHub Dark',

  colors: {
    bg: '#0d1117', // Exact GitHub Dark background
    cardBg: '#161b22',
    border: '#30363d', // Exact GitHub border
    primary: '#c9d1d9', // Silver text
    secondary: '#8b949e',
    accent: '#58a6ff', // Blue accent
    ring: '#58a6ff',
  },

  font: {
    family: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    weight: 400,
  },

  effects: {
    cardShadow: '0 0 0 1px #30363d',
    backgroundPattern: 'none',
  },

  // GitHub contribution greens
  graphColors: ['#0e4429', '#006d32', '#26a641', '#39d353', '#00ff00'],
};
