/**
 * Zen Theme
 * 
 * Minimalist theme with soft beige background
 * and natural green tones.
 */

import type { Theme } from '@/types';

export const zenTheme: Theme = {
  bg: '#f5f5dc',
  borderColor: '#d4c5a9',
  primaryText: '#2d5016',
  secondaryText: '#4a7c2a',
  accentColor: '#4a7c2a',
  fireColors: ['#e8f5e9', '#81c784', '#2d5016'],
  cardBg: '#fafae6',
  progressBg: '#e8e8d4',
  streakColors: {
    fire: '#2d5016',
    trophy: '#8b7355',
    calendar: '#4a7c2a',
  },
} as const;
