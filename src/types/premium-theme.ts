/**
 * GitSkins - Premium Theme System
 *
 * Enhanced theme interface for rich visual designs with fonts, effects, and patterns.
 */

/**
 * Premium theme configuration for high-fidelity visual designs
 */
export interface PremiumTheme {
  /** Theme identifier */
  name: string;
  /** Display label */
  label: string;

  /** Color palette */
  colors: {
    /** Main background (can be solid or gradient) */
    bg: string;
    /** Inner card/widget background */
    cardBg: string;
    /** Border colors */
    border: string;
    /** Main text/headers */
    primary: string;
    /** Subtitles/labels */
    secondary: string;
    /** Progress bars, icons, accents */
    accent: string;
    /** Focus rings or glow effects */
    ring: string;
  };

  /** Typography configuration */
  font: {
    /** Font family name */
    family: string;
    /** Google Fonts URL */
    url: string;
    /** Font weight to use */
    weight?: number;
  };

  /** Visual effects */
  effects: {
    /** CSS mask for background */
    mask?: string;
    /** CSS text-shadow for glow effects */
    textGlow?: string;
    /** CSS box-shadow for cards */
    cardShadow?: string;
    /** Background pattern identifier */
    backgroundPattern?: 'flames' | 'grid' | 'enso' | 'dots' | 'none';
  };

  /** Data visualization colors (3-5 colors for contribution graph) */
  graphColors: string[];
}

/**
 * Premium theme name identifier
 */
export type PremiumThemeName = 'satan' | 'neon' | 'zen' | 'github-dark' | 'dracula';
