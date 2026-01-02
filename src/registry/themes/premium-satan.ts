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
    // Deep radial gradient from dark red to black (pit of fire)
    bg: 'radial-gradient(circle at 50% 100%, #3d0000 0%, #000000 100%)',
    cardBg: '#1a0000',
    border: '#ff0000',
    primary: '#ff4500', // Bright flame orange
    secondary: '#ff6b35', // Softer orange
    accent: '#ff0000', // Pure red
    ring: '#ff0000', // Red glow
  },

  font: {
    family: 'UnifrakturMaguntia',
    url: 'https://fonts.googleapis.com/css2?family=Unifraktur+Maguntia&display=swap',
    weight: 400,
  },

  effects: {
    textGlow: '0 0 15px #ff0000',
    cardShadow: '0 0 30px rgba(255, 0, 0, 0.3), inset 0 0 20px rgba(255, 69, 0, 0.1)',
    backgroundPattern: 'flames',
  },

  // Dark Red -> Bright Orange -> White Hot
  graphColors: ['#3d0000', '#990000', '#ff4500', '#ff6b35', '#ffffff'],
};
