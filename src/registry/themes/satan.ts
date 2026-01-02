/**
 * Satan Theme
 * 
 * Dark theme optimized for GitHub Dark Mode (#0d1117 background).
 * Features red/orange fire colors for contribution graph.
 */

import type { Theme } from '@/types';

export const satanTheme: Theme = {
  bg: '#0d1117',
  borderColor: '#30363d',
  primaryText: '#ff4500',
  secondaryText: '#ff6b35',
  accentColor: '#ff4500',
  fireColors: ['#3d0000', '#990000', '#ff4500'],
  cardBg: '#161b22',
  progressBg: '#21262d',
  streakColors: {
    fire: '#ff4500',
    trophy: '#ffd700',
    calendar: '#ff6b35',
  },
} as const;
