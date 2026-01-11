/**
 * Neon Theme - The Cyberpunk HUD
 *
 * Vibe: Tron, Blade Runner, High-Tech
 * Font: JetBrains Mono (Monospace, tech aesthetic)
 * Effects: Outer glow, grid pattern, hot pink and cyan
 */

import type { PremiumTheme } from '@/types/premium-theme';

export const neonPremiumTheme: PremiumTheme = {
  name: 'neon',
  label: 'Neon (Cyberpunk)',

  colors: {
    // Linear gradient with deep blacks and electric blue accents
    bg: 'linear-gradient(180deg, #0a0a12 0%, #09090b 50%, #000000 100%)',
    cardBg: 'rgba(24, 24, 27, 0.6)', // Semi-transparent for glassmorphism
    border: 'rgba(0, 255, 255, 0.5)', // Semi-transparent cyan border
    primary: '#00ffff', // Electric cyan
    secondary: '#00d9ff', // Bright cyan
    accent: '#ff00ff', // Hot pink/magenta
    ring: 'rgba(0, 255, 255, 0.8)', // Cyan glow
  },

  font: {
    family: 'JetBrains Mono',
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
    weight: 400,
  },

  effects: {
    // Enhanced multi-layered glow with cyan and magenta
    textGlow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.4)',
    cardShadow: '0 8px 32px rgba(0, 255, 255, 0.4), 0 4px 16px rgba(0, 0, 0, 0.6)',
    backgroundPattern: 'grid',
  },

  // Enhanced progression: Deep Purple -> Purple -> Blue -> Cyan -> Magenta -> Electric Blue
  graphColors: ['#1a0033', '#4a148c', '#6b46c1', '#00ffff', '#ff00ff', '#00d9ff'],
};
