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
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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

  // Note: Custom font loading disabled due to Edge runtime compatibility issues
  // Google Fonts API doesn't work reliably in Edge runtime
  // Using system fonts provides consistent, fast rendering
  const fontData: ArrayBuffer | undefined = undefined;

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: imageConfig.width,
          height: imageConfig.height,
          background: theme.colors.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          position: 'relative',
          overflow: 'hidden',
          padding: 24,
        }}
      >
        {/* Background Pattern Layer */}
        {getPremiumBackgroundPattern(theme)}

        {/* Main Card Container with premium styling */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: `linear-gradient(165deg, ${theme.colors.cardBg}dd 0%, ${theme.colors.cardBg}aa 50%, ${theme.colors.bg}dd 100%)`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 24,
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
            overflow: 'hidden',
          }}
        >
          {/* Accent Bar at Top */}
          <div
            style={{
              width: '100%',
              height: 4,
              background: `linear-gradient(90deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 50%, ${theme.colors.accent} 100%)`,
              display: 'flex',
              boxShadow: `0 2px 12px ${theme.colors.accent}40`,
            }}
          />

          {/* Header Section - Redesigned */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '32px 40px 24px 40px',
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)`,
              position: 'relative',
            }}
          >
            {/* Profile Row */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 }}>
              {/* Avatar with premium glow */}
              <div
                style={{
                  position: 'relative',
                  marginRight: 28,
                  display: 'flex',
                }}
              >
                <img
                  src={data.avatarUrl}
                  alt={username}
                  width="96"
                  height="96"
                  style={{
                    borderRadius: 24,
                    border: `2px solid ${theme.colors.accent}`,
                    boxShadow: `0 8px 32px ${theme.colors.accent}50, 0 0 40px ${theme.colors.accent}30, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                  }}
                />
              </div>

              {/* User Info */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: theme.colors.primary,
                    marginBottom: 8,
                    display: 'flex',
                    letterSpacing: -0.5,
                    textShadow: `${theme.effects.textGlow || 'none'}, 0 2px 8px rgba(0, 0, 0, 0.3)`,
                  }}
                >
                  <span>{data.name || username}</span>
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: theme.colors.accent,
                    marginBottom: 12,
                    display: 'flex',
                    fontWeight: 600,
                    opacity: 0.9,
                  }}
                >
                  <span>@{username}</span>
                </div>
                {data.bio && (
                  <div
                    style={{
                      fontSize: 14,
                      color: theme.colors.secondary,
                      opacity: 0.85,
                      display: 'flex',
                      lineHeight: 1.5,
                      maxWidth: '500px',
                    }}
                  >
                    <span>{truncateBio(data.bio)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Row - Horizontal */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
              {/* Stars Stat */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  background: `linear-gradient(135deg, ${theme.colors.accent}15 0%, ${theme.colors.accent}08 100%)`,
                  padding: '16px 32px',
                  borderRadius: 16,
                  border: `1px solid ${theme.colors.accent}30`,
                  boxShadow: `0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 11, color: theme.colors.secondary, opacity: 0.7, display: 'flex', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    <span>Total Stars</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: theme.colors.primary, display: 'flex', letterSpacing: -0.5 }}>
                    <span>{data.totalStars.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Contributions Stat */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  background: `linear-gradient(135deg, ${theme.colors.accent}15 0%, ${theme.colors.accent}08 100%)`,
                  padding: '16px 32px',
                  borderRadius: 16,
                  border: `1px solid ${theme.colors.accent}30`,
                  boxShadow: `0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 11, color: theme.colors.secondary, opacity: 0.7, display: 'flex', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    <span>Contributions</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: theme.colors.primary, display: 'flex', letterSpacing: -0.5 }}>
                    <span>{data.totalContributions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contribution Graph Section */}
          <div
            style={{
              padding: '28px 40px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {/* Section Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 20,
                  background: `linear-gradient(180deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%)`,
                  borderRadius: 3,
                  display: 'flex',
                  boxShadow: `0 0 8px ${theme.colors.accent}40`,
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  color: theme.colors.primary,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  display: 'flex',
                }}
              >
                <span>Contribution Activity</span>
              </div>
            </div>

            {/* Graph Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: imageConfig.squareGap,
                background: `linear-gradient(165deg, ${theme.colors.cardBg}40 0%, ${theme.colors.bg}60 100%)`,
                padding: 20,
                borderRadius: 16,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: `0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`,
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
                    // Map contribution count to theme graph colors with better progression
                    const colorIndex = Math.min(
                      Math.floor((day.contributionCount / 15) * (theme.graphColors.length - 1)),
                      theme.graphColors.length - 1
                    );
                    const color = day.contributionCount === 0 ? theme.colors.cardBg : theme.graphColors[colorIndex];

                    // Enhanced glow for active days
                    const isHighActivity = day.contributionCount > 10;
                    const isMediumActivity = day.contributionCount > 5 && day.contributionCount <= 10;

                    let glowShadow = 'none';
                    if (isHighActivity) {
                      glowShadow = `0 0 10px ${theme.colors.accent}70, 0 0 5px ${theme.colors.accent}50`;
                    } else if (isMediumActivity) {
                      glowShadow = `0 0 6px ${theme.colors.accent}40`;
                    }

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        style={{
                          width: imageConfig.squareSize,
                          height: imageConfig.squareSize,
                          background: color,
                          borderRadius: 4,
                          boxShadow: glowShadow,
                          border: day.contributionCount > 0 ? `0.5px solid ${theme.colors.accent}20` : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer with improved styling */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 28,
              fontSize: 11,
              color: theme.colors.secondary,
              opacity: 0.6,
              display: 'flex',
              fontWeight: 500,
              letterSpacing: 0.5,
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
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
