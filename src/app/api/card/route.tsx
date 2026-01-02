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
  truncateBio,
} from '@/lib/image-generator';
import { imageConfig, apiConfig, siteConfig } from '@/config/site';
import { getThemeIcons } from '@/lib/theme-icons';
import { getThemeBackground } from '@/lib/theme-patterns';
import type { GitHubData, ThemeName } from '@/types';

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
 * Generate success card image with premium design
 */
function generateCardImage(
  data: GitHubData,
  username: string,
  theme: ReturnType<typeof getTheme>,
  themeName: ThemeName
): NextResponse {
  const themeIcons = getThemeIcons(themeName);
  const iconColor = theme.iconColor || theme.accentColor;
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: imageConfig.width,
          height: imageConfig.height,
          background: `linear-gradient(145deg, ${theme.bg} 0%, ${theme.cardBg} 50%, ${theme.bg} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          border: `2px solid ${theme.borderColor}`,
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Theme-specific background patterns */}
        {getThemeBackground(themeName, theme)}

        {/* Decorative gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: `radial-gradient(circle, ${theme.accentColor}15 0%, transparent 70%)`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            background: `radial-gradient(circle, ${theme.accentColor}10 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '28px 40px',
            borderBottom: `1px solid ${theme.borderColor}`,
          }}
        >
          {/* Avatar with glow */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -5,
                left: -5,
                width: 90,
                height: 90,
                background: `radial-gradient(circle, ${theme.accentColor}30 0%, transparent 70%)`,
                borderRadius: '50%',
                display: 'flex',
              }}
            />
            <img
              src={data.avatarUrl}
              alt={username}
              width="80"
              height="80"
              style={{
                borderRadius: '50%',
                border: `3px solid ${theme.accentColor}`,
                marginRight: 24,
              }}
            />
          </div>
          {/* User Info */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: theme.primaryText,
                marginBottom: 6,
                display: 'flex',
                letterSpacing: -0.5,
              }}
            >
              <span>{data.name || username}</span>
            </div>
            <div
              style={{
                fontSize: 18,
                color: theme.secondaryText,
                marginBottom: 6,
                display: 'flex',
              }}
            >
              <span>@{username}</span>
            </div>
            <div
              style={{
                fontSize: 14,
                color: theme.secondaryText,
                opacity: 0.75,
                display: data.bio ? 'flex' : 'none',
              }}
            >
              <span>{truncateBio(data.bio || '')}</span>
            </div>
          </div>
          {/* Stats Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: theme.cardBg,
                padding: '12px 20px',
                borderRadius: 12,
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div style={{ display: 'flex', marginBottom: 4 }}>
                {themeIcons.star({ size: 20, color: iconColor })}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.primaryText, display: 'flex' }}>
                <span>{data.totalStars.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 10, color: theme.secondaryText, opacity: 0.8, display: 'flex' }}>
                <span>stars</span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: theme.cardBg,
                padding: '12px 20px',
                borderRadius: 12,
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div style={{ display: 'flex', marginBottom: 4 }}>
                {themeIcons.fire({ size: 20, color: iconColor })}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.primaryText, display: 'flex' }}>
                <span>{data.totalContributions.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 10, color: theme.secondaryText, opacity: 0.8, display: 'flex' }}>
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
                background: theme.accentColor,
                borderRadius: 2,
                display: 'flex',
              }}
            />
            <div
              style={{
                fontSize: 14,
                color: theme.secondaryText,
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
              background: theme.cardBg,
              padding: 16,
              borderRadius: 12,
              border: `1px solid ${theme.borderColor}`,
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
            color: theme.secondaryText,
            opacity: 0.5,
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
    return generateCardImage(data, validatedParams.username, theme, validatedParams.theme || 'satan');
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
