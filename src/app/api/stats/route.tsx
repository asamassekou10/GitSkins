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
          background: `linear-gradient(165deg, ${theme.cardBg}dd 0%, ${theme.bg}dd 50%, ${theme.cardBg}aa 100%)`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          border: `1px solid ${theme.borderColor}`,
          borderRadius: 20,
          padding: 28,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Enhanced glow effects in corners */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${theme.accentColor}20 0%, ${theme.accentColor}10 40%, transparent 70%)`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${theme.accentColor}15 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Title with accent bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div
            style={{
              width: 3,
              height: 22,
              background: `linear-gradient(180deg, ${theme.accentColor} 0%, ${theme.accentColor}60 100%)`,
              borderRadius: 3,
              display: 'flex',
              boxShadow: `0 0 10px ${theme.accentColor}40`,
            }}
          />
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.primaryText,
              letterSpacing: 1.5,
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
                background: `linear-gradient(135deg, ${theme.accentColor}12 0%, ${theme.bg}80 100%)`,
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.accentColor}25`,
                boxShadow: `0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
                position: 'relative',
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 60,
                  height: 60,
                  background: `radial-gradient(circle at top right, ${theme.accentColor}10 0%, transparent 70%)`,
                  display: 'flex',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 4,
                  position: 'relative',
                }}
              >
                {/* Custom Star SVG Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: 'flex' }}
                >
                  <defs>
                    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: theme.accentColor, stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: theme.accentColor, stopOpacity: 0.6 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="url(#starGrad)"
                  />
                </svg>
                <div
                  style={{
                    fontSize: 32,
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
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                <span>Total Stars</span>
              </div>
            </div>

            {/* Contributions */}
            <div
              style={{
                flex: 1,
                background: `linear-gradient(135deg, ${theme.accentColor}12 0%, ${theme.bg}80 100%)`,
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.accentColor}25`,
                boxShadow: `0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
                position: 'relative',
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 60,
                  height: 60,
                  background: `radial-gradient(circle at top right, ${theme.accentColor}10 0%, transparent 70%)`,
                  display: 'flex',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 4,
                  position: 'relative',
                }}
              >
                {/* Custom Activity SVG Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: 'flex' }}
                >
                  <defs>
                    <linearGradient id="activityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: theme.accentColor, stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: theme.accentColor, stopOpacity: 0.6 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 12L7 8L11 12L16 7L21 12M3 20H21V4H3V20Z"
                    stroke="url(#activityGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div
                  style={{
                    fontSize: 32,
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
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                <span>Contributions</span>
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
                background: `linear-gradient(135deg, ${theme.accentColor}12 0%, ${theme.bg}80 100%)`,
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.accentColor}25`,
                boxShadow: `0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
                position: 'relative',
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 60,
                  height: 60,
                  background: `radial-gradient(circle at top right, ${theme.accentColor}10 0%, transparent 70%)`,
                  display: 'flex',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 4,
                  position: 'relative',
                }}
              >
                {/* Custom Folder SVG Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: 'flex' }}
                >
                  <defs>
                    <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: theme.accentColor, stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: theme.accentColor, stopOpacity: 0.6 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H12L10 5H5C3.89543 5 3 5.89543 3 7Z"
                    fill="url(#folderGrad)"
                  />
                </svg>
                <div
                  style={{
                    fontSize: 32,
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
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                <span>Repositories</span>
              </div>
            </div>

            {/* Followers */}
            <div
              style={{
                flex: 1,
                background: `linear-gradient(135deg, ${theme.accentColor}12 0%, ${theme.bg}80 100%)`,
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.accentColor}25`,
                boxShadow: `0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
                position: 'relative',
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 60,
                  height: 60,
                  background: `radial-gradient(circle at top right, ${theme.accentColor}10 0%, transparent 70%)`,
                  display: 'flex',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 4,
                  position: 'relative',
                }}
              >
                {/* Custom Users SVG Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: 'flex' }}
                >
                  <defs>
                    <linearGradient id="usersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: theme.accentColor, stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: theme.accentColor, stopOpacity: 0.6 }} />
                    </linearGradient>
                  </defs>
                  <circle cx="9" cy="7" r="4" fill="url(#usersGrad)" />
                  <path
                    d="M3 21C3 17.134 6.134 14 10 14H8C11.866 14 15 17.134 15 21"
                    fill="url(#usersGrad)"
                  />
                  <circle cx="16" cy="8" r="3" fill="url(#usersGrad)" opacity="0.7" />
                  <path
                    d="M18 21C18 18.239 19.239 17 22 17"
                    stroke="url(#usersGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
                <div
                  style={{
                    fontSize: 32,
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
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
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
