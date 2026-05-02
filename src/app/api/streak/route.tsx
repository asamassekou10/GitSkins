/**
 * GitSkins - Streak Widget API Route
 *
 * Generates a widget showing current streak, longest streak, and total active days.
 */

import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateWidgetQuery } from '@/lib/validations';
import { fetchExtendedGitHubData } from '@/lib/github';
import { getThemeUniversal } from '@/lib/theme-converter';
import { widgetConfig, apiConfig } from '@/config/site';
import type { Theme, StreakData } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { width, height } = widgetConfig.streak;

/**
 * Generate error image for streak widget
 */
async function generateErrorImage(message: string, theme: Theme): Promise<NextResponse> {
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

  const _buf = await imageResponse.arrayBuffer();
  return new NextResponse(Buffer.from(_buf), {
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
async function generateStreakImage(streak: StreakData, theme: Theme): Promise<NextResponse> {
  const streakItems = [
    { label: 'Current', value: streak.currentStreak, color: theme.streakColors.fire, icon: 'flame' },
    { label: 'Longest', value: streak.longestStreak, color: theme.streakColors.trophy, icon: 'trophy' },
    { label: 'Active Days', value: streak.totalActiveDays, color: theme.streakColors.calendar, icon: 'calendar' },
  ];
  const maxValue = Math.max(...streakItems.map((item) => item.value), 1);
  const heatCells = Array.from({ length: 18 }, (_, index) => {
    const active = index < Math.min(18, Math.ceil((streak.currentStreak / Math.max(streak.longestStreak, 1)) * 18));
    return active;
  });

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.cardBg} 58%, ${theme.bg} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          border: `1px solid ${theme.streakColors.fire}36`,
          borderRadius: 22,
          padding: 22,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -80,
            top: -80,
            width: 230,
            height: 230,
            background: `radial-gradient(circle, ${theme.streakColors.fire}32 0%, transparent 72%)`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -70,
            bottom: -90,
            width: 230,
            height: 230,
            background: `radial-gradient(circle, ${theme.accentColor}24 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: theme.primaryText, fontSize: 22, fontWeight: 850, letterSpacing: -0.4, display: 'flex' }}>
              <span>Contribution Streak</span>
            </div>
            <div style={{ color: theme.secondaryText, fontSize: 12, fontWeight: 650, letterSpacing: 1.1, textTransform: 'uppercase', marginTop: 3, display: 'flex' }}>
              <span>Consistency tracker</span>
            </div>
          </div>
          <div style={{ padding: '7px 11px', borderRadius: 999, background: `${theme.streakColors.fire}16`, border: `1px solid ${theme.streakColors.fire}34`, color: theme.streakColors.fire, fontSize: 11, fontWeight: 850, letterSpacing: 1, textTransform: 'uppercase', display: 'flex' }}>
            <span>{streak.currentStreak > 0 ? 'Active' : 'Restart today'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', gap: 14, flex: 1, position: 'relative' }}>
          <div
            style={{
              width: 180,
              borderRadius: 20,
              background: `linear-gradient(145deg, ${theme.streakColors.fire}24, ${theme.bg}80)`,
              border: `1px solid ${theme.streakColors.fire}38`,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ width: 72, height: 72, borderRadius: 24, background: `${theme.streakColors.fire}18`, border: `1px solid ${theme.streakColors.fire}38`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c4 0 7-2.7 7-6.7 0-2.3-1.2-4.2-2.6-5.9-.6 1.7-1.8 2.7-3.1 3.2.5-3.5-.7-6.2-3.5-8.6.2 3.1-1.2 4.7-2.7 6.4C5.9 11.8 5 13.2 5 15.4 5 19.3 8 22 12 22z" fill={theme.streakColors.fire}/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: theme.streakColors.fire, fontSize: 54, fontWeight: 950, letterSpacing: -2, display: 'flex' }}>
                <span>{streak.currentStreak}</span>
              </div>
              <div style={{ color: theme.secondaryText, fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 1, display: 'flex' }}>
                <span>current days</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {streakItems.slice(1).map((item) => {
              const pct = Math.max(6, Math.round((item.value / maxValue) * 100));
              return (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.035)',
                    border: `1px solid ${theme.borderColor}`,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 13, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {item.icon === 'trophy' && <path d="M7 4h10v3a5 5 0 0 1-10 0V4zm0 2H4c0 3 1.2 5 4.3 5M17 6h3c0 3-1.2 5-4.3 5M12 12v4m-4 4h8" stroke={item.color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />}
                      {item.icon === 'calendar' && <path d="M5 5h14v15H5V5zm0 5h14M8 3v4m8-4v4" stroke={item.color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />}
                    </svg>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ color: theme.secondaryText, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.label}</span>
                      <span style={{ color: theme.primaryText, fontSize: 28, fontWeight: 900 }}>{item.value.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: `${theme.primaryText}12`, overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${item.color}, ${theme.primaryText}99)`, display: 'flex' }} />
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{ height: 28, display: 'flex', gap: 4, alignItems: 'center' }}>
              {heatCells.map((active, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: active ? 20 : 12,
                    borderRadius: 6,
                    background: active ? theme.streakColors.fire : `${theme.primaryText}14`,
                    opacity: active ? 0.35 + (index / heatCells.length) * 0.6 : 1,
                    display: 'flex',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { width, height }
  );

  const _buf = await imageResponse.arrayBuffer();
  return new NextResponse(Buffer.from(_buf), {
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

  const theme = getThemeUniversal(themeParam || undefined);

  // Validate parameters
  let validatedParams;
  try {
    validatedParams = validateWidgetQuery({
      username: usernameParam,
      theme: themeParam,
    });
  } catch {
    return await generateErrorImage('Invalid parameters', theme);
  }

  // Fetch GitHub data
  let data;
  try {
    data = await fetchExtendedGitHubData(validatedParams.username);
  } catch {
    return await generateErrorImage('API Error', theme);
  }

  if (!data) {
    return await generateErrorImage('User not found', theme);
  }

  return await generateStreakImage(data.streak, theme);
}
