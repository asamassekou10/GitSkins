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
 * Generate languages widget image
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
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui',
          border: `2px solid ${theme.borderColor}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.primaryText,
            marginBottom: 12,
            display: 'flex',
          }}
        >
          <span>Top Languages</span>
        </div>

        {/* Language bars */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
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
                  gap: 10,
                }}
              >
                {/* Language name */}
                <div
                  style={{
                    width: 90,
                    fontSize: 12,
                    color: theme.secondaryText,
                    display: 'flex',
                  }}
                >
                  <span>{lang.name}</span>
                </div>

                {/* Progress bar background */}
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    backgroundColor: theme.progressBg,
                    borderRadius: 5,
                    display: 'flex',
                    overflow: 'hidden',
                  }}
                >
                  {/* Progress bar fill */}
                  <div
                    style={{
                      width: `${lang.percentage}%`,
                      height: '100%',
                      backgroundColor: lang.color,
                      borderRadius: 5,
                      display: 'flex',
                    }}
                  />
                </div>

                {/* Percentage */}
                <div
                  style={{
                    width: 40,
                    fontSize: 12,
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
