/**
 * GitHub Dark Theme
 *
 * Official GitHub dark mode color palette.
 * Clean, professional look matching GitHub's native dark experience.
 */

import type { Theme } from '@/types';

export const githubDarkTheme: Theme = {
  // GitHub dark mode background
  bg: '#0d1117',
  // GitHub dark border color
  borderColor: '#30363d',
  // GitHub primary text in dark mode
  primaryText: '#e6edf3',
  // GitHub secondary/muted text
  secondaryText: '#8b949e',
  // GitHub accent green (contribution color)
  accentColor: '#238636',
  // GitHub contribution graph greens
  fireColors: ['#0e4429', '#006d32', '#26a641'],
  // Card background slightly lighter
  cardBg: '#161b22',
  // Progress bar background
  progressBg: '#21262d',
  // Streak icon colors
  streakColors: {
    fire: '#f78166',    // GitHub orange for current streak
    trophy: '#e3b341',  // GitHub gold for achievements
    calendar: '#26a641', // GitHub green for activity
  },
} as const;
