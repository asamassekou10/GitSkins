/**
 * Zen Theme - The Japanese Garden
 *
 * Vibe: Organic, Paper, Calm, Nature
 * Font: Kaushan Script (handwritten) for headers, Lora for body
 * Effects: No shadows, flat, clean, paper-texture feel
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const zenPremiumTheme: PremiumTheme = {
  name: 'zen',
  label: 'Zen (Japanese Garden)',

  colors: {
    bg: '#fdfbf7', // Warm rice paper
    cardBg: '#fafae6',
    border: '#d4c5a9',
    primary: '#2b2d42', // Charcoal text
    secondary: '#6c757d',
    accent: '#84a59d', // Sage green
    ring: '#84a59d',
  },

  font: {
    family: 'Lora',
    url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap',
    weight: 400,
  },

  effects: {
    // No shadows - flat design
    backgroundPattern: 'enso',
  },

  // Matcha green shades
  graphColors: ['#e8f5e9', '#81c784', '#66bb6a', '#4caf50', '#2d5016'],
};
