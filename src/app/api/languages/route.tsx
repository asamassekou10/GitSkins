/**
 * GitSkins - Languages Widget API Route
 *
 * Generates a widget showing top programming languages with progress bars.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { validateWidgetQuery } from '@/lib/validations';
import { fetchExtendedGitHubData } from '@/lib/github';
import { getTheme } from '@/registry/themes';
import { widgetConfig, apiConfig } from '@/config/site';
import type { Theme, LanguageStat } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const { width, height } = widgetConfig.languages;

/**
 * Generate error image for languages widget
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
 * Generate languages widget image with premium design
 */
function generateLanguagesImage(
  languages: LanguageStat[],
  theme: Theme
): NextResponse {
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
          padding: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative element */}
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${theme.accentColor}10 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Title */}
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
              height: 20,
              background: theme.accentColor,
              borderRadius: 2,
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: theme.secondaryText,
              letterSpacing: 1,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            <span>Top Languages</span>
          </div>
        </div>

        {/* Language bars */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flex: 1,
          }}
        >
          {languages.length > 0 ? (
            languages.map((lang, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {/* Language dot and name */}
                <div
                  style={{
                    width: 100,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: lang.color,
                      boxShadow: `0 0 8px ${lang.color}60`,
                      display: 'flex',
                    }}
                  />
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: theme.primaryText,
                      display: 'flex',
                    }}
                  >
                    <span>{lang.name}</span>
                  </div>
                </div>

                {/* Progress bar background */}
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    backgroundColor: theme.progressBg,
                    borderRadius: 4,
                    display: 'flex',
                    overflow: 'hidden',
                  }}
                >
                  {/* Progress bar fill with gradient */}
                  <div
                    style={{
                      width: `${lang.percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${lang.color} 0%, ${lang.color}cc 100%)`,
                      borderRadius: 4,
                      display: 'flex',
                    }}
                  />
                </div>

                {/* Percentage */}
                <div
                  style={{
                    width: 45,
                    fontSize: 12,
                    fontWeight: 600,
                    color: theme.secondaryText,
                    textAlign: 'right',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span>{lang.percentage}%</span>
                </div>
              </div>
            ))
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
 * GET /api/languages
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

  return generateLanguagesImage(data.languages, theme);
}
