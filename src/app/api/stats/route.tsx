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
  const totalImpact = stats.totalStars + stats.totalContributions;

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

        <div style={{ position: 'absolute', left: 24, top: 26, color: theme.primaryText, fontSize: 22, fontWeight: 850, letterSpacing: -0.4, display: 'flex' }}>
          <span>GitHub Stats</span>
        </div>
        <div style={{ position: 'absolute', left: 24, top: 58, color: theme.secondaryText, fontSize: 12, fontWeight: 650, letterSpacing: 1.2, textTransform: 'uppercase', display: 'flex' }}>
          <span>Profile signal</span>
        </div>
        <div style={{ position: 'absolute', right: 23, top: 32, padding: '7px 11px', borderRadius: 999, background: `${theme.accentColor}16`, border: `1px solid ${theme.accentColor}34`, color: theme.accentColor, fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', display: 'flex' }}>
          <span>GitSkins</span>
        </div>

        <div style={{ position: 'absolute', left: 23, top: 88, width: 190, height: 128, borderRadius: 18, background: `linear-gradient(145deg, ${theme.accentColor}22, ${theme.bg}80)`, border: `1px solid ${theme.accentColor}30`, display: 'flex' }} />
        <div style={{ position: 'absolute', left: 42, top: 110, color: theme.secondaryText, fontSize: 12, fontWeight: 750, letterSpacing: 1.1, textTransform: 'uppercase', display: 'flex' }}>
          <span>Total impact</span>
        </div>
        <div style={{ position: 'absolute', left: 42, top: 137, color: theme.primaryText, fontSize: 42, fontWeight: 900, letterSpacing: -1, display: 'flex' }}>
          <span>{totalImpact.toLocaleString()}</span>
        </div>
        <div style={{ position: 'absolute', left: 42, top: 185, color: theme.secondaryText, fontSize: 12, display: 'flex' }}>
          <span>stars + contributions</span>
        </div>
        {[0, 1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 42 + index * 21,
              bottom: 0,
              width: 16,
              height: 14 + (index % 4) * 10,
              borderRadius: 8,
              background: index % 2 === 0 ? theme.accentColor : `${theme.accentColor}72`,
              opacity: 0.25 + index * 0.08,
              display: 'flex',
            }}
          />
        ))}

        {statItems.map((item, index) => {
          const y = 88 + index * 34;
          const pct = Math.max(9, Math.round((item.value / maxValue) * 100));
          return (
            <div key={item.label}>
              <div style={{ position: 'absolute', left: 232, top: y, width: 344, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.035)', border: `1px solid ${theme.accentColor}55`, display: 'flex' }} />
              <div style={{ position: 'absolute', left: 248, top: y + 4, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  {item.icon === 'star' && <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z" fill={item.accent} />}
                  {item.icon === 'pulse' && <path d="M3 13h4l3-7 4 12 3-5h4" stroke={item.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
                  {item.icon === 'repo' && <path d="M5 4h11a3 3 0 0 1 3 3v13H7a2 2 0 0 1-2-2V4zM7 17h12" stroke={item.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
                  {item.icon === 'user' && <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8c1.2-3.4 3.6-5 7-5s5.8 1.6 7 5" stroke={item.accent} strokeWidth="2.2" strokeLinecap="round" />}
                </svg>
              </div>
              <div style={{ position: 'absolute', left: 290, top: y + 8, color: theme.secondaryText, fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex' }}>
                <span>{item.label}</span>
              </div>
              <div style={{ position: 'absolute', right: 40, top: y + 2, color: theme.primaryText, fontSize: 23, fontWeight: 900, display: 'flex' }}>
                <span>{item.value.toLocaleString()}</span>
              </div>
              <div style={{ position: 'absolute', left: 290, top: y + 23, width: 246, height: 6, borderRadius: 999, background: `${theme.primaryText}18`, display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: 6, borderRadius: 999, background: `linear-gradient(90deg, ${item.accent}, ${theme.primaryText}99)`, display: 'flex' }} />
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 240,
            right: 24,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${theme.accentColor}80, transparent)`,
            display: 'flex',
          }}
        />
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
