/**
 * GitSkins - Premium Card API Route
 *
 * Enhanced API endpoint for generating premium GitHub profile cards
 * with rich fonts, effects, and visual designs.
 * 
 * Updated: Uses pure SVG generation for reliability across runtimes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateCardQuery } from '@/lib/validations';
import { fetchGitHubData } from '@/lib/github';
import { getPremiumTheme } from '@/registry/themes/premium-registry';
import { truncateBio } from '@/lib/image-generator';
import { apiConfig, siteConfig } from '@/config/site';
import { trackCardGeneration } from '@/lib/analytics';
import type { GitHubData } from '@/types';
import type { PremiumThemeName } from '@/types/premium-theme';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WIDTH = 1200;
const HEIGHT = 630;

function esc(str: string): string {
  return str.replace(/[<>"&']/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : c === '&' ? '&amp;' : '&#39;'
  );
}

// Fetch image buffer and convert to base64 for embedding
async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const contentType = res.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.warn('Failed to fetch avatar for embedding:', e);
    // Fallback to a generic placeholder or original URL if possible (though original URL might fail display if CORS/hotlink blocked)
    return url;
  }
}

/**
 * Generate error SVG response
 */
function generateErrorSvg(message: string, subtitle?: string): NextResponse {
  const safeMessage = esc(message.slice(0, 60));
  const safeSubtitle = subtitle ? esc(subtitle.slice(0, 80)) : '';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="50%" y="45%" text-anchor="middle" fill="#ef4444" font-size="32" font-family="system-ui,sans-serif" font-weight="bold">${safeMessage}</text>
  ${safeSubtitle ? `<text x="50%" y="55%" text-anchor="middle" fill="#8b949e" font-size="20" font-family="system-ui,sans-serif">${safeSubtitle}</text>` : ''}
</svg>`;
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    },
  });
}

/**
 * Generate premium card SVG
 */
async function generatePremiumCardSvg(
  data: GitHubData,
  username: string,
  themeName: PremiumThemeName
): Promise<NextResponse> {
  const theme = getPremiumTheme(themeName);
  const c = theme.colors;
  
  // Embed avatar
  const avatarBase64 = await fetchImageAsBase64(data.avatarUrl);

  // Stats
  const stars = data.totalStars.toLocaleString();
  const contributions = data.totalContributions.toLocaleString();

  // Contribution Graph (Simple Mockup for SVG logic)
  // In a real SVG, we'd loop through `data.contributionCalendar.weeks` and render rects
  // We can do that here.
  
  let graphContent = '';
  const weeks = data.contributionCalendar.weeks.slice(-18); // Last ~18 weeks to fit
  const squareSize = 14;
  const gap = 3;
  const startX = 60;
  const startY = 400;

  weeks.forEach((week, wIndex) => {
    week.contributionDays.forEach((day, dIndex) => {
       // Color logic
       // Map count to theme graph colors
       let color = c.cardBg;
       if (day.contributionCount > 0) {
         // Simple bucket mapping
         const level = Math.min(Math.ceil(day.contributionCount / 3), theme.graphColors.length - 1);
         color = theme.graphColors[level] || theme.graphColors[theme.graphColors.length - 1];
       } else {
         color = `${c.accent}10`; // Very faint empty state
       }

       const x = startX + wIndex * (squareSize + gap);
       const y = startY + dIndex * (squareSize + gap);
       
       graphContent += `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" rx="2" fill="${color}" />`;
    });
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.bg}"/>
      <stop offset="100%" stop-color="${c.cardBg}"/>
    </linearGradient>
    <clipPath id="avatar-clip">
      <rect x="60" y="60" width="100" height="100" rx="24"/>
    </clipPath>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${c.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-gradient)" opacity="0.8"/>
  
  <!-- Decorative/Theme Background Pattern (Simplified) -->
  <circle cx="${WIDTH}" cy="0" r="400" fill="${c.accent}" fill-opacity="0.05" filter="url(#glow)"/>
  <circle cx="0" cy="${HEIGHT}" r="300" fill="${c.primary}" fill-opacity="0.05" filter="url(#glow)"/>

  <!-- Card Frame (Simulated) -->
  <rect x="20" y="20" width="${WIDTH - 40}" height="${HEIGHT - 40}" rx="32" fill="none" stroke="${c.border}" stroke-width="1" stroke-opacity="0.5"/>
  
  <!-- Top Accent Bar -->
  <rect x="20" y="20" width="${WIDTH - 40}" height="4" fill="${c.accent}"/>

  <!-- Avatar -->
  <image xlink:href="${esc(avatarBase64)}" x="60" y="60" width="100" height="100" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="60" y="60" width="100" height="100" rx="24" fill="none" stroke="${c.accent}" stroke-width="2" stroke-opacity="0.5"/>

  <!-- User Info -->
  <g transform="translate(190, 80)">
    <text x="0" y="30" fill="${c.primary}" font-size="42" font-weight="800" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${esc(data.name || username)}</text>
    <text x="0" y="65" fill="${c.accent}" font-size="20" font-weight="600" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.9">@${esc(username)}</text>
    <text x="0" y="95" fill="${c.secondary}" font-size="16" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.7">${esc(truncateBio(data.bio || ''))}</text>
  </g>

  <!-- Stats Cards -->
  <g transform="translate(60, 200)">
     <!-- Stars -->
     <rect x="0" y="0" width="240" height="100" rx="16" fill="${c.accent}" fill-opacity="0.08" stroke="${c.accent}" stroke-opacity="0.2"/>
     <text x="24" y="35" fill="${c.secondary}" font-size="14" font-weight="600" letter-spacing="1" font-family="'Segoe UI', sans-serif" opacity="0.8">TOTAL STARS</text>
     <text x="24" y="75" fill="${c.primary}" font-size="36" font-weight="800" font-family="'Segoe UI', sans-serif">${stars}</text>

     <!-- Contributions -->
     <rect x="260" y="0" width="240" height="100" rx="16" fill="${c.accent}" fill-opacity="0.08" stroke="${c.accent}" stroke-opacity="0.2"/>
     <text x="284" y="35" fill="${c.secondary}" font-size="14" font-weight="600" letter-spacing="1" font-family="'Segoe UI', sans-serif" opacity="0.8">CONTRIBUTIONS</text>
     <text x="284" y="75" fill="${c.primary}" font-size="36" font-weight="800" font-family="'Segoe UI', sans-serif">${contributions}</text>
  </g>

  <!-- Contribution Graph Label -->
  <g transform="translate(60, 360)">
    <rect x="0" y="0" width="4" height="20" rx="2" fill="${c.primary}"/>
    <text x="15" y="16" fill="${c.primary}" font-size="16" font-weight="700" letter-spacing="1" font-family="'Segoe UI', sans-serif">CONTRIBUTION ACTIVITY</text>
  </g>

  <!-- Graph -->
  ${graphContent}

  <!-- Footer -->
  <text x="${WIDTH - 60}" y="${HEIGHT - 40}" text-anchor="end" fill="${c.secondary}" font-size="14" font-weight="500" font-family="'Segoe UI', sans-serif" opacity="0.5">${siteConfig.footerText}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/**
 * GET /api/premium-card
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let username = 'unknown';
  let theme: string | undefined;

  try {
    const searchParams = request.nextUrl.searchParams;
    const usernameParam = searchParams.get('username');
    const themeParam = searchParams.get('theme');
    theme = themeParam || 'satan';

    // Basic validation
    if (!process.env.GITHUB_TOKEN?.trim()) {
      return generateErrorSvg('Server Error', 'GITHUB_TOKEN not configured');
    }

    if (!usernameParam || usernameParam.trim() === '') {
       trackCardGeneration({
        cardType: 'premium',
        theme,
        username: 'missing',
        success: false,
        errorType: 'missing_username',
        duration: Date.now() - startTime,
      });
      return generateErrorSvg('Missing Username', 'Add ?username=yourname');
    }

    username = usernameParam;

    // Fetch Data
    let data;
    try {
      data = await fetchGitHubData(username);
    } catch (e) {
      console.error(e);
      trackCardGeneration({
        cardType: 'premium',
        theme,
        username,
        success: false,
        errorType: 'github_api_error',
        duration: Date.now() - startTime,
      });
      return generateErrorSvg('GitHub API Error', 'Could not fetch user data');
    }

    if (!data) {
      trackCardGeneration({
        cardType: 'premium',
        theme,
        username,
        success: false,
        errorType: 'user_not_found',
        duration: Date.now() - startTime,
      });
      return generateErrorSvg('User Not Found', `@${username}`);
    }

    trackCardGeneration({
      cardType: 'premium',
      theme,
      username,
      success: true,
      duration: Date.now() - startTime,
    });

    return await generatePremiumCardSvg(data, username, (theme as PremiumThemeName) || 'satan');

  } catch (error) {
    console.error('Unexpected error:', error);
    trackCardGeneration({
      cardType: 'premium',
      theme,
      username,
      success: false,
      errorType: 'unexpected_error',
      duration: Date.now() - startTime,
    });
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return generateErrorSvg('Unexpected Error', msg);
  }
}

/**
 * HEAD /api/premium-card
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
