/**
 * GET /api/avatar?username=xxx&theme=halloween&style=nebula
 *
 * Generates a 400×400 themed avatar PNG.
 * Deterministic: same username+theme+style always produces the same image.
 *
 * Styles: nebula | crystal | circuit | constellation | terminal
 * Legacy aliases: orbs→nebula, geo→crystal, pixel→circuit
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getPremiumTheme } from '@/registry/themes/premium-registry';
import {
  hashStr,
  seededRng,
  extractBg,
  hexRgba,
  hexLighten,
  getBestAccentColor,
  isRare,
  AVATAR_SIZE as S,
  type AvatarStyle,
} from '@/lib/avatar-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STYLES: AvatarStyle[] = ['nebula', 'crystal', 'circuit', 'constellation', 'terminal'];

const STYLE_ALIASES: Record<string, AvatarStyle> = {
  orbs: 'nebula',
  geo: 'crystal',
  pixel: 'circuit',
};

// ─── Nebula (upgraded aurora/orbs style) ─────────────────────────────────────

function NebulaAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'nebula');
  const rng = seededRng(seed);
  const rare = isRare(username, themeId);

  const bg = extractBg(theme.colors.bg);
  const graphColors = theme.graphColors;
  const accent = theme.colors.accent;
  const primary = theme.colors.primary;
  const initial = (username[0] ?? '?').toUpperCase();

  const orbs = Array.from({ length: 6 }, (_, i) => ({
    color: graphColors[i % graphColors.length],
    x: Math.round(rng() * 380 - 90),
    y: Math.round(rng() * 380 - 90),
    size: Math.round(rng() * 180 + 110),
    opacity: 0.35 + rng() * 0.5,
  }));

  return (
    <div
      style={{
        width: S, height: S, background: bg,
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexRgba(orb.color, orb.opacity)} 0%, ${hexRgba(orb.color, 0)} 70%)`,
            left: orb.x, top: orb.y,
          }}
        />
      ))}

      {/* Specular highlight — simulates a light source at top-left */}
      <div
        style={{
          position: 'absolute',
          width: 140, height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%)',
          left: S * 0.12, top: S * 0.08,
        }}
      />

      {/* Vignette — rgba(0,0,0,x) preserves colour unlike bg-colour overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 28%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0.52) 100%)',
        }}
      />

      {/* Glowing initial circle */}
      <div
        style={{
          width: 116, height: 116, borderRadius: '50%',
          background: hexRgba(accent, 0.14),
          border: `2px solid ${hexRgba(accent, 0.55)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: `0 0 28px ${hexRgba(accent, 0.45)}, 0 0 56px ${hexRgba(accent, 0.18)}`,
        }}
      >
        <span
          style={{
            fontSize: 54, fontWeight: 800, color: primary,
            fontFamily: 'system-ui, sans-serif', lineHeight: 1,
          }}
        >
          {initial}
        </span>
      </div>

      {/* Rare outer ring */}
      {rare && (
        <div
          style={{
            position: 'absolute', left: 5, top: 5,
            width: S - 10, height: S - 10,
            borderRadius: '50%',
            border: `1.5px solid ${hexRgba(accent, 0.45)}`,
            boxShadow: `inset 0 0 24px ${hexRgba(accent, 0.08)}`,
          }}
        />
      )}
    </div>
  );
}

// ─── Crystal (upgraded diamond-grid style) ───────────────────────────────────

function CrystalAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'crystal');
  const rng = seededRng(seed);
  const rare = isRare(username, themeId);

  const bg = extractBg(theme.colors.bg);
  const accent = theme.colors.accent;
  const primary = theme.colors.primary;
  const initial = (username[0] ?? '?').toUpperCase();

  // Two-tone palette: vivid primary + lighter highlight
  const baseColor = getBestAccentColor(theme.graphColors);
  const lightColor = hexLighten(baseColor, 0.55);

  const COLS = 9, ROWS = 9;
  const CELL = Math.floor(S / COLS);
  const D = Math.round(CELL * 0.44);

  type Cell = { filled: boolean; light: boolean };
  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Radial density: centre cells 85 % filled, corners ~20 %
      const dx = (c - (COLS - 1) / 2) / ((COLS - 1) / 2);
      const dy = (r - (ROWS - 1) / 2) / ((ROWS - 1) / 2);
      const dist = Math.sqrt(dx * dx + dy * dy) / Math.SQRT2; // 0=centre, 1=corner
      const fillProb = 0.85 - dist * 0.65;
      cells.push({ filled: rng() < fillProb, light: rng() > 0.58 });
    }
  }

  return (
    <div
      style={{
        width: S, height: S, background: bg,
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
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
              width: D, height: D,
              background: cell.light ? lightColor : baseColor,
              opacity: cell.light ? 0.28 : 0.62,
              transform: 'rotate(45deg)',
              left: cx - D / 2, top: cy - D / 2,
            }}
          />
        );
      })}

      {/* Radial fade creating depth */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 15%, ${bg}88 52%, ${bg}ee 100%)`,
        }}
      />

      {/* Initial circle */}
      <div
        style={{
          width: 112, height: 112, borderRadius: '50%',
          background: `${bg}ee`,
          border: `2px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: `0 0 22px ${hexRgba(accent, 0.35)}`,
        }}
      >
        <span
          style={{
            fontSize: 52, fontWeight: 800, color: primary,
            fontFamily: 'system-ui, sans-serif', lineHeight: 1,
          }}
        >
          {initial}
        </span>
      </div>

      {rare && (
        <div
          style={{
            position: 'absolute', left: 5, top: 5,
            width: S - 10, height: S - 10,
            borderRadius: '50%',
            border: `1.5px solid ${hexRgba(accent, 0.4)}`,
          }}
        />
      )}
    </div>
  );
}

// ─── Circuit (upgraded symmetric pixel style) ────────────────────────────────

function CircuitAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'circuit');
  const rng = seededRng(seed);

  const bg = extractBg(theme.colors.bg);
  const graphColors = theme.graphColors;

  const GRID = 10;
  const CELL = S / GRID; // 40 px
  const GAP = 2;

  const lo = graphColors[graphColors.length - 2] ?? graphColors[0];
  const hi = graphColors[graphColors.length - 1] ?? graphColors[0];

  // Mirror 5×5 quadrant to full 10×10
  const quadrant = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => rng() > 0.42)
  );

  const maxDist = Math.sqrt(4.5 * 4.5 + 4.5 * 4.5);

  type Pixel = { filled: boolean; color: string; opacity: number };
  const pixels: Pixel[] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const qr = r < 5 ? r : 9 - r;
      const qc = c < 5 ? c : 9 - c;
      const filled = quadrant[qr][qc];
      // Distance-from-centre ramp: centre cells bright hi-colour, edges dim lo-colour
      const dist = Math.sqrt((r - 4.5) ** 2 + (c - 4.5) ** 2) / maxDist;
      pixels.push({
        filled,
        color: dist < 0.4 ? hi : lo,
        opacity: 0.82 - dist * 0.28,
      });
    }
  }

  return (
    <div
      style={{
        width: S, height: S, background: bg,
        position: 'relative', display: 'flex',
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
              left: col * CELL + GAP, top: row * CELL + GAP,
              width: CELL - GAP * 2, height: CELL - GAP * 2,
              background: px.color,
              opacity: px.opacity,
            }}
          />
        );
      })}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 22%, ${bg}44 58%, ${bg}aa 100%)`,
        }}
      />
    </div>
  );
}

// ─── Constellation (star-field + connected-points style) ─────────────────────

function ConstellationAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'constellation');
  const rng = seededRng(seed);
  const rare = isRare(username, themeId);

  const bg = extractBg(theme.colors.bg);
  const accent = theme.colors.accent;
  const primary = theme.colors.primary;

  // 7–12 main star points, kept away from edges
  const N = 7 + Math.floor(rng() * 6);
  const points = Array.from({ length: N }, () => ({
    x: 50 + Math.round(rng() * 300),
    y: 50 + Math.round(rng() * 300),
    bright: rng() > 0.55,
    radius: 0, // filled below
  }));
  points.forEach((p) => { p.radius = p.bright ? 4 : 2.5; });

  // Background scatter: 40 tiny dim stars
  const scatter = Array.from({ length: 40 }, () => ({
    x: Math.round(rng() * 390 + 5),
    y: Math.round(rng() * 390 + 5),
    size: rng() > 0.75 ? 1.5 : 0.8,
    opacity: 0.06 + rng() * 0.12,
  }));

  // Connections between points within 140 px
  const THRESHOLD = 145;
  const lines: { x1: number; y1: number; x2: number; y2: number; dist: number; angle: number }[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < THRESHOLD) {
        lines.push({
          x1: points[i].x, y1: points[i].y,
          x2: points[j].x, y2: points[j].y,
          dist,
          angle: Math.atan2(dy, dx) * (180 / Math.PI),
        });
      }
    }
  }

  return (
    <div
      style={{
        width: S, height: S, background: bg,
        position: 'relative', display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Background scatter stars */}
      {scatter.map((dot, i) => (
        <div
          key={`s${i}`}
          style={{
            position: 'absolute',
            left: dot.x, top: dot.y,
            width: dot.size, height: dot.size,
            borderRadius: '50%',
            background: primary,
            opacity: dot.opacity,
          }}
        />
      ))}

      {/* Connection lines rendered as thin rotated divs */}
      {lines.map((line, i) => {
        const lineOpacity = 0.14 + (1 - line.dist / THRESHOLD) * 0.22;
        return (
          <div
            key={`l${i}`}
            style={{
              position: 'absolute',
              left: line.x1, top: line.y1,
              width: Math.round(line.dist),
              height: 1,
              background: hexRgba(primary, lineOpacity),
              transformOrigin: '0 50%',
              transform: `rotate(${line.angle.toFixed(2)}deg)`,
            }}
          />
        );
      })}

      {/* Main star points */}
      {points.map((pt, i) => (
        <div
          key={`p${i}`}
          style={{
            position: 'absolute',
            left: pt.x - pt.radius, top: pt.y - pt.radius,
            width: pt.radius * 2, height: pt.radius * 2,
            borderRadius: '50%',
            background: pt.bright ? accent : primary,
            opacity: pt.bright ? 0.95 : 0.65,
            boxShadow: pt.bright
              ? `0 0 6px ${hexRgba(accent, 0.55)}, 0 0 14px ${hexRgba(accent, 0.28)}`
              : 'none',
          }}
        />
      ))}

      {/* Frame ring */}
      <div
        style={{
          position: 'absolute', left: 6, top: 6,
          width: S - 12, height: S - 12,
          borderRadius: '50%',
          border: `1px solid ${hexRgba(primary, 0.13)}`,
        }}
      />

      {/* Rare: brighter frame + outer glow */}
      {rare && (
        <div
          style={{
            position: 'absolute', left: 3, top: 3,
            width: S - 6, height: S - 6,
            borderRadius: '50%',
            border: `1.5px solid ${hexRgba(accent, 0.5)}`,
            boxShadow: `0 0 20px ${hexRgba(accent, 0.12)}`,
          }}
        />
      )}
    </div>
  );
}

// ─── Terminal (developer code-grid style) ────────────────────────────────────

function TerminalAvatar({ username, themeId }: { username: string; themeId: string }) {
  const theme = getPremiumTheme(themeId);
  const seed = hashStr(username + themeId + 'terminal');
  const rng = seededRng(seed);

  const bg = extractBg(theme.colors.bg);
  const accentColor = getBestAccentColor(theme.graphColors);

  const COLS = 20, ROWS = 20;
  const CELL = S / COLS; // 20 px each

  // 0=empty, 1=faint, 2=medium, 3=solid
  // Weighted: 45 % empty → visible pattern emerges
  const OPACITY = [0, 0.14, 0.42, 0.82] as const;
  const cells = Array.from({ length: ROWS * COLS }, () => {
    const v = rng();
    if (v < 0.45) return 0;
    if (v < 0.72) return 1;
    if (v < 0.90) return 2;
    return 3;
  });

  // Centre-lit ramp: cells closer to centre get a brightness bonus
  const maxDist = Math.sqrt((COLS / 2) ** 2 + (ROWS / 2) ** 2);

  return (
    <div
      style={{
        width: S, height: S, background: bg,
        position: 'relative', display: 'flex',
        overflow: 'hidden',
      }}
    >
      {cells.map((level, i) => {
        if (level === 0) return null;
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const dist = Math.sqrt((col - COLS / 2) ** 2 + (row - ROWS / 2) ** 2) / maxDist;
        const brightnessBonus = (1 - dist) * 0.18;
        const opacity = Math.min(1, OPACITY[level] + brightnessBonus);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: col * CELL, top: row * CELL,
              width: CELL, height: CELL,
              background: accentColor,
              opacity,
            }}
          />
        );
      })}

      {/* Scanline overlay — thin horizontal stripe every 3 px */}
      {Array.from({ length: Math.floor(S / 3) }, (_, i) => (
        <div
          key={`scan${i}`}
          style={{
            position: 'absolute',
            left: 0, top: i * 3,
            width: S, height: 1,
            background: 'rgba(0,0,0,0.07)',
          }}
        />
      ))}

      {/* Vignette for depth */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 18%, ${bg}55 58%, ${bg}cc 100%)`,
        }}
      />

      {/* Blinking cursor dot — bottom-right */}
      <div
        style={{
          position: 'absolute',
          right: 18, bottom: 22,
          width: CELL * 0.55, height: CELL,
          background: accentColor,
          opacity: 0.75,
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
  const rawStyle = searchParams.get('style') ?? 'nebula';

  // Resolve legacy aliases
  const resolvedStyle = (STYLE_ALIASES[rawStyle] ?? rawStyle) as AvatarStyle;
  const style: AvatarStyle = VALID_STYLES.includes(resolvedStyle) ? resolvedStyle : 'nebula';

  let jsx: JSX.Element;
  if (style === 'crystal') {
    jsx = <CrystalAvatar username={rawUsername} themeId={rawTheme} />;
  } else if (style === 'circuit') {
    jsx = <CircuitAvatar username={rawUsername} themeId={rawTheme} />;
  } else if (style === 'constellation') {
    jsx = <ConstellationAvatar username={rawUsername} themeId={rawTheme} />;
  } else if (style === 'terminal') {
    jsx = <TerminalAvatar username={rawUsername} themeId={rawTheme} />;
  } else {
    jsx = <NebulaAvatar username={rawUsername} themeId={rawTheme} />;
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
