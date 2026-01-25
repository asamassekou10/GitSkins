/**
 * Premium Theme Registry
 *
 * Central registry for all 20 premium themes with rich visual designs.
 */

import type { PremiumTheme, PremiumThemeName } from '@/types/premium-theme';

// Original themes
import { satanPremiumTheme } from './premium-satan';
import { neonPremiumTheme } from './premium-neon';
import { zenPremiumTheme } from './premium-zen';
import { githubDarkPremiumTheme } from './premium-github-dark';
import { draculaPremiumTheme } from './premium-dracula';

// Seasonal themes
import { winterPremiumTheme } from './premium-winter';
import { springPremiumTheme } from './premium-spring';
import { summerPremiumTheme } from './premium-summer';
import { autumnPremiumTheme } from './premium-autumn';

// Holiday themes
import { christmasPremiumTheme } from './premium-christmas';
import { halloweenPremiumTheme } from './premium-halloween';

// Developer themes
import { oceanPremiumTheme } from './premium-ocean';
import { forestPremiumTheme } from './premium-forest';
import { sunsetPremiumTheme } from './premium-sunset';
import { midnightPremiumTheme } from './premium-midnight';
import { auroraPremiumTheme } from './premium-aurora';

// Aesthetic themes
import { retroPremiumTheme } from './premium-retro';
import { minimalPremiumTheme } from './premium-minimal';
import { pastelPremiumTheme } from './premium-pastel';
import { matrixPremiumTheme } from './premium-matrix';

/**
 * Premium theme registry map
 */
const premiumThemes: Record<PremiumThemeName, PremiumTheme> = {
  // Original themes
  satan: satanPremiumTheme,
  neon: neonPremiumTheme,
  zen: zenPremiumTheme,
  'github-dark': githubDarkPremiumTheme,
  dracula: draculaPremiumTheme,

  // Seasonal themes
  winter: winterPremiumTheme,
  spring: springPremiumTheme,
  summer: summerPremiumTheme,
  autumn: autumnPremiumTheme,

  // Holiday themes
  christmas: christmasPremiumTheme,
  halloween: halloweenPremiumTheme,

  // Developer themes
  ocean: oceanPremiumTheme,
  forest: forestPremiumTheme,
  sunset: sunsetPremiumTheme,
  midnight: midnightPremiumTheme,
  aurora: auroraPremiumTheme,

  // Aesthetic themes
  retro: retroPremiumTheme,
  minimal: minimalPremiumTheme,
  pastel: pastelPremiumTheme,
  matrix: matrixPremiumTheme,
} as const;

/**
 * Get a premium theme by name
 *
 * @param themeName - Theme identifier
 * @returns Premium theme object or default (github-dark) if not found
 */
export function getPremiumTheme(themeName: string | PremiumThemeName = 'github-dark'): PremiumTheme {
  const normalized = themeName.toLowerCase() as PremiumThemeName;
  return premiumThemes[normalized] || premiumThemes['github-dark'];
}

/**
 * Check if a premium theme exists
 *
 * @param themeName - Theme identifier to check
 * @returns true if theme exists
 */
export function premiumThemeExists(themeName: string): themeName is PremiumThemeName {
  return themeName.toLowerCase() in premiumThemes;
}

/**
 * Get all available premium theme names
 *
 * @returns Array of theme names
 */
export function getPremiumThemeNames(): PremiumThemeName[] {
  return Object.keys(premiumThemes) as PremiumThemeName[];
}

/**
 * Get all premium themes
 *
 * @returns Record of all themes
 */
export function getPremiumThemeRegistry(): Readonly<Record<PremiumThemeName, PremiumTheme>> {
  return premiumThemes;
}

/**
 * Theme categories for UI organization
 */
export const themeCategories = {
  original: ['satan', 'neon', 'zen', 'github-dark', 'dracula'] as PremiumThemeName[],
  seasonal: ['winter', 'spring', 'summer', 'autumn'] as PremiumThemeName[],
  holiday: ['christmas', 'halloween'] as PremiumThemeName[],
  developer: ['ocean', 'forest', 'sunset', 'midnight', 'aurora'] as PremiumThemeName[],
  aesthetic: ['retro', 'minimal', 'pastel', 'matrix'] as PremiumThemeName[],
};

/**
 * Free tier themes (5 themes)
 */
export const FREE_THEME_NAMES: PremiumThemeName[] = ['github-dark', 'minimal', 'ocean', 'forest', 'midnight'];

/**
 * Check if a theme is available in free tier
 */
export function isFreeTierTheme(themeName: string): boolean {
  return FREE_THEME_NAMES.includes(themeName.toLowerCase() as PremiumThemeName);
}
