import { NextRequest, NextResponse } from 'next/server';
import { getPremiumTheme } from '@/registry/themes/premium-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WIDTH = 1200;
const HEIGHT = 630;

function esc(str: string): string {
  return str.replace(/[<>"&']/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : c === '&' ? '&amp;' : '&#39;'
  );
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const username = esc((sp.get('username') || 'developer').slice(0, 40));
    const themeName = sp.get('theme') || 'satan';
    const todayText = esc((sp.get('today') || '').slice(0, 200));
    const tomorrowText = esc((sp.get('tomorrow') || '').slice(0, 200));
    const commits = esc(sp.get('commits') || '0');
    const additions = esc(sp.get('additions') || '0');
    const deletions = esc(sp.get('deletions') || '0');
    const prs = esc(sp.get('prs') || '0');
    const date = esc((sp.get('date') || new Date().toISOString().split('T')[0]).slice(0, 10));
    const name = esc((sp.get('name') || username).slice(0, 50));
    const avatar = sp.get('avatar') || `https://github.com/${sp.get('username') || 'octocat'}.png`;

    const theme = getPremiumTheme(themeName);
    const c = theme.colors;

    // Build "Today I..." + "Tomorrow I'll..." section
    let textY = 188;
    let textSections = '';

    if (todayText) {
      textSections += `
        <text x="52" y="${textY}" fill="${c.accent}" font-size="11" font-weight="700" letter-spacing="1.5" text-transform="uppercase" font-family="system-ui, sans-serif">TODAY I...</text>
        <text x="52" y="${textY + 24}" fill="${c.primary}" font-size="18" font-weight="600" font-family="system-ui, sans-serif">${todayText}</text>
      `;
      textY += 64;
    }

    if (tomorrowText) {
      textSections += `
        <text x="52" y="${textY}" fill="${c.accent}" font-size="11" font-weight="700" letter-spacing="1.5" font-family="system-ui, sans-serif">TOMORROW I'LL...</text>
        <text x="52" y="${textY + 24}" fill="${c.secondary}" font-size="16" font-weight="500" font-family="system-ui, sans-serif">${tomorrowText}</text>
      `;
    }

    // Stats
    const stats = [
      { label: 'COMMITS', value: commits },
      { label: '+ LINES', value: additions },
      { label: '- LINES', value: deletions },
      { label: 'PRS', value: prs },
    ];
    const statWidth = 260;
    const statsStartX = 44;
    const statsY = 470;

    const statBoxes = stats
      .map((stat, i) => {
        const x = statsStartX + i * (statWidth + 12);
        return `
          <rect x="${x}" y="${statsY}" width="${statWidth}" height="72" rx="12" fill="${c.accent}" fill-opacity="0.07" stroke="${c.accent}" stroke-opacity="0.15" stroke-width="1"/>
          <text x="${x + statWidth / 2}" y="${statsY + 32}" text-anchor="middle" fill="${c.primary}" font-size="22" font-weight="800" font-family="system-ui, sans-serif">${stat.value}</text>
          <text x="${x + statWidth / 2}" y="${statsY + 54}" text-anchor="middle" fill="${c.secondary}" fill-opacity="0.7" font-size="10" font-weight="600" letter-spacing="0.8" font-family="system-ui, sans-serif">${stat.label}</text>
        `;
      })
      .join('');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="accent-bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${c.accent}"/>
      <stop offset="50%" stop-color="${c.primary}"/>
      <stop offset="100%" stop-color="${c.accent}"/>
    </linearGradient>
    <linearGradient id="card-bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${c.cardBg}" stop-opacity="0.87"/>
      <stop offset="50%" stop-color="${c.cardBg}" stop-opacity="0.67"/>
      <stop offset="100%" stop-color="${c.bg}" stop-opacity="0.87"/>
    </linearGradient>
    <clipPath id="avatar-clip">
      <rect x="52" y="104" width="56" height="56" rx="16"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${c.bg}"/>

  <!-- Card container -->
  <rect x="20" y="20" width="${WIDTH - 40}" height="${HEIGHT - 40}" rx="20" fill="url(#card-bg)" stroke="${c.border}" stroke-width="1"/>

  <!-- Accent gradient bar -->
  <rect x="20" y="20" width="${WIDTH - 40}" height="4" rx="0" fill="url(#accent-bar)"/>

  <!-- Avatar -->
  <image xlink:href="${esc(avatar)}" x="52" y="104" width="56" height="56" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="52" y="104" width="56" height="56" rx="16" fill="none" stroke="${c.accent}" stroke-width="2"/>

  <!-- Name -->
  <text x="124" y="128" fill="${c.primary}" font-size="24" font-weight="800" font-family="system-ui, sans-serif" letter-spacing="-0.5">${name}</text>
  <text x="124" y="150" fill="${c.accent}" font-size="14" font-weight="600" font-family="system-ui, sans-serif" opacity="0.9">@${username}</text>

  <!-- Date -->
  <text x="${WIDTH - 60}" y="135" text-anchor="end" fill="${c.secondary}" font-size="14" font-weight="500" font-family="system-ui, sans-serif" opacity="0.7">${date}</text>

  <!-- Text content -->
  ${textSections}

  <!-- Stats row -->
  ${statBoxes}

  <!-- Footer -->
  <text x="${WIDTH - 60}" y="${HEIGHT - 40}" text-anchor="end" fill="${c.secondary}" font-size="11" font-weight="500" font-family="system-ui, sans-serif" opacity="0.5" letter-spacing="0.5">Generated by GitSkins.com</text>
</svg>`;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Daily card error:', error);
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="50%" y="50%" text-anchor="middle" fill="#22c55e" font-size="28" font-family="system-ui,sans-serif">Failed to generate card</text>
</svg>`;
    return new NextResponse(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' },
    });
  }
}
