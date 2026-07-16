import type { AuraRenderContext, AuraSectionName, AuraSectionOptions } from './types';
import { auraPalette, clampText, escapeXml, formatNumber, orbField, radarRings, safeId, svgShell, text } from './svg';

const FONT = `font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"`;

function makeContext(options: AuraSectionOptions, width: number, height: number): AuraRenderContext {
  return {
    ...options,
    width,
    height,
    id: `gs-${safeId(options.section)}-${safeId(options.username)}-${safeId(options.theme.name)}`,
    palette: auraPalette(options.theme),
  };
}

export function renderAuraSection(options: AuraSectionOptions): string {
  switch (options.section) {
    case 'hero':
      return renderHero(options);
    case 'stats':
      return renderStats(options);
    case 'stack':
      return renderStack(options);
    case 'social':
      return renderSocial(options);
    default:
      return renderErrorSection(options.username, options.theme.name, 'Unknown section');
  }
}

export function isAuraSectionName(value: string): value is AuraSectionName {
  return value === 'hero' || value === 'stats' || value === 'stack' || value === 'social';
}

export function renderErrorSection(username: string, themeName: string, message: string): string {
  const fake = {
    username,
    section: 'hero' as const,
    theme: {
      name: themeName,
      label: themeName,
      colors: {
        bg: '#08080c',
        cardBg: 'rgba(12,10,20,0.72)',
        border: 'rgba(255,255,255,0.2)',
        primary: '#ffffff',
        secondary: '#a1a1aa',
        accent: '#22c55e',
        ring: 'rgba(34,197,94,0.45)',
      },
      font: { family: 'system-ui', url: '' },
      effects: {},
      graphColors: ['#22c55e', '#38bdf8', '#a78bfa'],
    },
    data: {
      name: username,
      bio: null,
      avatarUrl: '',
      totalContributions: 0,
      totalStars: 0,
      topLanguages: [],
      contributionCalendar: { weeks: [] },
      streak: { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 },
      languages: [],
      stats: { totalStars: 0, totalContributions: 0, totalRepos: 0, followers: 0 },
      pinnedRepos: [],
    },
  };
  const ctx = makeContext(fake, 860, 180);
  return svgShell(ctx, `${orbField(ctx)}
    <rect x="26" y="26" width="808" height="128" rx="18" fill="rgba(12,10,20,0.64)" stroke="${ctx.palette.border}"/>
    ${text(54, 82, 'GitSkins section unavailable', `${FONT} font-size="25" font-weight="800" fill="${ctx.palette.primary}"`)}
    ${text(54, 116, message, `${FONT} font-size="15" fill="${ctx.palette.secondary}"`)}`);
}

function renderHero(options: AuraSectionOptions): string {
  const ctx = makeContext(options, 860, 240);
  const { data, palette, username } = ctx;
  const displayName = clampText(data.name || username, 34);
  const bio = clampText(data.bio || `Building with ${data.languages[0]?.name || 'code'} on GitHub.`, 92);
  const topLangs = data.languages.length ? data.languages.slice(0, 4).map((lang) => lang.name) : ['Open Source', 'Projects', 'Systems'];
  const chipY = 166;

  const chips = topLangs.map((label, index) => {
    const x = 46 + index * 126;
    return `<g class="aura-chip" style="animation-delay:${index * 90}ms">
      <rect x="${x}" y="${chipY}" width="110" height="28" rx="14" fill="rgba(255,255,255,0.055)" stroke="${palette.border}" stroke-opacity="0.68"/>
      ${text(x + 15, chipY + 19, clampText(label, 14), `${FONT} font-size="12" font-weight="750" fill="${palette.primary}"`)}
    </g>`;
  }).join('');

  return svgShell(ctx, `${orbField(ctx)}
    ${radarRings(ctx, 735, 118, 86)}
    <rect x="26" y="26" width="808" height="188" rx="20" fill="rgba(8,8,12,0.48)" stroke="${palette.border}" stroke-opacity="0.55"/>
    <circle cx="96" cy="94" r="48" fill="rgba(255,255,255,0.06)" stroke="${palette.accent}" stroke-opacity="0.75"/>
    <text x="96" y="108" text-anchor="middle" ${FONT} font-size="42" font-weight="850" fill="${palette.primary}">${escapeXml(displayName.slice(0, 1).toUpperCase())}</text>
    ${text(166, 69, `@${username}`, `${FONT} font-size="13" font-weight="800" letter-spacing="2.6" fill="${palette.secondary}" text-transform="uppercase"`)}
    ${text(166, 122, displayName, `${FONT} font-size="46" font-weight="850" letter-spacing="-1.5" fill="${palette.primary}"`)}
    ${text(168, 150, bio, `${FONT} font-size="15" fill="${palette.secondary}"`)}
    ${chips}
    <path d="M166 76 C246 50 330 50 410 77" fill="none" stroke="url(#${ctx.id}-shine)" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`);
}

function renderStats(options: AuraSectionOptions): string {
  const ctx = makeContext(options, 860, 260);
  const { data, palette } = ctx;
  const stats = [
    { label: 'Stars', value: data.stats.totalStars, color: palette.accent },
    { label: 'Contributions', value: data.stats.totalContributions, color: palette.primary },
    { label: 'Repos', value: data.stats.totalRepos, color: palette.secondary },
    { label: 'Followers', value: data.stats.followers, color: palette.accent },
  ];
  const max = Math.max(...stats.map((item) => item.value), 1);

  const cards = stats.map((item, index) => {
    const x = 34 + index * 204;
    const pct = Math.max(0.08, item.value / max);
    return `<g class="aura-chip" style="animation-delay:${index * 100}ms">
      <rect x="${x}" y="92" width="180" height="122" rx="18" fill="rgba(12,10,20,0.56)" stroke="${palette.border}" stroke-opacity="0.72"/>
      ${text(x + 22, 126, item.label, `${FONT} font-size="12" font-weight="800" letter-spacing="1.4" fill="${palette.secondary}"`)}
      ${text(x + 22, 166, formatNumber(item.value), `${FONT} font-size="35" font-weight="900" letter-spacing="-0.8" fill="${item.color}"`)}
      <rect x="${x + 22}" y="186" width="136" height="7" rx="3.5" fill="rgba(255,255,255,0.1)"/>
      <rect class="aura-bar" x="${x + 22}" y="186" width="${Math.round(136 * pct)}" height="7" rx="3.5" fill="${item.color}" opacity="0.9"/>
    </g>`;
  }).join('');

  return svgShell(ctx, `${orbField(ctx)}
    ${radarRings(ctx, 735, 82, 58)}
    <rect x="28" y="26" width="804" height="206" rx="20" fill="rgba(8,8,12,0.42)" stroke="${palette.border}" stroke-opacity="0.48"/>
    ${text(46, 61, 'Profile Signal', `${FONT} font-size="28" font-weight="850" letter-spacing="-0.5" fill="${palette.primary}"`)}
    ${text(48, 84, 'Live GitHub stats styled by GitSkins', `${FONT} font-size="13" font-weight="650" letter-spacing="1.2" fill="${palette.secondary}"`)}
    ${cards}`);
}

function renderStack(options: AuraSectionOptions): string {
  const ctx = makeContext(options, 860, 280);
  const { data, palette } = ctx;
  const languages = data.languages.length
    ? data.languages.slice(0, 8)
    : [
        { name: 'TypeScript', color: palette.accent, percentage: 38 },
        { name: 'React', color: palette.primary, percentage: 28 },
        { name: 'Next.js', color: palette.secondary, percentage: 18 },
      ];

  const rows = languages.slice(0, 5).map((lang, index) => {
    const y = 112 + index * 32;
    const color = lang.color || palette.accent;
    const percentage = Math.max(4, Math.min(100, Math.round(lang.percentage)));
    return `<g class="aura-chip" style="animation-delay:${index * 95}ms">
      <circle cx="54" cy="${y - 5}" r="5" fill="${color}"/>
      ${text(72, y, clampText(lang.name, 22), `${FONT} font-size="14" font-weight="800" fill="${palette.primary}"`)}
      ${text(306, y, `${percentage}%`, `${FONT} font-size="13" font-weight="850" fill="${color}" text-anchor="end"`)}
      <rect x="330" y="${y - 14}" width="466" height="9" rx="4.5" fill="rgba(255,255,255,0.09)"/>
      <rect class="aura-bar" x="330" y="${y - 14}" width="${Math.round(466 * percentage / 100)}" height="9" rx="4.5" fill="${color}" opacity="0.88"/>
    </g>`;
  }).join('');

  return svgShell(ctx, `${orbField(ctx)}
    <rect x="28" y="26" width="804" height="226" rx="20" fill="rgba(8,8,12,0.46)" stroke="${palette.border}" stroke-opacity="0.5"/>
    ${text(46, 61, 'Language Stack', `${FONT} font-size="27" font-weight="850" letter-spacing="-0.4" fill="${palette.primary}"`)}
    ${text(48, 84, 'Repository-weighted technologies', `${FONT} font-size="13" font-weight="650" letter-spacing="1.1" fill="${palette.secondary}"`)}
    ${text(685, 62, '> stack.scan', `${FONT} font-size="14" font-weight="750" fill="${palette.accent}"`)}
    <text class="aura-cursor" x="786" y="62" ${FONT} font-size="14" font-weight="850" fill="${palette.accent}">_</text>
    ${rows}`);
}

function renderSocial(options: AuraSectionOptions): string {
  const ctx = makeContext(options, 860, 126);
  const { palette, username, socials = [] } = ctx;
  const links = [
    { label: 'GitHub', value: `@${username}`, color: '#ffffff' },
    ...socials,
  ]
    .filter((link) => link.value)
    .slice(0, 5);
  const buttonWidth = links.length <= 3 ? 178 : links.length === 4 ? 162 : 146;
  const gap = 16;
  const totalWidth = links.length * buttonWidth + Math.max(0, links.length - 1) * gap;
  const startX = Math.round((ctx.width - totalWidth) / 2);

  const buttons = links.map((link, index) => {
    const x = startX + index * (buttonWidth + gap);
    const color = link.color || palette.accent;
    const icon = link.label.slice(0, 1).toUpperCase();
    return `<g class="aura-chip" style="animation-delay:${index * 80}ms">
      <rect x="${x}" y="40" width="${buttonWidth}" height="46" rx="23" fill="rgba(8,8,12,0.72)" stroke="url(#${ctx.id}-holo)" stroke-width="2"/>
      <rect x="${x + 1}" y="41" width="${buttonWidth - 2}" height="44" rx="22" fill="none" stroke="${color}" stroke-opacity="0.22"/>
      <circle cx="${x + 27}" cy="63" r="12" fill="${color}" fill-opacity="0.16"/>
      ${text(x + 27, 68, icon, `${FONT} font-size="13" font-weight="900" fill="${color}" text-anchor="middle"`)}
      ${text(x + 48, 59, clampText(link.label, 14), `${FONT} font-size="10" font-weight="850" letter-spacing="1.2" fill="${palette.secondary}"`)}
      ${text(x + 48, 75, clampText(link.value, buttonWidth > 150 ? 18 : 14), `${FONT} font-size="13" font-weight="800" fill="${palette.primary}"`)}
    </g>`;
  }).join('');

  return svgShell(ctx, `${orbField(ctx)}
    <rect x="26" y="22" width="808" height="82" rx="22" fill="rgba(8,8,12,0.44)" stroke="${palette.border}" stroke-opacity="0.48"/>
    ${buttons}`);
}
