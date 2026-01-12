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
    // Cyberpunk gradient - Deep purples to electric blues
    bg: 'linear-gradient(165deg, #0a0014 0%, #1a0033 30%, #09090b 70%, #000000 100%)',
    cardBg: 'rgba(26, 0, 51, 0.5)', // Deep purple semi-transparent
    border: 'rgba(0, 217, 255, 0.5)', // Bright cyan border
    primary: '#00d9ff', // Bright electric cyan
    secondary: '#5bf0ff', // Lighter cyan
    accent: '#ff00ff', // Vivid magenta
    ring: 'rgba(0, 217, 255, 0.9)', // Cyan glow
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
