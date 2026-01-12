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
    // Dracula gradient - Deep purples and grays
    bg: 'linear-gradient(165deg, #282a36 0%, #21222c 30%, #191a21 70%, #15161d 100%)',
    cardBg: 'rgba(40, 42, 54, 0.6)', // Classic Dracula background
    border: 'rgba(189, 147, 249, 0.4)', // Purple border glow
    primary: '#f8f8f2', // Dracula white
    secondary: '#a0a6bb', // Lighter comment color
    accent: '#ff79c6', // Dracula hot pink
    ring: 'rgba(255, 121, 198, 0.8)', // Pink glow
  },

  font: {
    family: 'Fira Code',
    url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap',
    weight: 400,
  },

  effects: {
    // Enhanced purple/pink glow
    textGlow: '0 0 20px rgba(189, 147, 249, 0.4), 0 0 40px rgba(255, 121, 198, 0.3)',
    cardShadow: '0 8px 32px rgba(189, 147, 249, 0.3), 0 4px 16px rgba(0, 0, 0, 0.6)',
    backgroundPattern: 'dots',
  },

  // Enhanced Dracula spectrum: Gray-Blue -> Blue -> Purple -> Pink -> Green -> Yellow
  graphColors: ['#44475a', '#6272a4', '#bd93f9', '#ff79c6', '#50fa7b', '#f1fa8c'],
};
