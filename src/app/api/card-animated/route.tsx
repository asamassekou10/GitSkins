/**
 * GitSkins - Animated SVG Card Endpoint
 *
 * Generates animated SVG profile cards that work in GitHub READMEs.
 * Uses CSS animations and SMIL for GitHub-compatible effects.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateCardQuery } from '@/lib/validations';
import { fetchGitHubData } from '@/lib/github';
import { getPremiumTheme } from '@/registry/themes/premium-registry';
import { truncateBio } from '@/lib/image-generator';
import { imageConfig, apiConfig } from '@/config/site';
import type { GitHubData } from '@/types';
import type { PremiumThemeName } from '@/types/premium-theme';

export const runtime = 'edge';

/**
 * Generate animated SVG card
 */
async function generateAnimatedCardSVG(
  data: GitHubData,
  username: string,
  themeName: PremiumThemeName
): Promise<string> {
  const theme = getPremiumTheme(themeName);
  const bio = truncateBio(data.bio || '', 100);

  // Use data from GitHubData type
  const totalStars = data.totalStars;
  const totalContributions = data.totalContributions;

  // Get top languages (GitHubData has topLanguages array)
  const topLanguages = data.topLanguages.slice(0, 5);
  const totalLanguages = topLanguages.length;

  // Generate theme-specific animations
  const animations = getThemeAnimations(theme.name as PremiumThemeName);
  const backgroundPattern = getAnimatedBackgroundPattern(theme.name as PremiumThemeName, theme);

  // SVG Structure
  const svg = `
<svg width="${imageConfig.width}" height="${imageConfig.height}"
     viewBox="0 0 ${imageConfig.width} ${imageConfig.height}"
     xmlns="http://www.w3.org/2000/svg">

  <defs>
    ${animations.defs}
  </defs>

  <style>
    ${animations.styles}

    .card-bg { fill: ${theme.colors.cardBg}; }
    .border { stroke: ${theme.colors.border}; fill: none; stroke-width: 2; }
    .primary { fill: ${theme.colors.primary}; }
    .secondary { fill: ${theme.colors.secondary}; }
    .accent { fill: ${theme.colors.accent}; }

    .title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', sans-serif; font-size: 28px; font-weight: 600; }
    .subtitle { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', sans-serif; font-size: 16px; }
    .stat-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', sans-serif; font-size: 18px; font-weight: 700; }
  </style>

  <!-- Background -->
  <rect width="100%" height="100%" fill="${theme.colors.bg}"/>

  ${backgroundPattern}

  <!-- Main Card Container -->
  <rect x="0" y="0" width="${imageConfig.width}" height="${imageConfig.height}"
        class="border" rx="20" ${animations.cardAnimation}/>

  <!-- Header Section -->
  <g transform="translate(40, 50)">
    <!-- Avatar Circle -->
    <circle cx="40" cy="40" r="40" fill="${theme.colors.border}" opacity="0.2"/>
    <circle cx="40" cy="40" r="38" fill="#fff" opacity="0.1" ${animations.avatarPulse}/>

    <!-- Username -->
    <text x="100" y="45" class="title primary" ${animations.textGlow}>
      ${data.name || username}
    </text>

    <!-- Bio -->
    ${bio ? `
    <text x="100" y="70" class="subtitle secondary" opacity="0.9">
      ${bio}
    </text>
    ` : ''}
  </g>

  <!-- Stats Section -->
  <g transform="translate(40, 150)">
    <!-- Stars -->
    <g ${animations.statsFadeIn}>
      <rect x="0" y="0" width="230" height="80" class="card-bg" rx="12" opacity="0.3"/>
      <text x="16" y="28" class="stat-label secondary">⭐ Stars</text>
      <text x="16" y="58" class="stat-value accent">${totalStars.toLocaleString()}</text>
    </g>

    <!-- Contributions -->
    <g transform="translate(250, 0)" ${animations.statsFadeIn} style="animation-delay: 0.1s">
      <rect x="0" y="0" width="230" height="80" class="card-bg" rx="12" opacity="0.3"/>
      <text x="16" y="28" class="stat-label secondary">📊 Contributions</text>
      <text x="16" y="58" class="stat-value accent">${totalContributions.toLocaleString()}</text>
    </g>

    <!-- Languages -->
    <g transform="translate(500, 0)" ${animations.statsFadeIn} style="animation-delay: 0.2s">
      <rect x="0" y="0" width="200" height="80" class="card-bg" rx="12" opacity="0.3"/>
      <text x="16" y="28" class="stat-label secondary">🎨 Languages</text>
      <text x="16" y="58" class="stat-value accent">${totalLanguages}</text>
    </g>
  </g>

  <!-- Languages Section -->
  <g transform="translate(40, 260)">
    <text x="0" y="0" class="stat-label secondary">Top Languages</text>

    ${topLanguages
      .map((lang, i) => {
        // Each language has equal representation since we don't have byte counts
        const barWidth = 560 / topLanguages.length;
        return `
      <g transform="translate(0, ${30 + i * 25})" ${animations.languageFadeIn} style="animation-delay: ${0.4 + i * 0.1}s">
        <text x="0" y="0" class="subtitle primary">${lang.name}</text>
        <rect x="120" y="-12" width="560" height="16" fill="${theme.colors.border}" opacity="0.2" rx="8"/>
        <rect x="120" y="-12" width="${barWidth}" height="16" fill="${lang.color || theme.colors.accent}" rx="8" ${animations.progressBar}/>
      </g>
    `;
      })
      .join('')}
  </g>

  ${animations.overlayEffects}
</svg>
  `.trim();

  return svg;
}

/**
 * Get theme-specific animation definitions
 */
function getThemeAnimations(themeName: PremiumThemeName) {
  switch (themeName) {
    case 'satan':
      return {
        defs: `
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="flameGradient">
            <stop offset="0%" stop-color="#ff4500">
              <animate attributeName="stop-color"
                       values="#ff4500;#ff6b35;#ff0000;#ff4500"
                       dur="3s"
                       repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="#3d0000"/>
          </radialGradient>
        `,
        styles: `
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes progressGrow {
            from { width: 0; }
            to { width: 100%; }
          }
        `,
        textGlow: 'filter="url(#glow)"',
        avatarPulse: `<animate attributeName="opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite"/>`,
        cardAnimation: `<animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>`,
        statsFadeIn: 'style="animation: fadeIn 0.6s ease-out forwards; opacity: 0;"',
        languageFadeIn: 'style="animation: fadeIn 0.6s ease-out forwards; opacity: 0;"',
        progressBar: 'style="animation: progressGrow 1.5s ease-out forwards; transform-origin: left;"',
        overlayEffects: `
          <ellipse cx="200" cy="500" rx="150" ry="100" fill="url(#flameGradient)" opacity="0.15" style="animation: pulse 4s ease-in-out infinite;"/>
          <ellipse cx="600" cy="520" rx="120" ry="80" fill="#ff6b35" opacity="0.1" style="animation: pulse 3s ease-in-out infinite; animation-delay: 1s;"/>
        `,
      };

    case 'neon':
      return {
        defs: `
          <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00ffff">
              <animate attributeName="stop-color"
                       values="#00ffff;#ff00ff;#00ffff"
                       dur="4s"
                       repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="#ff00ff">
              <animate attributeName="stop-color"
                       values="#ff00ff;#00ffff;#ff00ff"
                       dur="4s"
                       repeatCount="indefinite"/>
            </stop>
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        `,
        styles: `
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(${imageConfig.height + 100}px); }
          }
          @keyframes glitch {
            0%, 100% { transform: translateX(0); }
            33% { transform: translateX(-2px); }
            66% { transform: translateX(2px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes progressGrow {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
        `,
        textGlow: 'filter="url(#neonGlow)"',
        avatarPulse: `<animate attributeName="stroke-width" values="0;2;0" dur="2s" repeatCount="indefinite" stroke="#00ffff"/>`,
        cardAnimation: `<animate attributeName="stroke" values="#00ffff;#ff00ff;#00ffff" dur="4s" repeatCount="indefinite"/>`,
        statsFadeIn: 'style="animation: fadeIn 0.6s ease-out forwards; opacity: 0;"',
        languageFadeIn: 'style="animation: fadeIn 0.6s ease-out forwards; opacity: 0;"',
        progressBar: 'style="animation: progressGrow 1.5s ease-out forwards;"',
        overlayEffects: `
          <rect x="0" y="0" width="100%" height="2" fill="#00ffff" opacity="0.4" style="animation: scanline 6s linear infinite;"/>
          <rect x="0" y="20" width="100%" height="1" fill="#ff00ff" opacity="0.2" style="animation: scanline 8s linear infinite; animation-delay: 2s;"/>
        `,
      };

    case 'zen':
      return {
        defs: `
          <radialGradient id="zenGlow">
            <stop offset="0%" stop-color="#84a59d" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#84a59d" stop-opacity="0"/>
          </radialGradient>
        `,
        styles: `
          @keyframes breathe {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes progressGrow {
            from { width: 0; }
            to { width: 100%; }
          }
        `,
        textGlow: '',
        avatarPulse: `<animate attributeName="opacity" values="0.1;0.15;0.1" dur="6s" repeatCount="indefinite"/>`,
        cardAnimation: '',
        statsFadeIn: 'style="animation: fadeIn 1s ease-out forwards; opacity: 0;"',
        languageFadeIn: 'style="animation: fadeIn 1s ease-out forwards; opacity: 0;"',
        progressBar: 'style="animation: progressGrow 2s ease-out forwards;"',
        overlayEffects: `
          <circle cx="400" cy="300" r="250" fill="none" stroke="#84a59d" stroke-width="8" opacity="0.08" style="animation: breathe 8s ease-in-out infinite; transform-origin: center;">
            <animateTransform attributeName="transform" type="rotate" from="0 400 300" to="360 400 300" dur="300s" repeatCount="indefinite"/>
          </circle>
        `,
      };

    case 'github-dark':
      return {
        defs: '',
        styles: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes progressGrow {
            from { width: 0; }
            to { width: 100%; }
          }
        `,
        textGlow: '',
        avatarPulse: '',
        cardAnimation: '',
        statsFadeIn: 'style="animation: fadeIn 0.8s ease-out forwards; opacity: 0;"',
        languageFadeIn: 'style="animation: fadeIn 0.8s ease-out forwards; opacity: 0;"',
        progressBar: 'style="animation: progressGrow 1.2s ease-out forwards;"',
        overlayEffects: '',
      };

    case 'dracula':
      return {
        defs: `
          <radialGradient id="draculaGlow">
            <stop offset="0%" stop-color="#bd93f9"/>
            <stop offset="100%" stop-color="#ff79c6"/>
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        `,
        styles: `
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes progressGrow {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes dotPulse {
            0%, 100% { r: 6; opacity: 0.2; }
            50% { r: 8; opacity: 0.4; }
          }
        `,
        textGlow: 'filter="url(#softGlow)"',
        avatarPulse: `<animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite"/>`,
        cardAnimation: `<animate attributeName="stroke-opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite"/>`,
        statsFadeIn: 'style="animation: fadeIn 0.6s ease-out forwards; opacity: 0;"',
        languageFadeIn: 'style="animation: fadeIn 0.6s ease-out forwards; opacity: 0;"',
        progressBar: 'style="animation: progressGrow 1.5s ease-out forwards;"',
        overlayEffects: `
          <circle cx="100" cy="80" r="6" fill="#bd93f9" style="animation: dotPulse 3s ease-in-out infinite;"/>
          <circle cx="120" cy="110" r="6" fill="#ff79c6" style="animation: dotPulse 3s ease-in-out infinite; animation-delay: 0.5s;"/>
          <circle cx="140" cy="90" r="6" fill="#50fa7b" style="animation: dotPulse 3s ease-in-out infinite; animation-delay: 1s;"/>
          <circle cx="110" cy="140" r="6" fill="#f1fa8c" style="animation: dotPulse 3s ease-in-out infinite; animation-delay: 1.5s;"/>
          <circle cx="160" cy="120" r="6" fill="#bd93f9" style="animation: dotPulse 3s ease-in-out infinite; animation-delay: 2s;"/>
        `,
      };

    default:
      return {
        defs: '',
        styles: '',
        textGlow: '',
        avatarPulse: '',
        cardAnimation: '',
        statsFadeIn: '',
        languageFadeIn: '',
        progressBar: '',
        overlayEffects: '',
      };
  }
}

/**
 * Get animated background patterns
 */
function getAnimatedBackgroundPattern(themeName: PremiumThemeName, theme: any): string {
  switch (themeName) {
    case 'satan':
      return '';

    case 'neon':
      return `
        <g opacity="0.15">
          ${Array.from({ length: 13 }, (_, i) =>
            `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${imageConfig.height}" stroke="#00ffff" stroke-width="1" opacity="0.3"/>`
          ).join('')}
          ${Array.from({ length: 10 }, (_, i) =>
            `<line x1="0" y1="${i * 60}" x2="${imageConfig.width}" y2="${i * 60}" stroke="#00ffff" stroke-width="1" opacity="0.3"/>`
          ).join('')}
        </g>
      `;

    case 'zen':
      return '';

    case 'github-dark':
      return '';

    case 'dracula':
      return '';

    default:
      return '';
  }
}

/**
 * Generate error SVG
 */
function generateErrorSVG(message: string, subtitle?: string): string {
  return `
<svg width="${imageConfig.width}" height="${imageConfig.height}"
     xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="400" y="280" text-anchor="middle"
        font-family="system-ui" font-size="32" font-weight="bold" fill="#ff4500">
    ${message}
  </text>
  ${subtitle ? `
  <text x="400" y="320" text-anchor="middle"
        font-family="system-ui" font-size="18" fill="#ff6b35">
    ${subtitle}
  </text>
  ` : ''}
</svg>
  `.trim();
}

/**
 * GET /api/card-animated
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usernameParam = searchParams.get('username');
    const themeParam = searchParams.get('theme');

    const rawParams = {
      username: usernameParam,
      theme: themeParam,
    };

    let validatedParams;
    try {
      validatedParams = validateCardQuery(rawParams);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid parameters';
      const svg = generateErrorSVG('Validation Error', errorMessage);
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (!validatedParams.username) {
      const svg = generateErrorSVG('Missing Username', 'Add ?username=yourname');
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Fetch GitHub data
    let data;
    try {
      data = await fetchGitHubData(validatedParams.username);
    } catch (error) {
      console.error('GitHub API error:', error);
      const svg = generateErrorSVG('GitHub API Error', 'Unable to fetch user data');
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (!data) {
      const svg = generateErrorSVG('User Not Found', `@${validatedParams.username}`);
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Generate animated SVG
    const svg = await generateAnimatedCardSVG(
      data,
      validatedParams.username,
      (validatedParams.theme || 'satan') as PremiumThemeName
    );

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    const svg = generateErrorSVG('Server Error', 'Please try again later');
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
