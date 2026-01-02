/**
 * GitSkins - Premium Card API Route
 *
 * Enhanced API endpoint for generating premium GitHub profile cards
 * with rich fonts, effects, and visual designs.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateCardQuery } from '@/lib/validations';
import { fetchGitHubData } from '@/lib/github';
import { getPremiumTheme } from '@/registry/themes/premium-registry';
import { getFireColor, truncateBio } from '@/lib/image-generator';
import { imageConfig, apiConfig, siteConfig } from '@/config/site';
import { loadThemeFont } from '@/lib/fonts';
import { getPremiumBackgroundPattern } from '@/lib/premium-patterns';
import type { GitHubData } from '@/types';
import type { PremiumThemeName } from '@/types/premium-theme';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Generate error image response
 */
function generateErrorImage(message: string, subtitle?: string): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: imageConfig.width,
          height: imageConfig.height,
          background: '#0d1117',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4500',
          fontFamily: 'system-ui',
          border: '4px solid #30363d',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20, fontWeight: 'bold', display: 'flex' }}>
          <span>{message}</span>
        </div>
        {subtitle && (
          <div style={{ fontSize: 24, marginTop: 20, color: '#ff6b35', display: 'flex' }}>
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    ),
    {
      width: imageConfig.width,
      height: imageConfig.height,
    }
  );

  return new NextResponse(imageResponse.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}`,
    },
  });
}

/**
 * Generate premium card image
 */
async function generatePremiumCardImage(
  data: GitHubData,
  username: string,
  themeName: PremiumThemeName
): Promise<NextResponse> {
  const theme = getPremiumTheme(themeName);

  // Load the theme's custom font
  let fontData: ArrayBuffer | undefined;
  try {
    fontData = await loadThemeFont(theme);
  } catch (error) {
    console.error('Font loading failed, using system font:', error);
  }

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: imageConfig.width,
          height: imageConfig.height,
          background: theme.colors.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: fontData ? theme.font.family : 'system-ui',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern Layer */}
        {getPremiumBackgroundPattern(theme)}

        {/* Main Content Layer (z-index 10) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            border: `2px solid ${theme.colors.border}`,
            borderRadius: 20,
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '28px 40px',
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            {/* Avatar */}
            <img
              src={data.avatarUrl}
              alt={username}
              width="80"
              height="80"
              style={{
                borderRadius: '50%',
                border: `3px solid ${theme.colors.accent}`,
                marginRight: 24,
              }}
            />

            {/* User Info */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.colors.primary,
                  marginBottom: 6,
                  display: 'flex',
                  textShadow: theme.effects.textGlow || 'none',
                }}
              >
                <span>{data.name || username}</span>
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: theme.colors.secondary,
                  marginBottom: 6,
                  display: 'flex',
                }}
              >
                <span>@{username}</span>
              </div>
              {data.bio && (
                <div
                  style={{
                    fontSize: 14,
                    color: theme.colors.secondary,
                    opacity: 0.75,
                    display: 'flex',
                  }}
                >
                  <span>{truncateBio(data.bio)}</span>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: theme.colors.cardBg,
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: theme.effects.cardShadow || 'none',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.primary, display: 'flex' }}>
                  <span>{data.totalStars.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 10, color: theme.colors.secondary, opacity: 0.8, display: 'flex' }}>
                  <span>stars</span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: theme.colors.cardBg,
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: theme.effects.cardShadow || 'none',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.primary, display: 'flex' }}>
                  <span>{data.totalContributions.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 10, color: theme.colors.secondary, opacity: 0.8, display: 'flex' }}>
                  <span>contributions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contribution Graph */}
          <div
            style={{
              padding: '24px 40px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 18,
                  background: theme.colors.accent,
                  borderRadius: 2,
                  display: 'flex',
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: theme.colors.secondary,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  display: 'flex',
                }}
              >
                <span>Contribution Activity</span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: imageConfig.squareGap,
                background: theme.colors.cardBg,
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.effects.cardShadow || 'none',
              }}
            >
              {data.contributionCalendar.weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: imageConfig.squareGap,
                  }}
                >
                  {week.contributionDays.map((day, dayIndex) => {
                    // Map contribution count to theme graph colors
                    const colorIndex = Math.min(
                      Math.floor((day.contributionCount / 20) * (theme.graphColors.length - 1)),
                      theme.graphColors.length - 1
                    );
                    const color = day.contributionCount === 0 ? theme.colors.cardBg : theme.graphColors[colorIndex];

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        style={{
                          width: imageConfig.squareSize,
                          height: imageConfig.squareSize,
                          background: color,
                          borderRadius: 3,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 24,
              fontSize: 12,
              color: theme.colors.secondary,
              opacity: 0.5,
              display: 'flex',
            }}
          >
            <span>{siteConfig.footerText}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: imageConfig.width,
      height: imageConfig.height,
      fonts: fontData
        ? [
            {
              name: theme.font.family,
              data: fontData,
              weight: (theme.font.weight || 400) as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
              style: 'normal' as const,
            },
          ]
        : undefined,
    }
  );

  return new NextResponse(imageResponse.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}`,
    },
  });
}

/**
 * GET /api/premium-card
 *
 * Generate premium GitHub profile card image
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const usernameParam = searchParams.get('username');
    const themeParam = searchParams.get('theme');

    if (!usernameParam || usernameParam.trim() === '') {
      return generateErrorImage('Missing Username', 'Add ?username=yourname');
    }

    const rawParams = {
      username: usernameParam,
      theme: themeParam,
    };

    let validatedParams;
    try {
      validatedParams = validateCardQuery(rawParams);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid parameters';
      return generateErrorImage('Validation Error', errorMessage);
    }

    // Double-check username
    if (!validatedParams.username) {
      return generateErrorImage('Missing Username', 'Add ?username=yourname');
    }

    // Fetch GitHub data
    let data;
    try {
      data = await fetchGitHubData(validatedParams.username);
    } catch (error) {
      console.error('GitHub API error:', error);
      return generateErrorImage('GitHub API Error', 'Unable to fetch user data');
    }

    if (!data) {
      return generateErrorImage('User Not Found', `@${validatedParams.username}`);
    }

    // Generate premium card
    return await generatePremiumCardImage(
      data,
      validatedParams.username,
      (validatedParams.theme || 'satan') as PremiumThemeName
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return generateErrorImage('Error', errorMessage);
  }
}

/**
 * HEAD /api/premium-card
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}`,
    },
  });
}
