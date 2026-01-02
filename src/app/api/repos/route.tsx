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
 * Generate repo widget image
 */
function generateRepoImage(repo: RepoData, theme: Theme): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          border: `2px solid ${theme.borderColor}`,
          borderRadius: 12,
          padding: 16,
          justifyContent: 'space-between',
        }}
      >
        {/* Repo name */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.primaryText,
            display: 'flex',
          }}
        >
          <span>{repo.name}</span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 12,
            color: theme.secondaryText,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>{truncateDescription(repo.description) || 'No description'}</span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Stars */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: theme.secondaryText,
                display: 'flex',
              }}
            >
              <span>{formatNumber(repo.stargazerCount)}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.secondaryText,
                opacity: 0.7,
                display: 'flex',
              }}
            >
              <span>stars</span>
            </div>
          </div>

          {/* Forks */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: theme.secondaryText,
                display: 'flex',
              }}
            >
              <span>{formatNumber(repo.forkCount)}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.secondaryText,
                opacity: 0.7,
                display: 'flex',
              }}
            >
              <span>forks</span>
            </div>
          </div>

          {/* Language */}
          {repo.primaryLanguage ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginLeft: 'auto',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: repo.primaryLanguage.color || '#808080',
                  display: 'flex',
                }}
              />
              <div
                style={{
                  fontSize: 12,
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
