/**
 * Theme Registry - Public API
 * 
 * Re-export all theme-related functions and types
 */

export {
  getThemeRegistry,
  getTheme,
  themeExists,
  getThemeNames,
} from './registry';

export type { Theme, ThemeName } from '@/types';
