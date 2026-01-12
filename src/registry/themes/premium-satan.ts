/**
 * Satan Theme - The Hellfire Aesthetic
 *
 * Vibe: Diablo IV, Doom, Gothic, Infernal
 * Font: UnifrakturMaguntia (Gothic blackletter)
 * Effects: Red glow, flame patterns, double borders
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const satanPremiumTheme: PremiumTheme = {
  name: 'satan',
  label: 'Satan (Hellfire)',

  colors: {
    // Hellfire gradient - Deep blacks to blood red
    bg: 'linear-gradient(165deg, #000000 0%, #1a0000 30%, #0d0000 70%, #000000 100%)',
    cardBg: 'rgba(40, 0, 0, 0.5)', // Darker semi-transparent for better depth
    border: 'rgba(255, 69, 0, 0.4)', // Orange-red border glow
    primary: '#ff6b35', // Vibrant flame orange
    secondary: '#ff8c61', // Lighter coral orange
    accent: '#ff4500', // Bright orange-red
    ring: 'rgba(255, 69, 0, 0.8)', // Orange-red glow
  },

  font: {
    family: 'UnifrakturMaguntia',
    url: 'https://fonts.googleapis.com/css2?family=Unifraktur+Maguntia&display=swap',
    weight: 400,
  },

  effects: {
    // Enhanced multi-layered glow
    textGlow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 69, 0, 0.4)',
    cardShadow: '0 8px 32px rgba(255, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.6)',
    backgroundPattern: 'flames',
  },

  // More vibrant progression: Deep Red -> Red -> Orange-Red -> Flame Orange -> Hot Orange -> White
  graphColors: ['#2d0000', '#660000', '#cc0000', '#ff4500', '#ff8c00', '#ffffff'],
};
