/**
 * Theme Registry (Basic/Legacy)
 *
 * Legacy theme registry for basic SVG widgets.
 * For the full 20 premium themes, use premium-registry.ts instead.
 */

import type { Theme } from '@/types';
import { satanTheme } from './satan';
import { neonTheme } from './neon';
import { zenTheme } from './zen';
import { githubDarkTheme } from './github-dark';
import { draculaTheme } from './dracula';

/**
 * Basic theme name (original 5 themes with fireColors for contribution graphs)
 */
type BasicThemeName = 'satan' | 'neon' | 'zen' | 'github-dark' | 'dracula';

/**
 * Theme registry map (basic themes only)
 * For premium themes, use premium-registry.ts
 */
const themes: Record<BasicThemeName, Theme> = {
  satan: satanTheme,
  neon: neonTheme,
  zen: zenTheme,
  'github-dark': githubDarkTheme,
  dracula: draculaTheme,
} as const;

/**
 * Get the basic theme registry
 *
 * @returns Read-only registry of basic themes
 */
export function getThemeRegistry(): Readonly<Record<BasicThemeName, Theme>> {
  return themes;
}

/**
 * Get a basic theme by name
 *
 * @param themeName - Theme identifier
 * @returns Theme object or default (satan) if not found
 */
export function getTheme(themeName: string = 'satan'): Theme {
  const normalized = themeName.toLowerCase() as BasicThemeName;
  return themes[normalized] || themes.satan;
}

/**
 * Check if a basic theme exists
 *
 * @param themeName - Theme identifier to check
 * @returns true if theme exists in basic registry
 */
export function themeExists(themeName: string): themeName is BasicThemeName {
  return themeName.toLowerCase() in themes;
}

/**
 * Get all available basic theme names
 *
 * @returns Array of basic theme names
 */
export function getThemeNames(): BasicThemeName[] {
  return Object.keys(themes) as BasicThemeName[];
}
