/**
 * GitSkins - Image Generation Utilities
 * 
 * Helper functions for generating contribution graph visuals
 * and rendering image components.
 */

import type { Theme, ContributionDay } from '@/types';
import { imageConfig } from '@/config/site';

/**
 * Get fire color based on contribution count
 * 
 * Color mapping rules:
 * - count === 0: Return generic dark grey (#161b22)
 * - count > 0: Return theme.fireColors[0] (low intensity)
 * - count > 5: Return theme.fireColors[1] (medium intensity)
 * - count > 10: Return theme.fireColors[2] (high intensity)
 * 
 * @param contributionCount - Number of contributions for the day
 * @param theme - Theme object with fire colors
 * @returns Hex color string
 */
export function getFireColor(
  contributionCount: number,
  theme: Theme
): string {
  if (contributionCount === 0) {
    return imageConfig.noContributionColor; // #161b22
  }
  
  if (contributionCount > 10) {
    return theme.fireColors[2]; // High intensity
  }
  
  if (contributionCount > 5) {
    return theme.fireColors[1]; // Medium intensity
  }
  
  return theme.fireColors[0]; // Low intensity (> 0)
}

/**
 * Check if contribution count warrants a glow effect
 * 
 * Apply glow for high-activity days (count > 10, which uses fireColors[2])
 * 
 * @param contributionCount - Number of contributions for the day
 * @returns true if glow should be applied
 */
export function hasGlow(contributionCount: number): boolean {
  return contributionCount > 10;
}

/**
 * Generate box shadow for glow effect
 * 
 * @param color - Color to use for glow
 * @param squareSize - Size of the square
 * @returns CSS box-shadow string
 */
export function generateGlow(color: string, squareSize: number): string {
  return `0 0 ${squareSize / 2}px ${color}, 0 0 ${squareSize}px ${color}`;
}

/**
 * Format languages list for display
 * 
 * @param languages - Array of language objects
 * @returns Formatted string (e.g., "TypeScript • JavaScript • Python")
 */
export function formatLanguages(languages: Array<{ name: string }>): string {
  if (languages.length === 0) {
    return 'No languages detected';
  }
  return languages.map((lang) => lang.name).join(' • ');
}

/**
 * Truncate bio text to fit display
 * 
 * @param bio - Bio text
 * @param maxLength - Maximum length (default: 60)
 * @returns Truncated bio with ellipsis if needed
 */
export function truncateBio(bio: string, maxLength: number = 60): string {
  if (bio.length <= maxLength) {
    return bio;
  }
  return `${bio.substring(0, maxLength)}...`;
}
