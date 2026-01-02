/**
 * GitSkins - Streak Widget API Route
 *
 * Generates a widget showing current streak, longest streak, and total active days.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateWidgetQuery } from '@/lib/validations';
import { fetchExtendedGitHubData } from '@/lib/github';
import { getTheme } from '@/registry/themes';
import { widgetConfig, apiConfig } from '@/config/site';
import type { Theme, StreakData } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const { width, height } = widgetConfig.streak;

/**
 * Generate error image for streak widget
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
 * Generate streak widget image
 */
function generateStreakImage(streak: StreakData, theme: Theme): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          background: theme.bg,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          fontFamily: 'system-ui',
          border: `2px solid ${theme.borderColor}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        {/* Current Streak */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: theme.streakColors.fire,
              display: 'flex',
            }}
          >
            <span>{streak.currentStreak}</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.secondaryText,
              display: 'flex',
            }}
          >
            <span>Current Streak</span>
          </div>
        </div>

        {/* Longest Streak */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: theme.streakColors.trophy,
              display: 'flex',
            }}
          >
            <span>{streak.longestStreak}</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.secondaryText,
              display: 'flex',
            }}
          >
            <span>Longest Streak</span>
          </div>
        </div>

        {/* Total Active Days */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: theme.streakColors.calendar,
              display: 'flex',
            }}
          >
            <span>{streak.totalActiveDays}</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.secondaryText,
              display: 'flex',
            }}
          >
            <span>Total Days</span>
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
 * GET /api/streak
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

  return generateStreakImage(data.streak, theme);
}
