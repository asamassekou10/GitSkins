import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic OG Image Generation
 * 
 * Generates Open Graph images for showcase pages and the main site.
 * Usage: /api/og?username=octocat&theme=satan
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'GitSkins';
    const theme = searchParams.get('theme') || 'satan';
    
    // Theme colors
    const themeColors: Record<string, { bg: string; primary: string; secondary: string }> = {
      satan: { bg: '#0a0a0a', primary: '#ff4500', secondary: '#ff6b35' },
      neon: { bg: '#0a0a0a', primary: '#00ffff', secondary: '#00ff88' },
      zen: { bg: '#0a0a0a', primary: '#00ff88', secondary: '#88ffaa' },
      'github-dark': { bg: '#0d1117', primary: '#238636', secondary: '#2ea043' },
      dracula: { bg: '#282a36', primary: '#ff79c6', secondary: '#bd93f9' },
    };

    const colors = themeColors[theme] || themeColors.satan;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.bg,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.primary}15 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, ${colors.secondary}15 0%, transparent 50%)`,
          }}
        >
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
            }}
          >
            {/* Logo/Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: 20,
              }}
            >
              GitSkins
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: 48,
                color: '#ffffff',
                marginBottom: 30,
                fontWeight: 600,
              }}
            >
              @{username}
            </div>

            {/* Theme Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: `${colors.primary}20`,
                border: `2px solid ${colors.primary}`,
                borderRadius: '12px',
                fontSize: 24,
                color: colors.primary,
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {theme} Theme
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 20,
              color: '#666666',
            }}
          >
            gitskins.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation failed:', error);
    
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            fontSize: 48,
          }}
        >
          GitSkins
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
