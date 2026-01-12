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
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Generate streak widget image with premium design
 */
function generateStreakImage(streak: StreakData, theme: Theme): NextResponse {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          background: `linear-gradient(165deg, ${theme.cardBg}dd 0%, ${theme.bg}dd 50%, ${theme.cardBg}aa 100%)`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          border: `1px solid ${theme.borderColor}`,
          borderRadius: 20,
          padding: 24,
          gap: 24,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Enhanced glow backgrounds */}
        <div
          style={{
            position: 'absolute',
            left: '15%',
            top: '50%',
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${theme.streakColors.fire}25 0%, ${theme.streakColors.fire}10 40%, transparent 70%)`,
            transform: 'translateY(-50%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '15%',
            top: '50%',
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${theme.accentColor}15 0%, transparent 70%)`,
            transform: 'translateY(-50%)',
            display: 'flex',
          }}
        />

        {/* Current Streak - Featured */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.accentColor}10 0%, ${theme.bg}80 100%)`,
            borderRadius: 14,
            padding: 18,
            border: `1px solid ${theme.accentColor}25`,
            height: '100%',
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
              width: 50,
              height: 50,
              background: `radial-gradient(circle at top right, ${theme.streakColors.fire}10 0%, transparent 70%)`,
              display: 'flex',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontSize: 24,
                display: 'flex',
              }}
            >
              <span>🔥</span>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: theme.streakColors.fire,
                display: 'flex',
                textShadow: `0 0 20px ${theme.streakColors.fire}40`,
              }}
            >
              <span>{streak.currentStreak}</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              color: theme.secondaryText,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              display: 'flex',
            }}
          >
            <span>Current Streak</span>
          </div>
        </div>

        {/* Longest Streak */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.accentColor}10 0%, ${theme.bg}80 100%)`,
            borderRadius: 14,
            padding: 18,
            border: `1px solid ${theme.accentColor}25`,
            height: '100%',
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
              width: 50,
              height: 50,
              background: `radial-gradient(circle at top right, ${theme.streakColors.trophy}10 0%, transparent 70%)`,
              display: 'flex',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontSize: 24,
                display: 'flex',
              }}
            >
              <span>🏆</span>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: theme.streakColors.trophy,
                display: 'flex',
              }}
            >
              <span>{streak.longestStreak}</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              color: theme.secondaryText,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              display: 'flex',
            }}
          >
            <span>Longest Streak</span>
          </div>
        </div>

        {/* Total Active Days */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.accentColor}10 0%, ${theme.bg}80 100%)`,
            borderRadius: 14,
            padding: 18,
            border: `1px solid ${theme.accentColor}25`,
            height: '100%',
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
              width: 50,
              height: 50,
              background: `radial-gradient(circle at top right, ${theme.streakColors.calendar}10 0%, transparent 70%)`,
              display: 'flex',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontSize: 24,
                display: 'flex',
              }}
            >
              <span>📅</span>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: theme.streakColors.calendar,
                display: 'flex',
              }}
            >
              <span>{streak.totalActiveDays}</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              color: theme.secondaryText,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
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
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
