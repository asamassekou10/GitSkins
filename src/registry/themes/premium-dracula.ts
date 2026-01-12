/**
 * Dracula Theme - The Coding Classic
 *
 * Vibe: Vampire, IDE Theme, Purple/Green
 * Font: Fira Code (monospace with ligatures)
 * Effects: Sharp contrast, vibrant colors on dark grey
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const draculaPremiumTheme: PremiumTheme = {
  name: 'dracula',
  label: 'Dracula',

  colors: {
    // Dracula gradient - Deep blues and teals
    bg: 'linear-gradient(165deg, #1a1d2e 0%, #16192a 30%, #121420 70%, #0d0f1a 100%)',
    cardBg: 'rgba(26, 29, 46, 0.6)', // Deep blue background
    border: 'rgba(56, 189, 248, 0.4)', // Cyan border glow
    primary: '#f8f8f2', // Crisp white
    secondary: '#94a3b8', // Slate gray
    accent: '#38bdf8', // Sky blue
    ring: 'rgba(56, 189, 248, 0.8)', // Cyan glow
  },

  font: {
    family: 'Fira Code',
    url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    // Enhanced cyan/blue glow
    textGlow: '0 0 20px rgba(56, 189, 248, 0.5), 0 0 40px rgba(14, 165, 233, 0.3)',
    cardShadow: '0 8px 32px rgba(56, 189, 248, 0.3), 0 4px 16px rgba(0, 0, 0, 0.6)',
    backgroundPattern: 'dots',
  },

  // Modern blue spectrum: Dark Slate -> Blue Gray -> Sky Blue -> Cyan -> Teal -> Emerald
  graphColors: ['#1e293b', '#475569', '#38bdf8', '#22d3ee', '#14b8a6', '#10b981'],
};
