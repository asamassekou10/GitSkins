/**
 * GitSkins - Card API Route
 * 
 * Main API endpoint for generating GitHub profile cards.
 * Handles validation, data fetching, and image generation.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateCardQuery } from '@/lib/validations';
import { fetchGitHubData } from '@/lib/github';
import { getTheme } from '@/registry/themes';
import {
  getFireColor,
  hasGlow,
  generateGlow,
  truncateBio,
} from '@/lib/image-generator';
import { imageConfig, apiConfig, siteConfig } from '@/config/site';
import type { GitHubData } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Generate error image response
 * Always returns an image (never JSON) to prevent broken image icons
 */
function generateErrorImage(
  message: string,
  subtitle?: string
): NextResponse {
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
        {subtitle ? (
          <div style={{ fontSize: 24, marginTop: 20, color: '#ff6b35', display: 'flex' }}>
            <span>{subtitle}</span>
          </div>
        ) : null}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 30,
            fontSize: 18,
            color: '#ff6b35',
            opacity: 0.7,
            display: 'flex',
          }}
        >
          <span>{siteConfig.footerText}</span>
        </div>
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
 * Generate "missing username" prompt image
 */
function generateMissingUsernameImage(theme: ReturnType<typeof getTheme>): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: imageConfig.width,
          height: imageConfig.height,
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.primaryText,
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20, display: 'flex' }}>
          <span>{siteConfig.name}</span>
        </div>
        <div style={{ fontSize: 24, color: theme.secondaryText, display: 'flex' }}>
          <span>Add ?username=yourname to get started</span>
        </div>
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
 * Generate "user not found" image
 */
function generateUserNotFoundImage(
  username: string,
  theme: ReturnType<typeof getTheme>
): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: imageConfig.width,
          height: imageConfig.height,
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.primaryText,
          fontFamily: 'system-ui',
          border: `4px solid ${theme.borderColor}`,
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 20, fontWeight: 'bold', display: 'flex' }}>
          <span>SOUL NOT FOUND</span>
        </div>
        <div style={{ fontSize: 32, color: theme.secondaryText, display: 'flex' }}>
          <span>@{username}</span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 30,
            fontSize: 18,
            color: theme.secondaryText,
            display: 'flex',
          }}
        >
          <span>{siteConfig.footerText}</span>
        </div>
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
 * Generate contribution graph using Flex layout
 * 
 * Structure: Flex Row of Weeks, each Week is a Flex Column of 7 Day Squares
 * This approach works better with Satori's limited CSS support
 */
function generateContributionGraph(
  weeks: Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>,
  theme: ReturnType<typeof getTheme>
): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: imageConfig.squareGap,
      }}
    >
      {weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: imageConfig.squareGap,
          }}
        >
          {week.contributionDays.map((day, dayIndex) => {
            const color = getFireColor(day.contributionCount, theme);
            const glow = hasGlow(day.contributionCount);

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                style={{
                  width: imageConfig.squareSize,
                  height: imageConfig.squareSize,
                  background: color,
                  borderRadius: 2,
                  boxShadow: glow ? generateGlow(color, imageConfig.squareSize) : 'none',
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * Generate success card image
 */
function generateCardImage(
  data: GitHubData,
  username: string,
  theme: ReturnType<typeof getTheme>
): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: imageConfig.width,
          height: imageConfig.height,
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          border: `4px solid ${theme.borderColor}`,
          position: 'relative',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '30px 50px',
            borderBottom: `2px solid ${theme.borderColor}`,
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
              border: `3px solid ${theme.accentColor}`,
              marginRight: 20,
            }}
          />
          {/* User Info */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: theme.primaryText,
                marginBottom: 8,
                display: 'flex',
              }}
            >
              <span>{data.name || username}</span>
            </div>
            <div
              style={{
                fontSize: 20,
                color: theme.secondaryText,
                marginBottom: 8,
                display: 'flex',
              }}
            >
              <span>@{username}</span>
            </div>
            <div
              style={{
                fontSize: 16,
                color: theme.secondaryText,
                opacity: 0.8,
                display: data.bio ? 'flex' : 'none',
              }}
            >
              <span>{truncateBio(data.bio || '')}</span>
            </div>
          </div>
          {/* Stats */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 24, color: theme.primaryText, display: 'flex' }}>
              <span style={{ color: theme.secondaryText }}>⭐ </span>
              <span>{data.totalStars.toLocaleString()} stars</span>
            </div>
            <div style={{ fontSize: 24, color: theme.primaryText, display: 'flex' }}>
              <span style={{ color: theme.secondaryText }}>🔥 </span>
              <span>{data.totalContributions.toLocaleString()} contributions</span>
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div
          style={{
            padding: '30px 50px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: theme.primaryText,
              marginBottom: 15,
              fontWeight: 'bold',
              display: 'flex',
            }}
          >
            <span>Contribution Graph</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: imageConfig.squareGap,
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
                  const color = getFireColor(day.contributionCount, theme);
                  const glow = hasGlow(day.contributionCount);

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      style={{
                        width: imageConfig.squareSize,
                        height: imageConfig.squareSize,
                        background: color,
                        borderRadius: 2,
                        boxShadow: glow ? generateGlow(color, imageConfig.squareSize) : 'none',
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
            bottom: 20,
            right: 30,
            fontSize: 18,
            color: theme.secondaryText,
            opacity: 0.7,
            display: 'flex',
          }}
        >
          <span>{siteConfig.footerText}</span>
        </div>
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
 * GET /api/card
 * 
 * Generate GitHub profile card image
 * 
 * Query Parameters:
 * - username: GitHub username (required)
 * - theme: Theme name (optional, defaults to 'satan')
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const usernameParam = searchParams.get('username');
    const themeParam = searchParams.get('theme');
    
    // Handle missing username early
    if (!usernameParam || usernameParam.trim() === '') {
      const theme = getTheme(themeParam || undefined);
      return generateMissingUsernameImage(theme);
    }

    const rawParams = {
      username: usernameParam,
      theme: themeParam,
    };

    // Validate input
    let validatedParams;
    try {
      validatedParams = validateCardQuery(rawParams);
    } catch (error) {
      // Validation error - return error image instead of JSON
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid request parameters';
      return generateErrorImage('Validation Error', errorMessage);
    }

    // Double-check username (shouldn't be needed, but safety check)
    if (!validatedParams.username) {
      const theme = getTheme(validatedParams.theme);
      return generateMissingUsernameImage(theme);
    }

    // Get theme
    const theme = getTheme(validatedParams.theme);

    // Fetch GitHub data
    let data;
    try {
      data = await fetchGitHubData(validatedParams.username);
    } catch (error) {
      // GitHub API error - return error image
      console.error('GitHub API error:', error);
      return generateErrorImage(
        'GitHub API Error',
        'Unable to fetch user data. Please try again later.'
      );
    }

    // Handle user not found
    if (!data) {
      return generateUserNotFoundImage(validatedParams.username, theme);
    }

    // Generate and return card image
    return generateCardImage(data, validatedParams.username, theme);
  } catch (error) {
    // Unexpected error - always return image, never JSON
    console.error('Unexpected error generating card:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return generateErrorImage('Error Generating Card', errorMessage);
  }
}

/**
 * HEAD /api/card
 * 
 * Return cache headers for preflight requests
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}`,
    },
  });
}
