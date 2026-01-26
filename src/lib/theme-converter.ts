/**
 * Theme Converter
 *
 * Converts premium themes to basic theme format for widget compatibility.
 */

import type { Theme } from '@/types';
import type { PremiumTheme } from '@/types/premium-theme';
import { getPremiumTheme, premiumThemeExists } from '@/registry/themes/premium-registry';

/**
 * Extract solid color from gradient or color string
 */
function extractSolidColor(colorValue: string): string {
  // If it's a gradient, extract the first color
  if (colorValue.includes('gradient')) {
    const match = colorValue.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/);
    return match ? match[0] : '#0d1117';
  }
  // If it's rgba, convert to hex approximation
  if (colorValue.startsWith('rgba')) {
    const match = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }
  return colorValue;
}

/**
 * Convert premium theme to basic Theme format for widgets
 */
export function premiumToBasicTheme(premiumTheme: PremiumTheme): Theme {
  const graphColors = premiumTheme.graphColors;

  // Extract fire colors from graph colors (low, medium, high)
  const fireColors: [string, string, string] = [
    graphColors[1] || graphColors[0] || '#2d0000',
    graphColors[Math.floor(graphColors.length / 2)] || '#ff4500',
    graphColors[graphColors.length - 2] || graphColors[graphColors.length - 1] || '#ff8c00',
  ];

  return {
    bg: extractSolidColor(premiumTheme.colors.bg),
    borderColor: extractSolidColor(premiumTheme.colors.border),
    primaryText: premiumTheme.colors.primary,
    secondaryText: premiumTheme.colors.secondary,
    accentColor: premiumTheme.colors.accent,
    fireColors,
    cardBg: extractSolidColor(premiumTheme.colors.cardBg),
    progressBg: `${premiumTheme.colors.accent}30`,
    streakColors: {
      fire: premiumTheme.colors.accent,
      trophy: premiumTheme.colors.primary,
      calendar: premiumTheme.colors.secondary,
    },
    iconColor: premiumTheme.colors.accent,
  };
}

/**
 * Get a theme by name, supporting both basic and premium themes
 * Returns a basic Theme format suitable for widgets
 */
export function getThemeUniversal(themeName: string = 'satan'): Theme {
  const normalized = themeName.toLowerCase();

  // Check if it's a premium theme
  if (premiumThemeExists(normalized)) {
    const premiumTheme = getPremiumTheme(normalized);
    return premiumToBasicTheme(premiumTheme);
  }

  // Fallback to satan
  const satanTheme = getPremiumTheme('satan');
  return premiumToBasicTheme(satanTheme);
}
