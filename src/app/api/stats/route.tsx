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
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}`,
    },
  });
}

/**
 * Generate stats widget image
 */
function generateStatsImage(stats: CompactStats, theme: Theme): NextResponse {
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
          padding: 20,
        }}
      >
        {/* Main stat - Stars */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: theme.primaryText,
              display: 'flex',
            }}
          >
            <span>{stats.totalStars.toLocaleString()}</span>
          </div>
          <div
            style={{
              fontSize: 14,
              color: theme.secondaryText,
              display: 'flex',
            }}
          >
            <span>Total Stars</span>
          </div>
        </div>

        {/* Secondary stats row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 30,
            justifyContent: 'center',
          }}
        >
          {/* Contributions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.primaryText,
                display: 'flex',
              }}
            >
              <span>{stats.totalContributions.toLocaleString()}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.secondaryText,
                display: 'flex',
              }}
            >
              <span>Contributions</span>
            </div>
          </div>

          {/* Repos */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.primaryText,
                display: 'flex',
              }}
            >
              <span>{stats.totalRepos.toLocaleString()}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.secondaryText,
                display: 'flex',
              }}
            >
              <span>Repos</span>
            </div>
          </div>

          {/* Followers */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.primaryText,
                display: 'flex',
              }}
            >
              <span>{stats.followers.toLocaleString()}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.secondaryText,
                display: 'flex',
              }}
            >
              <span>Followers</span>
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
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}`,
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
