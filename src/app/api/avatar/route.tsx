/**
 * GET /api/avatar?username=xxx&theme=halloween&style=orbs
 *
 * Generates a 400×400 themed avatar PNG.
 * Deterministic: same username+theme+style always produces the same image.
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getPremiumTheme } from '@/registry/themes/premium-registry';
import {
  hashStr,
  seededRng,
  extractBg,
  hexRgba,
  AVATAR_SIZE as S,
  type AvatarStyle,
} from '@/lib/avatar-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STYLES: AvatarStyle[] = ['orbs', 'geo', 'pixel'];

// ─── Orbs (aurora/nebula style) ──────────────────────────────────────────────

function OrbsAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'orbs');
  const rng = seededRng(seed);

  const bg = extractBg(theme.colors.bg);
  const graphColors = theme.graphColors;
  const initial = (username[0] ?? '?').toUpperCase();

  const orbs = Array.from({ length: 6 }, (_, i) => ({
    color: graphColors[i % graphColors.length],
    x: Math.round(rng() * 380 - 90),
    y: Math.round(rng() * 380 - 90),
    size: Math.round(rng() * 180 + 110),
    opacity: 0.3 + rng() * 0.55,
  }));

  return (
    <div
      style={{
        width: S,
        height: S,
        background: bg,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexRgba(orb.color, orb.opacity)} 0%, ${hexRgba(orb.color, 0)} 68%)`,
            left: orb.x,
            top: orb.y,
          }}
        />
      ))}
      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 35%, ${bg}88 70%, ${bg}cc 100%)`,
        }}
      />
      {/* Initial */}
      <div
        style={{
          width: 116,
          height: 116,
          borderRadius: '50%',
          background: hexRgba(theme.colors.accent, 0.12),
          border: `2px solid ${hexRgba(theme.colors.accent, 0.5)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: theme.colors.primary,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          {initial}
        </span>
      </div>
    </div>
  );
}

// ─── Geo (diamond grid style) ────────────────────────────────────────────────

function GeoAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'geo');
  const rng = seededRng(seed);

  const bg = extractBg(theme.colors.bg);
  const graphColors = theme.graphColors;
  const initial = (username[0] ?? '?').toUpperCase();

  const COLS = 9;
  const ROWS = 9;
  const CELL = Math.floor(S / COLS); // 44px
  const D = Math.round(CELL * 0.42); // diamond half-size ~18

  type Cell = { filled: boolean; color: string; opacity: number };
  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push({
        filled: rng() > 0.38,
        color: graphColors[Math.floor(rng() * graphColors.length)],
        opacity: 0.45 + rng() * 0.55,
      });
    }
  }

  return (
    <div
      style={{
        width: S,
        height: S,
        background: bg,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {cells.map((cell, i) => {
        if (!cell.filled) return null;
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const cx = col * CELL + CELL / 2;
        const cy = row * CELL + CELL / 2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: D,
              height: D,
              background: cell.color,
              opacity: cell.opacity,
              transform: 'rotate(45deg)',
              left: cx - D / 2,
              top: cy - D / 2,
            }}
          />
        );
      })}
      {/* Radial fade for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 20%, ${bg}99 60%, ${bg}ee 100%)`,
        }}
      />
      {/* Initial */}
      <div
        style={{
          width: 116,
          height: 116,
          borderRadius: '50%',
          background: `${bg}dd`,
          border: `2px solid ${theme.colors.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: theme.colors.primary,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          {initial}
        </span>
      </div>
    </div>
  );
}

// ─── Pixel (symmetric identicon style) ───────────────────────────────────────

function PixelAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'pixel');
  const rng = seededRng(seed);

  const bg = extractBg(theme.colors.bg);
  const graphColors = theme.graphColors;

  const GRID = 10;
  const CELL = S / GRID; // exactly 40px

  // Generate 5×5 quadrant, then mirror to 10×10
  const quadrant = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => rng() > 0.42)
  );

  type Pixel = { filled: boolean; color: string };
  const pixels: Pixel[] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const qr = r < 5 ? r : 9 - r;
      const qc = c < 5 ? c : 9 - c;
      const filled = quadrant[qr][qc];
      const colorSeed = hashStr(`${username}${r}${c}`) % graphColors.length;
      pixels.push({ filled, color: graphColors[colorSeed] });
    }
  }

  // Use the two brightest graphColors for fill variety
  const lo = graphColors[graphColors.length - 2] || graphColors[0];
  const hi = graphColors[graphColors.length - 1] || graphColors[0];

  return (
    <div
      style={{
        width: S,
        height: S,
        background: bg,
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {pixels.map((px, i) => {
        if (!px.filled) return null;
        const row = Math.floor(i / GRID);
        const col = i % GRID;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: col * CELL,
              top: row * CELL,
              width: CELL,
              height: CELL,
              background: i % 3 === 0 ? hi : lo,
              opacity: 0.7 + (i % 4) * 0.075,
            }}
          />
        );
      })}
      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 30%, ${bg}55 65%, ${bg}99 100%)`,
        }}
      />
    </div>
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rawUsername = (searchParams.get('username') ?? 'user').trim().slice(0, 39) || 'user';
  const rawTheme = searchParams.get('theme') ?? 'github-dark';
  const rawStyle = (searchParams.get('style') ?? 'orbs') as AvatarStyle;

  const themeId = rawTheme;
  const style: AvatarStyle = VALID_STYLES.includes(rawStyle) ? rawStyle : 'orbs';

  let jsx: JSX.Element;
  if (style === 'geo') {
    jsx = <GeoAvatar username={rawUsername} themeId={themeId} />;
  } else if (style === 'pixel') {
    jsx = <PixelAvatar username={rawUsername} themeId={themeId} />;
  } else {
    jsx = <OrbsAvatar username={rawUsername} themeId={themeId} />;
  }

  return new ImageResponse(jsx, {
    width: S,
    height: S,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
