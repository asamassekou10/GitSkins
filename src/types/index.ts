/**
 * GitSkins - Shared Type Definitions
 * 
 * Centralized type definitions for type safety across the application.
 * All interfaces are strictly typed and exported for reuse.
 */

/**
 * Theme color palette for dynamic SVG generation
 */
export interface Theme {
  /** Background color (hex) */
  bg: string;
  /** Border color (hex) */
  borderColor: string;
  /** Primary text color (hex) */
  primaryText: string;
  /** Secondary text color (hex) */
  secondaryText: string;
  /** Accent color for highlights (hex) */
  accentColor: string;
  /** Fire colors for contribution graph: [low, medium, high] intensity */
  fireColors: [string, string, string];
}

/**
 * Theme name identifier (must match registry keys)
 */
export type ThemeName = 'satan' | 'neon' | 'zen';

/**
 * Single day contribution data from GitHub API
 */
export interface ContributionDay {
  /** Number of contributions on this day */
  contributionCount: number;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
}

/**
 * Week of contribution data
 */
export interface ContributionWeek {
  /** Array of contribution days (typically 7) */
  contributionDays: ContributionDay[];
}

/**
 * Language information from GitHub repositories
 */
export interface Language {
  /** Language name (e.g., "TypeScript", "JavaScript") */
  name: string;
  /** GitHub-assigned color hex code (nullable) */
  color: string | null;
}

/**
 * Complete GitHub user data structure
 */
export interface GitHubData {
  /** User's display name (nullable) */
  name: string | null;
  /** User's bio/description (nullable) */
  bio: string | null;
  /** Avatar URL */
  avatarUrl: string;
  /** Total contributions from calendar */
  totalContributions: number;
  /** Total stars across all repositories */
  totalStars: number;
  /** Top 5 languages by repository count */
  topLanguages: Language[];
  /** Contribution calendar structure */
  contributionCalendar: {
    weeks: ContributionWeek[];
  };
}

/**
 * API error response structure
 */
export interface ApiError {
  /** Error code (e.g., "USER_NOT_FOUND", "VALIDATION_ERROR") */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Optional detailed error information */
  details?: unknown;
}

/**
 * Validated API query parameters
 */
export interface CardQueryParams {
  /** GitHub username (required) */
  username: string;
  /** Theme name (optional, defaults to 'satan') */
  theme?: ThemeName;
}

/**
 * Image generation constants
 */
export interface ImageConfig {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
  /** Contribution square size */
  squareSize: number;
  /** Gap between squares */
  squareGap: number;
  /** Graph starting X position */
  graphStartX: number;
  /** Graph starting Y position */
  graphStartY: number;
  /** Maximum contributions per day for intensity calculation */
  maxContributionsPerDay: number;
}
