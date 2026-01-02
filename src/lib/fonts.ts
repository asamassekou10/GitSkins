/**
 * GitSkins - Font Loader for Satori
 *
 * Utilities to fetch and load Google Fonts as ArrayBuffer for @vercel/og image generation.
 * Satori requires font data in ArrayBuffer format (.ttf or .woff).
 */

import type { PremiumTheme } from '@/types/premium-theme';

/**
 * Font cache to avoid redundant fetches
 */
const fontCache = new Map<string, ArrayBuffer>();

/**
 * Load a Google Font and return its ArrayBuffer
 *
 * @param fontUrl - Google Fonts URL (e.g., https://fonts.googleapis.com/css2?family=Inter)
 * @param weight - Font weight to fetch (default: 400)
 * @returns ArrayBuffer of the font file
 */
export async function loadGoogleFont(fontUrl: string, weight: number = 400): Promise<ArrayBuffer> {
  const cacheKey = `${fontUrl}-${weight}`;

  // Check cache first
  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  try {
    // Fetch the CSS file from Google Fonts
    const cssResponse = await fetch(fontUrl, {
      headers: {
        // User agent is important - tells Google Fonts to return .woff2 format
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!cssResponse.ok) {
      throw new Error(`Failed to fetch font CSS: ${cssResponse.statusText}`);
    }

    const css = await cssResponse.text();

    // Extract the font file URL from the CSS
    // Look for url() in @font-face with the desired weight
    const fontUrlMatch = css.match(/url\(([^)]+)\)/);

    if (!fontUrlMatch) {
      throw new Error('Could not extract font URL from CSS');
    }

    const fontFileUrl = fontUrlMatch[1].replace(/['"]/g, '');

    // Fetch the actual font file
    const fontResponse = await fetch(fontFileUrl);

    if (!fontResponse.ok) {
      throw new Error(`Failed to fetch font file: ${fontResponse.statusText}`);
    }

    const fontData = await fontResponse.arrayBuffer();

    // Cache it
    fontCache.set(cacheKey, fontData);

    return fontData;
  } catch (error) {
    console.error('Font loading error:', error);
    // Return a fallback - we'll use system font
    throw error;
  }
}

/**
 * Load font for a specific premium theme
 *
 * @param theme - Premium theme configuration
 * @returns ArrayBuffer of the theme's font
 */
export async function loadThemeFont(theme: PremiumTheme): Promise<ArrayBuffer> {
  return loadGoogleFont(theme.font.url, theme.font.weight || 400);
}

/**
 * Clear the font cache (useful for development/testing)
 */
export function clearFontCache(): void {
  fontCache.clear();
}
