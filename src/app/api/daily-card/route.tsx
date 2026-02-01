import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { getPremiumTheme } from '@/registry/themes/premium-registry';
import { getPremiumBackgroundPattern } from '@/lib/premium-patterns';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WIDTH = 1200;
const HEIGHT = 630;

function minimalErrorSvg(message: string): NextResponse {
  const safe = String(message).slice(0, 60).replace(/[<>"&]/g, '');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="50%" y="50%" text-anchor="middle" fill="#22c55e" font-size="28" font-family="system-ui,sans-serif">${safe}</text>
</svg>`;
  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' },
  });
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const username = sp.get('username') || 'developer';
    const themeName = sp.get('theme') || 'satan';
    const today = (sp.get('today') || '').slice(0, 200);
    const tomorrow = (sp.get('tomorrow') || '').slice(0, 200);
    const commits = sp.get('commits') || '0';
    const additions = sp.get('additions') || '0';
    const deletions = sp.get('deletions') || '0';
    const prs = sp.get('prs') || '0';
    const date = sp.get('date') || new Date().toISOString().split('T')[0];
    const name = (sp.get('name') || username).slice(0, 50);
    const avatar = sp.get('avatar') || `https://github.com/${username}.png`;

    const theme = getPremiumTheme(themeName);

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            background: theme.colors.bg,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: 'relative',
            overflow: 'hidden',
            padding: 20,
          }}
        >
          {/* Background Pattern */}
          {getPremiumBackgroundPattern(theme)}

          {/* Main Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              background: `linear-gradient(165deg, ${theme.colors.cardBg}dd 0%, ${theme.colors.cardBg}aa 50%, ${theme.colors.bg}dd 100%)`,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 20,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Accent gradient bar */}
            <div
              style={{
                width: '100%',
                height: 4,
                background: `linear-gradient(90deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 50%, ${theme.colors.accent} 100%)`,
                display: 'flex',
                boxShadow: `0 2px 12px ${theme.colors.accent}40`,
              }}
            />

            {/* Header: avatar + name + date */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '24px 32px 16px 32px',
              }}
            >
              <img
                src={avatar}
                alt={name}
                width="56"
                height="56"
                style={{
                  borderRadius: 16,
                  border: `2px solid ${theme.colors.accent}`,
                  boxShadow: `0 4px 16px ${theme.colors.accent}40`,
                  marginRight: 16,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: theme.colors.primary,
                    display: 'flex',
                    letterSpacing: -0.5,
                    textShadow: theme.effects.textGlow || 'none',
                  }}
                >
                  <span>{name}</span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: theme.colors.accent,
                    display: 'flex',
                    fontWeight: 600,
                    opacity: 0.9,
                  }}
                >
                  <span>@{username}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: theme.colors.secondary,
                  opacity: 0.7,
                  display: 'flex',
                  fontWeight: 500,
                }}
              >
                <span>{date}</span>
              </div>
            </div>

            {/* Text content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0 32px',
                flex: 1,
                gap: 16,
              }}
            >
              {/* Today I... */}
              {today && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: theme.colors.accent,
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                      display: 'flex',
                    }}
                  >
                    <span>Today I...</span>
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: theme.colors.primary,
                      lineHeight: 1.5,
                      display: 'flex',
                    }}
                  >
                    <span>{today}</span>
                  </div>
                </div>
              )}

              {/* Tomorrow I'll... */}
              {tomorrow && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: theme.colors.accent,
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                      display: 'flex',
                    }}
                  >
                    <span>Tomorrow I&apos;ll...</span>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: theme.colors.secondary,
                      lineHeight: 1.5,
                      display: 'flex',
                    }}
                  >
                    <span>{tomorrow}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                padding: '0 32px 20px 32px',
              }}
            >
              {[
                { label: 'Commits', value: commits },
                { label: '+ Lines', value: additions },
                { label: '- Lines', value: deletions },
                { label: 'PRs', value: prs },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    background: `linear-gradient(135deg, ${theme.colors.accent}12 0%, ${theme.colors.accent}06 100%)`,
                    border: `1px solid ${theme.colors.accent}25`,
                    borderRadius: 12,
                    padding: '12px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: theme.colors.primary,
                      display: 'flex',
                      letterSpacing: -0.5,
                    }}
                  >
                    <span>{Number(stat.value).toLocaleString()}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: theme.colors.secondary,
                      opacity: 0.7,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      display: 'flex',
                      marginTop: 2,
                    }}
                  >
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '0 32px 16px 32px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: theme.colors.secondary,
                  opacity: 0.5,
                  display: 'flex',
                  fontWeight: 500,
                  letterSpacing: 0.5,
                }}
              >
                <span>Generated by GitSkins.com</span>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: WIDTH, height: HEIGHT }
    );

    return new NextResponse(imageResponse.body, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Daily card error:', error);
    return minimalErrorSvg('Failed to generate card');
  }
}
