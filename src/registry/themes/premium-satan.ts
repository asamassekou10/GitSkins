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
    // Modern linear gradient with deeper blacks and vibrant reds
    bg: 'linear-gradient(180deg, #0a0000 0%, #1a0000 50%, #000000 100%)',
    cardBg: 'rgba(26, 0, 0, 0.6)', // Semi-transparent for glassmorphism
    border: 'rgba(255, 0, 0, 0.5)', // Semi-transparent border
    primary: '#ff4500', // Bright flame orange
    secondary: '#ff6b35', // Softer orange
    accent: '#ff0000', // Pure red
    ring: 'rgba(255, 0, 0, 0.8)', // Red glow with transparency
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
