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
    // Subtle gradient maintaining GitHub's aesthetic
    bg: 'linear-gradient(180deg, #0d1117 0%, #0d1117 50%, #010409 100%)',
    cardBg: 'rgba(22, 27, 34, 0.8)', // Semi-transparent for modern feel
    border: 'rgba(48, 54, 61, 0.8)', // GitHub border with slight transparency
    primary: '#c9d1d9', // Silver text
    secondary: '#8b949e', // Medium gray
    accent: '#58a6ff', // GitHub blue accent
    ring: 'rgba(88, 166, 255, 0.6)', // Blue glow
  },

  font: {
    family: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    weight: 400,
  },

  effects: {
    // Enhanced subtle shadows for depth
    textGlow: '0 0 10px rgba(88, 166, 255, 0.2)',
    cardShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px #30363d',
    backgroundPattern: 'none',
  },

  // GitHub 2025 contribution greens with better progression
  graphColors: ['#0e4429', '#006d32', '#26a641', '#39d353', '#7ee787', '#00ff00'],
};
