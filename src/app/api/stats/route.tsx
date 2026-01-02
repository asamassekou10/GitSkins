/**
 * GitSkins - Stats Widget API Route
 *
 * Generates a compact stats widget showing stars, contributions, repos, and followers.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateWidgetQuery } from '@/lib/validations';
import { fetchExtendedGitHubData } from '@/lib/github';
import { getTheme } from '@/registry/themes';
import { widgetConfig, apiConfig, siteConfig } from '@/config/site';
import type { Theme, CompactStats } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const { width, height } = widgetConfig.stats;

/**
 * Generate error image for stats widget
 */
function generateErrorImage(message: string, theme: Theme): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          border: `2px solid ${theme.borderColor}`,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: theme.primaryText,
            display: 'flex',
          }}
        >
          <span>{message}</span>
        </div>
      </div>
    ),
    { width, height }
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
 * Generate stats widget image with premium design
 */
function generateStatsImage(stats: CompactStats, theme: Theme): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.cardBg} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          border: `1px solid ${theme.borderColor}`,
          borderRadius: 16,
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glow effect in corner */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            background: `radial-gradient(circle, ${theme.accentColor}15 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            gap: 8,
          }}
        >
          <div
            style={{
              width: 4,
              height: 20,
              background: theme.accentColor,
              borderRadius: 2,
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: theme.secondaryText,
              letterSpacing: 1,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            <span>GitHub Stats</span>
          </div>
        </div>

        {/* Stats Grid - 2x2 layout */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: 16,
          }}
        >
          {/* Top Row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
              flex: 1,
            }}
          >
            {/* Stars - Featured */}
            <div
              style={{
                flex: 1,
                background: theme.cardBg,
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    display: 'flex',
                  }}
                >
                  <span>⭐</span>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: theme.primaryText,
                    display: 'flex',
                  }}
                >
                  <span>{stats.totalStars.toLocaleString()}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: theme.secondaryText,
                  opacity: 0.8,
                  display: 'flex',
                }}
              >
                <span>Total Stars Earned</span>
              </div>
            </div>

            {/* Contributions */}
            <div
              style={{
                flex: 1,
                background: theme.cardBg,
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    display: 'flex',
                  }}
                >
                  <span>🔥</span>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: theme.primaryText,
                    display: 'flex',
                  }}
                >
                  <span>{stats.totalContributions.toLocaleString()}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: theme.secondaryText,
                  opacity: 0.8,
                  display: 'flex',
                }}
              >
                <span>Contributions This Year</span>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
              flex: 1,
            }}
          >
            {/* Repos */}
            <div
              style={{
                flex: 1,
                background: theme.cardBg,
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    display: 'flex',
                  }}
                >
                  <span>📦</span>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: theme.primaryText,
                    display: 'flex',
                  }}
                >
                  <span>{stats.totalRepos.toLocaleString()}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: theme.secondaryText,
                  opacity: 0.8,
                  display: 'flex',
                }}
              >
                <span>Public Repositories</span>
              </div>
            </div>

            {/* Followers */}
            <div
              style={{
                flex: 1,
                background: theme.cardBg,
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    display: 'flex',
                  }}
                >
                  <span>👥</span>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: theme.primaryText,
                    display: 'flex',
                  }}
                >
                  <span>{stats.followers.toLocaleString()}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: theme.secondaryText,
                  opacity: 0.8,
                  display: 'flex',
                }}
              >
                <span>Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width, height }
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
 * GET /api/stats
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const usernameParam = searchParams.get('username');
  const themeParam = searchParams.get('theme');

  const theme = getTheme(themeParam || undefined);

  // Validate parameters
  let validatedParams;
  try {
    validatedParams = validateWidgetQuery({
      username: usernameParam,
      theme: themeParam,
    });
  } catch {
    return generateErrorImage('Invalid parameters', theme);
  }

  // Fetch GitHub data
  let data;
  try {
    data = await fetchExtendedGitHubData(validatedParams.username);
  } catch {
    return generateErrorImage('API Error', theme);
  }

  if (!data) {
    return generateErrorImage('User not found', theme);
  }

  return generateStatsImage(data.stats, theme);
}
