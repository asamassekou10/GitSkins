/**
 * Dracula Theme
 *
 * The famous Dracula dark theme color palette.
 * Vibrant colors on dark background, popular among developers.
 */

import type { Theme } from '@/types';

export const draculaTheme: Theme = {
  // Dracula background
  bg: '#282a36',
  // Dracula current line / selection
  borderColor: '#44475a',
  // Dracula foreground
  primaryText: '#f8f8f2',
  // Dracula comment gray
  secondaryText: '#6272a4',
  // Dracula pink (signature color)
  accentColor: '#ff79c6',
  // Dracula contribution colors: purple -> pink -> cyan
  fireColors: ['#6272a4', '#bd93f9', '#ff79c6'],
  // Card background (slightly lighter)
  cardBg: '#21222c',
  // Progress bar background
  progressBg: '#44475a',
  // Streak icon colors using Dracula palette
  streakColors: {
    fire: '#ffb86c',   // Dracula orange
    trophy: '#f1fa8c', // Dracula yellow
    calendar: '#50fa7b', // Dracula green
  },
  iconColor: '#bd93f9', // Dracula purple
} as const;
