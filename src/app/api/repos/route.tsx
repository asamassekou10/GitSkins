/**
 * GitSkins - Repo Widget API Route
 *
 * Generates a widget card for a single repository.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateRepoQuery } from '@/lib/validations';
import { fetchRepoData } from '@/lib/github';
import { getTheme } from '@/registry/themes';
import { widgetConfig, apiConfig } from '@/config/site';
import type { Theme, RepoData } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const { width, height } = widgetConfig.repos;

/**
 * Truncate description to fit
 */
function truncateDescription(desc: string | null, maxLength: number = 60): string {
  if (!desc) return '';
  if (desc.length <= maxLength) return desc;
  return `${desc.substring(0, maxLength)}...`;
}

/**
 * Format number with K/M suffix
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Generate error image for repo widget
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
            fontSize: 18,
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
 * Generate repo widget image with premium design
 */
function generateRepoImage(repo: RepoData, theme: Theme): NextResponse {
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
          padding: 18,
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative corner glow */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${theme.accentColor}12 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Top section: Repo icon and name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 18,
              display: 'flex',
            }}
          >
            <span>📁</span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: theme.primaryText,
              display: 'flex',
            }}
          >
            <span>{repo.name}</span>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 12,
            color: theme.secondaryText,
            lineHeight: 1.4,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <span>{truncateDescription(repo.description, 80) || 'No description available'}</span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            paddingTop: 10,
            borderTop: `1px solid ${theme.borderColor}`,
          }}
        >
          {/* Stars */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 14,
                display: 'flex',
              }}
            >
              <span>⭐</span>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.primaryText,
                display: 'flex',
              }}
            >
              <span>{formatNumber(repo.stargazerCount)}</span>
            </div>
          </div>

          {/* Forks */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 14,
                display: 'flex',
              }}
            >
              <span>🔀</span>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.primaryText,
                display: 'flex',
              }}
            >
              <span>{formatNumber(repo.forkCount)}</span>
            </div>
          </div>

          {/* Language */}
          {repo.primaryLanguage ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginLeft: 'auto',
                background: theme.cardBg,
                padding: '4px 10px',
                borderRadius: 12,
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: repo.primaryLanguage.color || '#808080',
                  boxShadow: `0 0 6px ${repo.primaryLanguage.color || '#808080'}60`,
                  display: 'flex',
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: theme.secondaryText,
                  display: 'flex',
                }}
              >
                <span>{repo.primaryLanguage.name}</span>
              </div>
            </div>
          ) : null}
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
 * GET /api/repos
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const usernameParam = searchParams.get('username');
  const repoParam = searchParams.get('repo');
  const themeParam = searchParams.get('theme');

  const theme = getTheme(themeParam || undefined);

  // Validate parameters
  let validatedParams;
  try {
    validatedParams = validateRepoQuery({
      username: usernameParam,
      repo: repoParam,
      theme: themeParam,
    });
  } catch {
    return generateErrorImage('Invalid parameters', theme);
  }

  // Fetch repo data
  let data;
  try {
    data = await fetchRepoData(validatedParams.username, validatedParams.repo);
  } catch {
    return generateErrorImage('API Error', theme);
  }

  if (!data) {
    return generateErrorImage('Repo not found', theme);
  }

  return generateRepoImage(data, theme);
}
