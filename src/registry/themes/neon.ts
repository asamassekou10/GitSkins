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
  cardBg: '#2d1b4e',
  progressBg: '#3d2662',
  streakColors: {
    fire: '#00ffff',
    trophy: '#ff00ff',
    calendar: '#00d9ff',
  },
} as const;
