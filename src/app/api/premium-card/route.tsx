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
type PremiumCardVariant = 'classic' | 'glass' | 'persona';
const VALID_VARIANTS: PremiumCardVariant[] = ['classic', 'glass', 'persona'];

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

function contributionGraphSvg(
  data: GitHubData,
  theme: ReturnType<typeof getPremiumTheme>,
  x: number,
  y: number,
  weeksToShow = 22,
  squareSize = 13,
  gap = 4,
  radius = 3
): string {
  let graphContent = '';
  const c = theme.colors;
  const weeks = data.contributionCalendar.weeks.slice(-weeksToShow);

  weeks.forEach((week, wIndex) => {
    week.contributionDays.forEach((day, dIndex) => {
      let color = `${c.accent}16`;
      if (day.contributionCount > 0) {
        const level = Math.min(Math.ceil(day.contributionCount / 3), theme.graphColors.length - 1);
        color = theme.graphColors[level] || theme.graphColors[theme.graphColors.length - 1];
      }

      graphContent += `<rect x="${x + wIndex * (squareSize + gap)}" y="${y + dIndex * (squareSize + gap)}" width="${squareSize}" height="${squareSize}" rx="${radius}" fill="${color}" />`;
    });
  });

  return graphContent;
}

function activeDayCount(data: GitHubData): number {
  return data.contributionCalendar.weeks.reduce((total, week) => (
    total + week.contributionDays.filter((day) => day.contributionCount > 0).length
  ), 0);
}

function languageChipsSvg(data: GitHubData, x: number, y: number, fallbackColor: string, textColor: string): string {
  const languages = data.topLanguages.slice(0, 4);
  if (languages.length === 0) return '';

  let cursor = x;
  return languages.map((language) => {
    const label = esc(language.name).slice(0, 18);
    const width = Math.max(86, label.length * 9 + 34);
    const color = language.color || fallbackColor;
    const chip = `<g>
      <rect x="${cursor}" y="${y}" width="${width}" height="32" rx="16" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-opacity="0.35"/>
      <circle cx="${cursor + 18}" cy="${y + 16}" r="5" fill="${color}"/>
      <text x="${cursor + 31}" y="${y + 21}" fill="${textColor}" font-size="13" font-weight="700" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${label}</text>
    </g>`;
    cursor += width + 10;
    return chip;
  }).join('');
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
  
  const graphContent = contributionGraphSvg(data, theme, 60, 400, 18, 14, 3, 2);

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

async function generateGlassCardSvg(
  data: GitHubData,
  username: string,
  themeName: PremiumThemeName
): Promise<NextResponse> {
  const theme = getPremiumTheme(themeName);
  const c = theme.colors;
  const avatarBase64 = await fetchImageAsBase64(data.avatarUrl);
  const stars = data.totalStars.toLocaleString();
  const contributions = data.totalContributions.toLocaleString();
  const activeDays = activeDayCount(data).toLocaleString();
  const graphContent = contributionGraphSvg(data, theme, 610, 332, 25, 12, 4, 4);
  const chips = languageChipsSvg(data, 72, 438, c.accent, c.primary);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.bg}"/>
      <stop offset="52%" stop-color="${c.cardBg}"/>
      <stop offset="100%" stop-color="${c.bg}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${c.accent}"/>
      <stop offset="55%" stop-color="${c.primary}"/>
      <stop offset="100%" stop-color="${c.ring}"/>
    </linearGradient>
    <clipPath id="avatarClip"><circle cx="166" cy="158" r="74"/></clipPath>
    <filter id="blurGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="34" result="blur"/>
      <feBlend in="SourceGraphic" in2="blur" mode="screen"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="1060" cy="80" r="310" fill="${c.accent}" fill-opacity="0.12" filter="url(#blurGlow)"/>
  <circle cx="120" cy="610" r="280" fill="${c.ring}" fill-opacity="0.12" filter="url(#blurGlow)"/>
  <path d="M0 118 C180 72 300 160 470 104 C650 44 826 72 1200 6 L1200 0 L0 0Z" fill="${c.primary}" fill-opacity="0.06"/>
  <rect x="36" y="34" width="1128" height="562" rx="38" fill="${c.cardBg}" fill-opacity="0.72" stroke="${c.border}" stroke-opacity="0.55"/>
  <rect x="52" y="50" width="1096" height="530" rx="30" fill="#ffffff" fill-opacity="0.035" stroke="#ffffff" stroke-opacity="0.08"/>
  <rect x="72" y="74" width="188" height="188" rx="38" fill="${c.accent}" fill-opacity="0.1" stroke="${c.accent}" stroke-opacity="0.3"/>
  <image xlink:href="${esc(avatarBase64)}" x="92" y="84" width="148" height="148" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="166" cy="158" r="75" fill="none" stroke="url(#accent)" stroke-width="4"/>
  <text x="294" y="128" fill="${c.primary}" font-size="50" font-weight="850" letter-spacing="-1.5" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${esc(data.name || username)}</text>
  <text x="296" y="166" fill="${c.accent}" font-size="22" font-weight="750" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">@${esc(username)}</text>
  <text x="296" y="204" fill="${c.secondary}" font-size="18" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.78">${esc(truncateBio(data.bio || 'Building in public with GitHub.'))}</text>
  <rect x="296" y="236" width="286" height="7" rx="4" fill="${c.accent}" fill-opacity="0.2"/>
  <rect x="296" y="236" width="132" height="7" rx="4" fill="url(#accent)"/>
  <g transform="translate(72, 304)">
    <rect x="0" y="0" width="154" height="104" rx="22" fill="#000" fill-opacity="0.16" stroke="#fff" stroke-opacity="0.08"/>
    <text x="24" y="36" fill="${c.secondary}" font-size="13" font-weight="750" letter-spacing="1.2" font-family="'Segoe UI', sans-serif">STARS</text>
    <text x="24" y="76" fill="${c.primary}" font-size="34" font-weight="850" font-family="'Segoe UI', sans-serif">${stars}</text>
    <rect x="174" y="0" width="214" height="104" rx="22" fill="#000" fill-opacity="0.16" stroke="#fff" stroke-opacity="0.08"/>
    <text x="198" y="36" fill="${c.secondary}" font-size="13" font-weight="750" letter-spacing="1.2" font-family="'Segoe UI', sans-serif">CONTRIBUTIONS</text>
    <text x="198" y="76" fill="${c.primary}" font-size="34" font-weight="850" font-family="'Segoe UI', sans-serif">${contributions}</text>
    <rect x="408" y="0" width="154" height="104" rx="22" fill="#000" fill-opacity="0.16" stroke="#fff" stroke-opacity="0.08"/>
    <text x="432" y="36" fill="${c.secondary}" font-size="13" font-weight="750" letter-spacing="1.2" font-family="'Segoe UI', sans-serif">ACTIVE</text>
    <text x="432" y="76" fill="${c.primary}" font-size="34" font-weight="850" font-family="'Segoe UI', sans-serif">${activeDays}</text>
  </g>
  ${chips}
  <text x="610" y="300" fill="${c.primary}" font-size="18" font-weight="800" letter-spacing="1" font-family="'Segoe UI', sans-serif">ACTIVITY MAP</text>
  <rect x="594" y="318" width="512" height="154" rx="22" fill="#000" fill-opacity="0.16" stroke="#fff" stroke-opacity="0.08"/>
  ${graphContent}
  <rect x="72" y="528" width="190" height="34" rx="17" fill="${c.accent}" fill-opacity="0.12" stroke="${c.accent}" stroke-opacity="0.28"/>
  <text x="94" y="550" fill="${c.accent}" font-size="14" font-weight="800" font-family="'Segoe UI', sans-serif">GLASS PROFILE</text>
  <text x="${WIDTH - 72}" y="550" text-anchor="end" fill="${c.secondary}" font-size="14" font-weight="600" font-family="'Segoe UI', sans-serif" opacity="0.58">${siteConfig.footerText}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function generatePersonaCardSvg(
  data: GitHubData,
  username: string,
  themeName: PremiumThemeName
): Promise<NextResponse> {
  const theme = getPremiumTheme(themeName);
  const c = theme.colors;
  const avatarBase64 = await fetchImageAsBase64(data.avatarUrl);
  const personaTitle = data.totalStars > 500
    ? 'Open Source Builder'
    : data.totalContributions > 1000
      ? 'Consistent Shipper'
      : 'Profile in Motion';
  const graphContent = contributionGraphSvg(data, theme, 92, 424, 28, 10, 4, 3);
  const chips = languageChipsSvg(data, 612, 274, c.accent, c.primary);
  const bio = truncateBio(data.bio || 'A developer profile shaped by commits, repos, and public work.');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="personaBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.bg}"/>
      <stop offset="100%" stop-color="${c.cardBg}"/>
    </linearGradient>
    <radialGradient id="portraitGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="portraitClip"><rect x="82" y="82" width="266" height="326" rx="44"/></clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#personaBg)"/>
  <path d="M600 0 L1200 0 L1200 630 L792 630 C700 496 650 318 600 0Z" fill="${c.accent}" fill-opacity="0.08"/>
  <path d="M0 630 C178 520 336 546 504 458 C670 370 818 382 1200 236 L1200 630Z" fill="${c.ring}" fill-opacity="0.08"/>
  <rect x="30" y="30" width="1140" height="570" rx="42" fill="#050505" fill-opacity="0.18" stroke="${c.border}" stroke-opacity="0.5"/>
  <rect x="74" y="74" width="282" height="342" rx="52" fill="url(#portraitGlow)" stroke="${c.accent}" stroke-opacity="0.4"/>
  <image xlink:href="${esc(avatarBase64)}" x="82" y="82" width="266" height="326" clip-path="url(#portraitClip)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="82" y="82" width="266" height="326" rx="44" fill="none" stroke="#fff" stroke-opacity="0.12"/>
  <rect x="392" y="86" width="166" height="34" rx="17" fill="${c.accent}" fill-opacity="0.13" stroke="${c.accent}" stroke-opacity="0.32"/>
  <text x="414" y="109" fill="${c.accent}" font-size="14" font-weight="850" font-family="'Segoe UI', sans-serif">PERSONA CARD</text>
  <text x="392" y="178" fill="${c.primary}" font-size="56" font-weight="900" letter-spacing="-2" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${esc(data.name || username)}</text>
  <text x="394" y="218" fill="${c.accent}" font-size="24" font-weight="800" font-family="'Segoe UI', sans-serif">@${esc(username)} · ${esc(personaTitle)}</text>
  <text x="394" y="266" fill="${c.secondary}" font-size="19" font-family="'Segoe UI', sans-serif" opacity="0.82">${esc(bio)}</text>
  ${chips}
  <g transform="translate(612, 346)">
    <rect x="0" y="0" width="154" height="94" rx="20" fill="${c.cardBg}" fill-opacity="0.62" stroke="#fff" stroke-opacity="0.09"/>
    <text x="24" y="34" fill="${c.secondary}" font-size="12" font-weight="800" letter-spacing="1" font-family="'Segoe UI', sans-serif">STARS</text>
    <text x="24" y="70" fill="${c.primary}" font-size="32" font-weight="900" font-family="'Segoe UI', sans-serif">${data.totalStars.toLocaleString()}</text>
    <rect x="174" y="0" width="206" height="94" rx="20" fill="${c.cardBg}" fill-opacity="0.62" stroke="#fff" stroke-opacity="0.09"/>
    <text x="198" y="34" fill="${c.secondary}" font-size="12" font-weight="800" letter-spacing="1" font-family="'Segoe UI', sans-serif">CONTRIBUTIONS</text>
    <text x="198" y="70" fill="${c.primary}" font-size="32" font-weight="900" font-family="'Segoe UI', sans-serif">${data.totalContributions.toLocaleString()}</text>
  </g>
  <text x="92" y="386" fill="${c.primary}" font-size="17" font-weight="850" letter-spacing="1" font-family="'Segoe UI', sans-serif">SIGNAL</text>
  ${graphContent}
  <text x="${WIDTH - 72}" y="${HEIGHT - 62}" text-anchor="end" fill="${c.secondary}" font-size="14" font-weight="650" font-family="'Segoe UI', sans-serif" opacity="0.6">${siteConfig.footerText}</text>
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
    const variantParam = searchParams.get('variant');
    theme = themeParam || 'satan';
    const variant = VALID_VARIANTS.includes(variantParam as PremiumCardVariant)
      ? variantParam as PremiumCardVariant
      : 'classic';

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

    if (variant === 'glass') {
      return await generateGlassCardSvg(data, username, (theme as PremiumThemeName) || 'satan');
    }

    if (variant === 'persona') {
      return await generatePersonaCardSvg(data, username, (theme as PremiumThemeName) || 'satan');
    }

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
