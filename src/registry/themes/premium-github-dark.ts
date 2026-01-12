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
    // GitHub dark gradient - Deep navy blacks
    bg: 'linear-gradient(165deg, #0d1117 0%, #161b22 30%, #0d1117 70%, #010409 100%)',
    cardBg: 'rgba(22, 27, 34, 0.7)', // Authentic GitHub card background
    border: 'rgba(88, 166, 255, 0.3)', // Subtle blue border
    primary: '#e6edf3', // Brighter white for better contrast
    secondary: '#8b949e', // GitHub gray
    accent: '#58a6ff', // Signature GitHub blue
    ring: 'rgba(88, 166, 255, 0.7)', // Blue glow
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
