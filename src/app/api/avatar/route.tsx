/**
 * GET /api/avatar?username=xxx&theme=halloween&style=nebula&family=abstract
 *
 * Generates a 400×400 themed avatar PNG.
 * Deterministic: same username+theme+style always produces the same image.
 *
 * Families: abstract | mascot | character
 * Abstract styles: nebula | crystal | circuit | constellation | terminal
 * Character archetypes: terminal-mage | ai-alchemist | interface-architect | systems-ranger | pixel-adventurer | cloud-pilot | data-oracle | docs-sage | indie-builder
 * Export sizes: 400 | 800 | 1024
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
  hexDarken,
  getBestAccentColor,
  isRare,
  AVATAR_SIZE as S,
  type AvatarBackground,
  type AvatarCharacter,
  type AvatarExpression,
  type AvatarExportSize,
  type AvatarFamily,
  type AvatarStyle,
} from '@/lib/avatar-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STYLES: AvatarStyle[] = ['nebula', 'crystal', 'circuit', 'constellation', 'terminal'];
const VALID_FAMILIES: AvatarFamily[] = ['abstract', 'mascot', 'character'];
const VALID_EXPRESSIONS: AvatarExpression[] = ['focused', 'happy', 'mysterious'];
const VALID_BACKGROUNDS: AvatarBackground[] = ['gradient', 'solid', 'pattern'];
const VALID_SIZES: AvatarExportSize[] = [400, 800, 1024];
const VALID_CHARACTERS: AvatarCharacter[] = [
  'terminal-mage',
  'ai-alchemist',
  'interface-architect',
  'systems-ranger',
  'pixel-adventurer',
  'cloud-pilot',
  'data-oracle',
  'docs-sage',
  'indie-builder',
];

const STYLE_ALIASES: Record<string, AvatarStyle> = {
  orbs: 'nebula',
  geo: 'crystal',
  pixel: 'circuit',
};

type AvatarRenderOptions = {
  username: string;
  themeId: string;
  expression: AvatarExpression;
  background: AvatarBackground;
  character?: AvatarCharacter;
};

function ScaledAvatar({ children, size }: { children: JSX.Element; size: AvatarExportSize }) {
  if (size === S) return children;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: S,
          height: S,
          transform: `scale(${size / S})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function safeTheme(themeId: string) {
  try {
    return getPremiumTheme(themeId);
  } catch {
    return getPremiumTheme('github-dark');
  }
}

function initials(username: string): string {
  return username
    .split(/[-_\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
}

function themeBackdrop(themeId: string, background: AvatarBackground) {
  const theme = safeTheme(themeId);
  const bg = extractBg(theme.colors.bg);
  const accent = theme.colors.accent;
  const secondary = theme.graphColors[theme.graphColors.length - 2] ?? theme.colors.primary;

  if (background === 'solid') return bg;
  if (background === 'pattern') {
    return `
      radial-gradient(circle at 18% 18%, ${hexRgba(accent, 0.28)} 0 2px, transparent 2px 42px),
      radial-gradient(circle at 78% 72%, ${hexRgba(secondary, 0.22)} 0 2px, transparent 2px 38px),
      linear-gradient(135deg, ${hexDarken(bg, 0.05)} 0%, ${hexDarken(bg, 0.45)} 100%)
    `;
  }

  return `
    radial-gradient(circle at 22% 18%, ${hexRgba(accent, 0.55)} 0%, transparent 34%),
    radial-gradient(circle at 78% 76%, ${hexRgba(secondary, 0.42)} 0%, transparent 34%),
    linear-gradient(135deg, ${bg} 0%, ${hexDarken(bg, 0.42)} 100%)
  `;
}

function getMascotPreset(themeId: string) {
  const id = themeId.toLowerCase();

  if (id.includes('dracula') || id.includes('satan')) {
    return {
      archetype: 'gothic',
      skin: '#f7d9df',
      hair: '#17121f',
      outfit: '#25111d',
      accessory: 'cape',
      motif: 'moon',
      eye: '#ff4d6d',
    };
  }

  if (id.includes('neon') || id.includes('retro') || id.includes('sunset')) {
    return {
      archetype: 'cyber',
      skin: '#ffd7bd',
      hair: '#15111f',
      outfit: '#17172f',
      accessory: 'visor',
      motif: 'grid',
      eye: '#22d3ee',
    };
  }

  if (id.includes('ocean') || id.includes('winter') || id.includes('aurora')) {
    return {
      archetype: 'explorer',
      skin: '#d8f3ff',
      hair: '#18324a',
      outfit: '#0c4a6e',
      accessory: 'helmet',
      motif: 'bubbles',
      eye: '#38bdf8',
    };
  }

  if (id.includes('halloween') || id.includes('autumn') || id.includes('summer')) {
    return {
      archetype: 'pumpkin',
      skin: '#fb923c',
      hair: '#3b1d0d',
      outfit: '#2a1510',
      accessory: 'hood',
      motif: 'sparks',
      eye: '#fef3c7',
    };
  }

  if (id.includes('zen') || id.includes('spring') || id.includes('pastel')) {
    return {
      archetype: 'calm',
      skin: '#ffe4e6',
      hair: '#334155',
      outfit: '#355e3b',
      accessory: 'leaves',
      motif: 'petals',
      eye: '#4ade80',
    };
  }

  if (id.includes('matrix') || id.includes('terminal') || id.includes('github') || id.includes('minimal') || id.includes('midnight')) {
    return {
      archetype: 'terminal',
      skin: '#d1fae5',
      hair: '#07130b',
      outfit: '#0b1f12',
      accessory: 'hood',
      motif: 'code',
      eye: '#22c55e',
    };
  }

  return {
    archetype: 'builder',
    skin: '#ffd7bd',
    hair: '#1f2937',
    outfit: '#102016',
    accessory: 'badge',
    motif: 'stars',
    eye: '#22c55e',
  };
}

function getCharacterPreset(character: AvatarCharacter) {
  const presets: Record<AvatarCharacter, ReturnType<typeof getMascotPreset>> = {
    'terminal-mage': {
      archetype: 'terminal',
      skin: '#d1fae5',
      hair: '#07130b',
      outfit: '#08140c',
      accessory: 'hood',
      motif: 'code',
      eye: '#22c55e',
    },
    'ai-alchemist': {
      archetype: 'alchemist',
      skin: '#e0f2fe',
      hair: '#172554',
      outfit: '#111827',
      accessory: 'visor',
      motif: 'stars',
      eye: '#2dd4bf',
    },
    'interface-architect': {
      archetype: 'architect',
      skin: '#ffd7bd',
      hair: '#18181b',
      outfit: '#1e1b4b',
      accessory: 'visor',
      motif: 'grid',
      eye: '#38bdf8',
    },
    'systems-ranger': {
      archetype: 'ranger',
      skin: '#dbeafe',
      hair: '#0f172a',
      outfit: '#111827',
      accessory: 'helmet',
      motif: 'code',
      eye: '#818cf8',
    },
    'pixel-adventurer': {
      archetype: 'adventurer',
      skin: '#fed7aa',
      hair: '#451a03',
      outfit: '#3b0764',
      accessory: 'badge',
      motif: 'sparks',
      eye: '#f472b6',
    },
    'cloud-pilot': {
      archetype: 'pilot',
      skin: '#d8f3ff',
      hair: '#18324a',
      outfit: '#0c4a6e',
      accessory: 'helmet',
      motif: 'bubbles',
      eye: '#38bdf8',
    },
    'data-oracle': {
      archetype: 'oracle',
      skin: '#fce7f3',
      hair: '#312e81',
      outfit: '#312e81',
      accessory: 'badge',
      motif: 'stars',
      eye: '#a78bfa',
    },
    'docs-sage': {
      archetype: 'sage',
      skin: '#ffe4e6',
      hair: '#334155',
      outfit: '#355e3b',
      accessory: 'leaves',
      motif: 'petals',
      eye: '#4ade80',
    },
    'indie-builder': {
      archetype: 'builder',
      skin: '#ffd7bd',
      hair: '#1f2937',
      outfit: '#102016',
      accessory: 'badge',
      motif: 'stars',
      eye: '#22c55e',
    },
  };

  return presets[character];
}

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

// ─── Mascot (original character portrait style) ──────────────────────────────

function BackgroundMotif({
  themeId,
  motif,
  accent,
  primary,
}: {
  themeId: string;
  motif: string;
  accent: string;
  primary: string;
}) {
  const seed = hashStr(themeId + motif + 'mascot-bg');
  const rng = seededRng(seed);
  const particles = Array.from({ length: 14 }, (_, i) => ({
    x: 22 + Math.round(rng() * 356),
    y: 22 + Math.round(rng() * 356),
    size: 4 + Math.round(rng() * 8),
    opacity: 0.12 + rng() * 0.22,
    rotate: Math.round(rng() * 45),
    key: i,
  }));

  if (motif === 'grid') {
    return (
      <>
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={`g-v-${i}`}
            style={{
              position: 'absolute',
              left: 40 + i * 40,
              top: 0,
              width: 1,
              height: S,
              background: hexRgba(accent, 0.12),
            }}
          />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={`g-h-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              top: 40 + i * 40,
              width: S,
              height: 1,
              background: hexRgba(primary, 0.1),
            }}
          />
        ))}
      </>
    );
  }

  if (motif === 'moon') {
    return (
      <>
        <div style={{ position: 'absolute', right: 44, top: 42, width: 58, height: 58, borderRadius: '50%', background: hexRgba(primary, 0.18) }} />
        <div style={{ position: 'absolute', right: 28, top: 31, width: 58, height: 58, borderRadius: '50%', background: 'rgba(0,0,0,0.22)' }} />
        {particles.slice(0, 8).map((dot) => (
          <div key={dot.key} style={{ position: 'absolute', left: dot.x, top: dot.y, width: 2, height: 2, borderRadius: '50%', background: primary, opacity: dot.opacity }} />
        ))}
      </>
    );
  }

  if (motif === 'code') {
    return (
      <>
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={`code-${i}`}
            style={{
              position: 'absolute',
              left: 24 + (i % 4) * 92,
              top: 28 + Math.floor(i / 4) * 62,
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: 800,
              color: i % 3 === 0 ? accent : primary,
              opacity: 0.12,
            }}
          >
            {i % 2 === 0 ? '</>' : '{}'}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {particles.map((dot) => (
        <div
          key={dot.key}
          style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            borderRadius: motif === 'sparks' ? 2 : '50%',
            background: dot.key % 2 === 0 ? accent : primary,
            opacity: dot.opacity,
            transform: `rotate(${dot.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}

function MascotMouth({ expression, color }: { expression: AvatarExpression; color: string }) {
  if (expression === 'happy') {
    return (
      <div
        style={{
          position: 'absolute',
          left: 173,
          top: 235,
          width: 54,
          height: 24,
          borderBottom: `5px solid ${color}`,
          borderRadius: '0 0 54px 54px',
        }}
      />
    );
  }

  if (expression === 'mysterious') {
    return (
      <div
        style={{
          position: 'absolute',
          left: 178,
          top: 240,
          width: 44,
          height: 4,
          borderRadius: 999,
          background: hexRgba(color, 0.75),
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 184,
        top: 240,
        width: 32,
        height: 4,
        borderRadius: 999,
        background: hexRgba(color, 0.75),
      }}
    />
  );
}

function CharacterBackLayer({
  character,
  accent,
  primary,
}: {
  character?: AvatarCharacter;
  accent: string;
  primary: string;
}) {
  if (!character) return null;

  if (character === 'ai-alchemist') {
    return (
      <>
        <div style={{ position: 'absolute', left: 105, top: 71, width: 190, height: 190, borderRadius: '50%', border: `2px solid ${hexRgba(accent, 0.24)}`, transform: 'rotate(20deg)' }} />
        <div style={{ position: 'absolute', left: 88, top: 118, width: 224, height: 96, borderRadius: '50%', border: `2px solid ${hexRgba(primary, 0.18)}`, transform: 'rotate(-18deg)' }} />
        <div style={{ position: 'absolute', left: 190, top: 66, width: 20, height: 20, borderRadius: '50%', background: primary, boxShadow: `0 0 18px ${hexRgba(primary, 0.55)}` }} />
      </>
    );
  }

  if (character === 'interface-architect') {
    return (
      <>
        <div style={{ position: 'absolute', left: 38, top: 102, width: 88, height: 64, borderRadius: 12, border: `1px solid ${hexRgba(accent, 0.28)}`, background: hexRgba('#000000', 0.16) }} />
        <div style={{ position: 'absolute', right: 34, top: 126, width: 94, height: 72, borderRadius: 12, border: `1px solid ${hexRgba(primary, 0.22)}`, background: hexRgba('#000000', 0.14) }} />
        <div style={{ position: 'absolute', left: 55, top: 122, width: 52, height: 5, borderRadius: 999, background: hexRgba(accent, 0.35) }} />
        <div style={{ position: 'absolute', right: 52, top: 150, width: 58, height: 5, borderRadius: 999, background: hexRgba(primary, 0.3) }} />
      </>
    );
  }

  if (character === 'pixel-adventurer') {
    return (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`px-star-${i}`} style={{ position: 'absolute', left: 46 + (i % 4) * 84, top: 70 + Math.floor(i / 4) * 72, width: 14, height: 14, background: i % 2 === 0 ? accent : primary, opacity: 0.2 }} />
        ))}
      </>
    );
  }

  if (character === 'data-oracle') {
    return (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={`bar-${i}`} style={{ position: 'absolute', left: 45 + i * 68, bottom: 64, width: 18, height: 36 + i * 14, borderRadius: 999, background: i % 2 === 0 ? hexRgba(accent, 0.18) : hexRgba(primary, 0.18) }} />
        ))}
      </>
    );
  }

  return null;
}

function CharacterFaceDetails({
  character,
  accent,
  primary,
}: {
  character?: AvatarCharacter;
  accent: string;
  primary: string;
}) {
  if (!character) return null;

  if (character === 'docs-sage' || character === 'data-oracle') {
    return (
      <>
        <div style={{ position: 'absolute', left: 136, top: 178, width: 48, height: 30, borderRadius: 999, border: `3px solid ${hexRgba(accent, 0.75)}` }} />
        <div style={{ position: 'absolute', right: 136, top: 178, width: 48, height: 30, borderRadius: 999, border: `3px solid ${hexRgba(accent, 0.75)}` }} />
        <div style={{ position: 'absolute', left: 184, top: 191, width: 32, height: 3, background: hexRgba(accent, 0.75) }} />
      </>
    );
  }

  if (character === 'systems-ranger' || character === 'cloud-pilot') {
    return (
      <>
        <div style={{ position: 'absolute', left: 87, top: 188, width: 26, height: 52, borderRadius: 999, background: hexRgba(primary, 0.4), border: `2px solid ${hexRgba(accent, 0.35)}` }} />
        <div style={{ position: 'absolute', right: 87, top: 188, width: 26, height: 52, borderRadius: 999, background: hexRgba(primary, 0.4), border: `2px solid ${hexRgba(accent, 0.35)}` }} />
      </>
    );
  }

  if (character === 'terminal-mage') {
    return (
      <div style={{ position: 'absolute', left: 130, top: 164, width: 140, height: 64, borderRadius: 20, border: `1px solid ${hexRgba(accent, 0.18)}`, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.12), transparent 65%)' }} />
    );
  }

  return null;
}

function CharacterProp({
  character,
  accent,
  primary,
}: {
  character?: AvatarCharacter;
  accent: string;
  primary: string;
}) {
  if (!character) return null;

  if (character === 'terminal-mage') {
    return <div style={{ position: 'absolute', right: 58, bottom: 92, fontFamily: 'monospace', fontSize: 34, fontWeight: 900, color: accent, textShadow: `0 0 14px ${hexRgba(accent, 0.55)}` }}>{'$_'}</div>;
  }

  if (character === 'ai-alchemist') {
    return <div style={{ position: 'absolute', right: 66, bottom: 96, width: 34, height: 34, borderRadius: '50%', background: `radial-gradient(circle, ${primary}, ${hexRgba(accent, 0.22)})`, boxShadow: `0 0 22px ${hexRgba(primary, 0.5)}` }} />;
  }

  if (character === 'interface-architect') {
    return <div style={{ position: 'absolute', right: 52, bottom: 94, width: 58, height: 42, borderRadius: 8, border: `2px solid ${hexRgba(accent, 0.5)}`, background: hexRgba('#000000', 0.22) }} />;
  }

  if (character === 'pixel-adventurer') {
    return <div style={{ position: 'absolute', right: 58, bottom: 98, width: 44, height: 44, background: primary, opacity: 0.85, boxShadow: `12px 12px 0 ${hexRgba(accent, 0.75)}` }} />;
  }

  if (character === 'docs-sage') {
    return <div style={{ position: 'absolute', right: 56, bottom: 94, width: 54, height: 42, borderRadius: '4px 12px 12px 4px', background: hexRgba(primary, 0.82), borderLeft: `8px solid ${accent}` }} />;
  }

  return <div style={{ position: 'absolute', right: 60, bottom: 96, width: 44, height: 44, borderRadius: 12, background: hexRgba(primary, 0.75), border: `2px solid ${hexRgba(accent, 0.45)}` }} />;
}

function MascotAvatar({ username, themeId, expression, background, character }: AvatarRenderOptions) {
  const theme = safeTheme(themeId);
  const seed = hashStr(username + themeId + expression + (character ?? 'mascot'));
  const rng = seededRng(seed);
  const rare = isRare(username, themeId);
  const preset = character ? getCharacterPreset(character) : getMascotPreset(themeId);
  const accent = theme.colors.accent;
  const primary = theme.colors.primary;
  const bg = themeBackdrop(themeId, background);
  const mark = initials(username);
  const faceColor = preset.archetype === 'pumpkin' ? '#fb923c' : preset.skin;
  const faceShadow = preset.archetype === 'pumpkin' ? '#7c2d12' : hexDarken(faceColor, 0.18);
  const eyeColor = expression === 'mysterious' ? accent : preset.eye;
  const tilt = Math.round((rng() - 0.5) * 8);

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
      <BackgroundMotif themeId={themeId} motif={preset.motif} accent={accent} primary={primary} />
      <CharacterBackLayer character={character} accent={accent} primary={primary} />

      <div
        style={{
          position: 'absolute',
          left: 42,
          bottom: -2,
          width: 316,
          height: 150,
          borderRadius: '120px 120px 42px 42px',
          background: `linear-gradient(135deg, ${preset.outfit}, ${hexDarken(preset.outfit, 0.35)})`,
          border: `2px solid ${hexRgba(accent, 0.35)}`,
          boxShadow: `0 -8px 34px ${hexRgba(accent, 0.14)}`,
        }}
      />

      {preset.accessory === 'cape' && (
        <>
          <div style={{ position: 'absolute', left: 72, top: 179, width: 88, height: 176, background: '#3b0b1b', borderRadius: '50px 10px 20px 50px', transform: 'rotate(16deg)' }} />
          <div style={{ position: 'absolute', right: 72, top: 179, width: 88, height: 176, background: '#3b0b1b', borderRadius: '10px 50px 50px 20px', transform: 'rotate(-16deg)' }} />
        </>
      )}

      {preset.accessory === 'hood' && (
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 82,
            width: 208,
            height: 232,
            borderRadius: '105px 105px 72px 72px',
            background: `linear-gradient(180deg, ${hexLighten(preset.outfit, 0.12)}, ${preset.outfit})`,
            boxShadow: `0 0 34px ${hexRgba(accent, 0.13)}`,
          }}
        />
      )}

      {preset.accessory === 'helmet' && (
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 68,
            width: 256,
            height: 256,
            borderRadius: '50%',
            border: `18px solid ${hexRgba(primary, 0.36)}`,
            boxShadow: `inset 0 0 24px ${hexRgba(accent, 0.16)}, 0 0 32px ${hexRgba(primary, 0.15)}`,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          left: 118,
          top: 92,
          width: 164,
          height: 176,
          borderRadius: preset.archetype === 'pumpkin' ? '44% 44% 50% 50%' : '48% 48% 44% 44%',
          background: `radial-gradient(circle at 32% 25%, ${hexLighten(faceColor, 0.32)}, ${faceColor} 48%, ${faceShadow} 100%)`,
          border: `2px solid ${hexRgba(accent, 0.2)}`,
          boxShadow: `0 16px 36px rgba(0,0,0,0.28), 0 0 28px ${hexRgba(accent, 0.16)}`,
          transform: `rotate(${tilt}deg)`,
          overflow: 'hidden',
        }}
      >
        {preset.archetype === 'pumpkin' && (
          <>
            <div style={{ position: 'absolute', left: 50, top: -8, width: 9, height: 184, background: hexRgba('#7c2d12', 0.16), borderRadius: 999 }} />
            <div style={{ position: 'absolute', right: 50, top: -8, width: 9, height: 184, background: hexRgba('#7c2d12', 0.16), borderRadius: 999 }} />
          </>
        )}
      </div>

      {preset.accessory !== 'hood' && preset.accessory !== 'helmet' && preset.archetype !== 'pumpkin' && (
        <div
          style={{
            position: 'absolute',
            left: 112,
            top: 78,
            width: 176,
            height: 84,
            borderRadius: '90px 90px 26px 26px',
            background: `linear-gradient(135deg, ${preset.hair}, ${hexDarken(preset.hair, 0.28)})`,
            transform: `rotate(${tilt}deg)`,
          }}
        />
      )}

      {preset.accessory === 'visor' && (
        <div
          style={{
            position: 'absolute',
            left: 124,
            top: 169,
            width: 152,
            height: 42,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${hexRgba(accent, 0.85)}, ${hexRgba(primary, 0.78)})`,
            border: `2px solid ${hexRgba('#ffffff', 0.32)}`,
            boxShadow: `0 0 24px ${hexRgba(accent, 0.42)}`,
          }}
        />
      )}

      <CharacterFaceDetails character={character} accent={accent} primary={primary} />

      {preset.accessory !== 'visor' && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 149,
              top: expression === 'mysterious' ? 190 : 183,
              width: expression === 'mysterious' ? 38 : 18,
              height: expression === 'mysterious' ? 5 : 18,
              borderRadius: 999,
              background: eyeColor,
              boxShadow: `0 0 12px ${hexRgba(eyeColor, 0.45)}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 149,
              top: expression === 'mysterious' ? 190 : 183,
              width: expression === 'mysterious' ? 38 : 18,
              height: expression === 'mysterious' ? 5 : 18,
              borderRadius: 999,
              background: eyeColor,
              boxShadow: `0 0 12px ${hexRgba(eyeColor, 0.45)}`,
            }}
          />
        </>
      )}

      <MascotMouth expression={expression} color={preset.archetype === 'pumpkin' ? '#431407' : '#1f2937'} />
      <CharacterProp character={character} accent={accent} primary={primary} />

      <div
        style={{
          position: 'absolute',
          left: 158,
          bottom: 74,
          width: 84,
          height: 44,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${hexRgba(primary, 0.96)}, ${hexRgba(accent, 0.86)})`,
          border: `1px solid ${hexRgba('#ffffff', 0.28)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#050505',
          fontFamily: 'system-ui, sans-serif',
          fontSize: mark.length > 1 ? 24 : 28,
          fontWeight: 900,
          letterSpacing: 0,
          boxShadow: `0 0 20px ${hexRgba(accent, 0.22)}`,
        }}
      >
        {mark}
      </div>

      {rare && (
        <div
          style={{
            position: 'absolute',
            left: 7,
            top: 7,
            width: S - 14,
            height: S - 14,
            borderRadius: '50%',
            border: `2px solid ${hexRgba(accent, 0.55)}`,
            boxShadow: `inset 0 0 28px ${hexRgba(accent, 0.12)}, 0 0 26px ${hexRgba(accent, 0.18)}`,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 30%, transparent 38%, rgba(0,0,0,0.26) 100%)',
          pointerEvents: 'none',
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
  const rawFamily = searchParams.get('family') ?? 'abstract';
  const rawExpression = searchParams.get('expression') ?? 'focused';
  const rawBackground = searchParams.get('bg') ?? 'gradient';
  const rawCharacter = searchParams.get('character') ?? 'indie-builder';
  const rawSize = Number(searchParams.get('size') ?? 400);

  // Resolve legacy aliases
  const resolvedStyle = (STYLE_ALIASES[rawStyle] ?? rawStyle) as AvatarStyle;
  const style: AvatarStyle = VALID_STYLES.includes(resolvedStyle) ? resolvedStyle : 'nebula';
  const family = VALID_FAMILIES.includes(rawFamily as AvatarFamily) ? rawFamily as AvatarFamily : 'abstract';
  const expression = VALID_EXPRESSIONS.includes(rawExpression as AvatarExpression) ? rawExpression as AvatarExpression : 'focused';
  const background = VALID_BACKGROUNDS.includes(rawBackground as AvatarBackground) ? rawBackground as AvatarBackground : 'gradient';
  const character = VALID_CHARACTERS.includes(rawCharacter as AvatarCharacter) ? rawCharacter as AvatarCharacter : 'indie-builder';
  const size = VALID_SIZES.includes(rawSize as AvatarExportSize) ? rawSize as AvatarExportSize : 400;

  let jsx: JSX.Element;
  if (family === 'character') {
    jsx = <MascotAvatar username={rawUsername} themeId={rawTheme} expression={expression} background={background} character={character} />;
  } else if (family === 'mascot') {
    jsx = <MascotAvatar username={rawUsername} themeId={rawTheme} expression={expression} background={background} />;
  } else if (style === 'crystal') {
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

  return new ImageResponse(<ScaledAvatar size={size}>{jsx}</ScaledAvatar>, {
    width: size,
    height: size,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
