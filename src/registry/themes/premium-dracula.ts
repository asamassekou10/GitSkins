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
    bg: '#282a36', // Dracula background
    cardBg: '#21222c',
    border: '#44475a', // Dracula current line
    primary: '#f8f8f2', // Dracula foreground
    secondary: '#6272a4', // Dracula comment
    accent: '#bd93f9', // Dracula purple
    ring: '#ff79c6', // Dracula pink
  },

  font: {
    family: 'Fira Code',
    url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    cardShadow: '0 4px 12px rgba(189, 147, 249, 0.15)',
    backgroundPattern: 'dots',
  },

  // Dracula spectrum: purple -> pink -> green
  graphColors: ['#6272a4', '#bd93f9', '#ff79c6', '#50fa7b', '#f1fa8c'],
};
