/**
 * Premium Theme Registry
 *
 * Central registry for all premium themes with rich visual designs.
 */

import type { PremiumTheme, PremiumThemeName } from '@/types/premium-theme';
import { satanPremiumTheme } from './premium-satan';
import { neonPremiumTheme } from './premium-neon';
import { zenPremiumTheme } from './premium-zen';
import { githubDarkPremiumTheme } from './premium-github-dark';
import { draculaPremiumTheme } from './premium-dracula';

/**
 * Premium theme registry map
 */
const premiumThemes: Record<PremiumThemeName, PremiumTheme> = {
  satan: satanPremiumTheme,
  neon: neonPremiumTheme,
  zen: zenPremiumTheme,
  'github-dark': githubDarkPremiumTheme,
  dracula: draculaPremiumTheme,
} as const;

/**
 * Get a premium theme by name
 *
 * @param themeName - Theme identifier
 * @returns Premium theme object or default (satan) if not found
 */
export function getPremiumTheme(themeName: string | PremiumThemeName = 'satan'): PremiumTheme {
  const normalized = themeName.toLowerCase() as PremiumThemeName;
  return premiumThemes[normalized] || premiumThemes.satan;
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
