/**
 * GitSkins - Languages Widget API Route
 *
 * Generates a widget showing top programming languages with progress bars.
 */

import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateWidgetQuery } from '@/lib/validations';
import { fetchExtendedGitHubData } from '@/lib/github';
import { getThemeUniversal } from '@/lib/theme-converter';
import { widgetConfig, apiConfig } from '@/config/site';
import type { Theme, LanguageStat } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { width, height } = widgetConfig.languages;

/**
 * Generate error image for languages widget
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
 * Generate languages widget image with premium design
 */
async function generateLanguagesImage(
  languages: LanguageStat[],
  theme: Theme
): Promise<NextResponse> {
  const topLanguage = languages[0];
  const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
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
            top: -70,
            right: -50,
            width: 220,
            height: 220,
            background: `radial-gradient(circle, ${(topLanguage?.color || theme.accentColor)}30 0%, transparent 70%)`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -60,
            width: 210,
            height: 210,
            background: `radial-gradient(circle, ${theme.accentColor}22 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 18,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: theme.primaryText, fontSize: 22, fontWeight: 850, letterSpacing: -0.4, display: 'flex' }}>
              <span>Language Mix</span>
            </div>
            <div style={{ color: theme.secondaryText, fontSize: 12, fontWeight: 650, letterSpacing: 1.1, textTransform: 'uppercase', marginTop: 3, display: 'flex' }}>
              <span>{languages.length > 0 ? `${languages.length} technologies detected` : 'No language signal yet'}</span>
            </div>
          </div>
          {topLanguage ? (
            <div style={{ padding: '7px 11px', borderRadius: 999, background: `${topLanguage.color}18`, border: `1px solid ${topLanguage.color}40`, color: topLanguage.color, fontSize: 11, fontWeight: 850, letterSpacing: 1, textTransform: 'uppercase', display: 'flex' }}>
              <span>{topLanguage.name}</span>
            </div>
          ) : null}
        </div>

        {languages.length > 0 ? (
          <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 132, height: 142, borderRadius: 20, background: `linear-gradient(145deg, ${(topLanguage?.color || theme.accentColor)}22, ${theme.bg}80)`, border: `1px solid ${(topLanguage?.color || theme.accentColor)}38`, display: 'flex' }} />
            <div style={{ position: 'absolute', left: 39, top: 18, width: 72, height: 72, borderRadius: '50%', border: `12px solid ${(topLanguage?.color || theme.accentColor)}55`, background: `${theme.cardBg}cc`, display: 'flex' }} />
            <div style={{ position: 'absolute', left: 65, top: 44, width: 32, height: 32, borderRadius: '50%', background: topLanguage?.color || theme.accentColor, opacity: 0.82, display: 'flex' }} />
            <div style={{ position: 'absolute', left: 16, top: 94, color: theme.primaryText, fontSize: 34, fontWeight: 900, letterSpacing: -1, display: 'flex' }}>
              <span>{topLanguage?.percentage ?? 0}%</span>
            </div>
            <div style={{ position: 'absolute', left: 16, top: 130, color: theme.secondaryText, fontSize: 12, display: 'flex' }}>
              <span>{Math.round(totalBytes / 1000).toLocaleString()} KB indexed</span>
            </div>

            {languages.map((lang, index) => {
              const y = index * 45;
              return (
                <div key={index} style={{ display: 'flex' }}>
                  <div style={{ position: 'absolute', left: 154, top: y, width: 252, height: 36, borderRadius: 14, background: 'rgba(255,255,255,0.035)', border: `1px solid ${theme.borderColor}`, display: 'flex' }} />
                  <div style={{ position: 'absolute', left: 170, top: y + 11, width: 10, height: 10, borderRadius: '50%', backgroundColor: lang.color, boxShadow: `0 0 10px ${lang.color}80`, display: 'flex' }} />
                  <div style={{ position: 'absolute', left: 190, top: y + 8, color: theme.primaryText, fontSize: 13, fontWeight: 750, display: 'flex' }}>
                    <span>{lang.name}</span>
                  </div>
                  <div style={{ position: 'absolute', right: 12, top: y + 8, color: lang.color, fontSize: 13, fontWeight: 850, display: 'flex' }}>
                    <span>{lang.percentage}%</span>
                  </div>
                  <div style={{ position: 'absolute', left: 190, top: y + 27, width: 172, height: 7, borderRadius: 999, backgroundColor: `${theme.primaryText}12`, display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(4, lang.percentage)}%`, height: 7, borderRadius: 999, background: `linear-gradient(90deg, ${lang.color}, ${lang.color}99)`, display: 'flex' }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: theme.secondaryText,
                  opacity: 0.7,
                  display: 'flex',
                }}
              >
                <span>No languages detected</span>
              </div>
            </div>
        )}

        {languages.length > 0 ? (
          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {languages.map((lang, index) => (
              <div
                key={index}
                style={{
                  height: 7,
                  width: `${Math.max(10, lang.percentage)}%`,
                  borderRadius: 999,
                  background: lang.color,
                  display: 'flex',
                }}
              />
            ))}
          </div>
        ) : null}
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
 * GET /api/languages
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

  return await generateLanguagesImage(data.languages, theme);
}
