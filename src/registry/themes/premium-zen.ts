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
    // Subtle gradient from warm paper to natural beige
    bg: 'linear-gradient(180deg, #fdfbf7 0%, #f5f1e8 50%, #ebe6d9 100%)',
    cardBg: 'rgba(250, 250, 230, 0.7)', // Semi-transparent for layering
    border: 'rgba(212, 197, 169, 0.6)', // Soft tan border
    primary: '#2b2d42', // Charcoal text
    secondary: '#6c757d', // Warm gray
    accent: '#84a59d', // Sage green
    ring: 'rgba(132, 165, 157, 0.6)', // Sage green with transparency
  },

  font: {
    family: 'Lora',
    url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap',
    weight: 400,
  },

  effects: {
    // Subtle shadow for depth without breaking zen aesthetic
    textGlow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    cardShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)',
    backgroundPattern: 'enso',
  },

  // Enhanced matcha green progression: Light Mint -> Matcha -> Forest Green -> Deep Forest
  graphColors: ['#e8f5e9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#2d5016'],
};
