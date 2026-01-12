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
    // Organic paper gradient - Warm ivory to soft beige
    bg: 'linear-gradient(165deg, #fffef9 0%, #f5f1e8 30%, #ebe6d9 70%, #e8e3d6 100%)',
    cardBg: 'rgba(250, 248, 240, 0.8)', // Lighter ivory for better layering
    border: 'rgba(132, 165, 157, 0.4)', // Soft sage border
    primary: '#1a1c28', // Deeper charcoal for contrast
    secondary: '#557c6a', // Muted forest green
    accent: '#66bb6a', // Fresh matcha green
    ring: 'rgba(102, 187, 106, 0.5)', // Matcha green glow
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
