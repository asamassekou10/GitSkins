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
  /** Secondary background for widget cards */
  cardBg: string;
  /** Progress bar background color */
  progressBg: string;
  /** Colors for streak widget icons */
  streakColors: {
    /** Current streak fire icon */
    fire: string;
    /** Longest streak trophy icon */
    trophy: string;
    /** Total days calendar icon */
    calendar: string;
  };
  /** Icon color for theme-specific custom icons */
  iconColor?: string;
}

/**
 * Theme name identifier (must match registry keys)
 */
export type ThemeName = 'satan' | 'neon' | 'zen' | 'github-dark' | 'dracula';

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
 * Streak statistics calculated from contribution data
 */
export interface StreakData {
  /** Current consecutive days with contributions */
  currentStreak: number;
  /** Longest consecutive days with contributions */
  longestStreak: number;
  /** Total days with at least one contribution */
  totalActiveDays: number;
}

/**
 * Aggregated language statistics
 */
export interface LanguageStat {
  /** Language name (e.g., "TypeScript") */
  name: string;
  /** GitHub-assigned color hex code */
  color: string;
  /** Percentage of total code */
  percentage: number;
  /** Total bytes of code */
  bytes: number;
}

/**
 * Compact user stats for stats widget
 */
export interface CompactStats {
  /** Total stars across all repositories */
  totalStars: number;
  /** Total contributions this year */
  totalContributions: number;
  /** Total public repositories */
  totalRepos: number;
  /** Total followers */
  followers: number;
}

/**
 * Repository data for repo widget
 */
export interface RepoData {
  /** Repository name */
  name: string;
  /** Repository description */
  description: string | null;
  /** Number of stars */
  stargazerCount: number;
  /** Number of forks */
  forkCount: number;
  /** Primary language */
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

/**
 * Extended GitHub data with additional fields for widgets
 */
export interface ExtendedGitHubData extends GitHubData {
  /** Streak statistics */
  streak: StreakData;
  /** Aggregated language statistics */
  languages: LanguageStat[];
  /** Compact stats */
  stats: CompactStats;
  /** Pinned/featured repositories */
  pinnedRepos: RepoData[];
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
