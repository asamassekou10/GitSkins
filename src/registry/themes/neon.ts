/**
 * Neon Theme
 * 
 * Cyberpunk-inspired theme with deep purple background
 * and cyan/neon accents.
 */

import type { Theme } from '@/types';

export const neonTheme: Theme = {
  bg: '#1a0033',
  borderColor: '#6b46c1',
  primaryText: '#00ffff',
  secondaryText: '#00d9ff',
  accentColor: '#00ffff',
  fireColors: ['#1a0033', '#6b46c1', '#00ffff'],
} as const;
