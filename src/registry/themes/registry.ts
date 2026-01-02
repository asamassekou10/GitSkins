/**
 * Theme Registry
 * 
 * Centralized theme registry for easy expansion.
 * Import themes from separate files and register them here.
 */

import type { Theme, ThemeName } from '@/types';
import { satanTheme } from './satan';
import { neonTheme } from './neon';
import { zenTheme } from './zen';
import { githubDarkTheme } from './github-dark';
import { draculaTheme } from './dracula';

/**
 * Theme registry map
 * Add new themes by importing and adding to this object
 */
const themes: Record<ThemeName, Theme> = {
  satan: satanTheme,
  neon: neonTheme,
  zen: zenTheme,
  'github-dark': githubDarkTheme,
  dracula: draculaTheme,
} as const;

/**
 * Get the theme registry
 * 
 * @returns Read-only registry of all themes
 */
export function getThemeRegistry(): Readonly<Record<ThemeName, Theme>> {
  return themes;
}

/**
 * Get a theme by name
 * 
 * @param themeName - Theme identifier
 * @returns Theme object or default (satan) if not found
 */
export function getTheme(themeName: string | ThemeName = 'satan'): Theme {
  const normalized = themeName.toLowerCase() as ThemeName;
  return themes[normalized] || themes.satan;
}

/**
 * Check if a theme exists
 * 
 * @param themeName - Theme identifier to check
 * @returns true if theme exists
 */
export function themeExists(themeName: string): themeName is ThemeName {
  return themeName.toLowerCase() in themes;
}

/**
 * Get all available theme names
 * 
 * @returns Array of theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}
