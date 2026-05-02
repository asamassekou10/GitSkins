/**
 * GitSkins - Stats Widget API Route
 *
 * Generates a compact stats widget showing stars, contributions, repos, and followers.
 */

import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateWidgetQuery } from '@/lib/validations';
import { fetchExtendedGitHubData } from '@/lib/github';
import { getThemeUniversal } from '@/lib/theme-converter';
import { widgetConfig, apiConfig } from '@/config/site';
import type { Theme, CompactStats } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { width, height } = widgetConfig.stats;

/**
 * Generate error image for stats widget
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
 * Generate stats widget image with premium design
 */
async function generateStatsImage(stats: CompactStats, theme: Theme): Promise<NextResponse> {
  const statItems = [
    { label: 'Stars', value: stats.totalStars, accent: theme.accentColor, icon: 'star' },
    { label: 'Contributions', value: stats.totalContributions, accent: theme.accentColor, icon: 'pulse' },
    { label: 'Repositories', value: stats.totalRepos, accent: theme.iconColor || theme.accentColor, icon: 'repo' },
    { label: 'Followers', value: stats.followers, accent: theme.secondaryText, icon: 'user' },
  ];
  const maxValue = Math.max(...statItems.map((item) => item.value), 1);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.cardBg} 58%, ${theme.bg} 100%)`,
          display: 'flex',
          fontFamily: 'system-ui',
          border: `1px solid ${theme.accentColor}36`,
          borderRadius: 22,
          padding: 22,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -90,
            right: -70,
            width: 260,
            height: 260,
            background: `radial-gradient(circle, ${theme.accentColor}30 0%, ${theme.accentColor}10 42%, transparent 72%)`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -70,
            width: 240,
            height: 240,
            background: `radial-gradient(circle, ${theme.primaryText}14 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
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
                <span>GitHub Stats</span>
              </div>
              <div style={{ color: theme.secondaryText, fontSize: 12, fontWeight: 650, letterSpacing: 1.2, textTransform: 'uppercase', display: 'flex', marginTop: 3 }}>
                <span>Profile signal</span>
              </div>
            </div>
            <div style={{ padding: '7px 11px', borderRadius: 999, background: `${theme.accentColor}16`, border: `1px solid ${theme.accentColor}34`, color: theme.accentColor, fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', display: 'flex' }}>
              <span>GitSkins</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 14, flex: 1 }}>
            <div
              style={{
                width: 190,
                borderRadius: 18,
                background: `linear-gradient(145deg, ${theme.accentColor}22, ${theme.bg}80)`,
                border: `1px solid ${theme.accentColor}30`,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ color: theme.secondaryText, fontSize: 12, fontWeight: 750, letterSpacing: 1.1, textTransform: 'uppercase', display: 'flex' }}>
                <span>Total impact</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: theme.primaryText, fontSize: 42, fontWeight: 900, letterSpacing: -1, display: 'flex' }}>
                  <span>{(stats.totalStars + stats.totalContributions).toLocaleString()}</span>
                </div>
                <div style={{ color: theme.secondaryText, fontSize: 12, display: 'flex' }}>
                  <span>stars + contributions</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={index}
                    style={{
                      width: 16,
                      height: 42 + (index % 4) * 10,
                      alignSelf: 'flex-end',
                      borderRadius: 8,
                      background: index % 2 === 0 ? theme.accentColor : `${theme.accentColor}72`,
                      opacity: 0.25 + index * 0.08,
                      display: 'flex',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {statItems.map((item) => {
                const pct = Math.max(9, Math.round((item.value / maxValue) * 100));
                return (
                  <div
                    key={item.label}
                    style={{
                      flex: 1,
                      minHeight: 0,
                      borderRadius: 15,
                      background: 'rgba(255,255,255,0.035)',
                      border: `1px solid ${theme.borderColor}`,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 13, background: `${item.accent}18`, border: `1px solid ${item.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        {item.icon === 'star' && <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z" fill={item.accent} />}
                        {item.icon === 'pulse' && <path d="M3 13h4l3-7 4 12 3-5h4" stroke={item.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
                        {item.icon === 'repo' && <path d="M5 4h11a3 3 0 0 1 3 3v13H7a2 2 0 0 1-2-2V4zM7 17h12" stroke={item.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
                        {item.icon === 'user' && <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8c1.2-3.4 3.6-5 7-5s5.8 1.6 7 5" stroke={item.accent} strokeWidth="2.2" strokeLinecap="round" />}
                      </svg>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ color: theme.secondaryText, fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.label}</span>
                        <span style={{ color: theme.primaryText, fontSize: 24, fontWeight: 900 }}>{item.value.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 999, background: `${theme.primaryText}12`, display: 'flex', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${item.accent}, ${theme.primaryText}99)`, display: 'flex' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${theme.accentColor}80, transparent)`,
              display: 'flex',
            }}
          />
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
 * GET /api/stats
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

  return await generateStatsImage(data.stats, theme);
}
