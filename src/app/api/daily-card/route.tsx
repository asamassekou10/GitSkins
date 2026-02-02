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

function wrapText(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + 1 + words[i].length <= maxChars) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}


async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const contentType = res.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.warn('Failed to fetch avatar for embedding:', e);
    return url; // Fallback to URL if fetch fails
  }
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const username = (sp.get('username') || 'developer').slice(0, 40);
    const themeName = sp.get('theme') || 'satan';
    const todayText = (sp.get('today') || '').slice(0, 400); // Increased limit slightly
    const tomorrowText = (sp.get('tomorrow') || '').slice(0, 400);
    const commits = esc(sp.get('commits') || '0');
    const additions = esc(sp.get('additions') || '0');
    const deletions = esc(sp.get('deletions') || '0');
    const prs = esc(sp.get('prs') || '0');
    const date = esc((sp.get('date') || new Date().toISOString().split('T')[0]).slice(0, 10));
    const name = esc((sp.get('name') || username).slice(0, 50));
    
    const avatarUrl = sp.get('avatar') || `https://github.com/${sp.get('username') || 'octocat'}.png`;
    const avatar = await fetchImageAsBase64(avatarUrl);

    const theme = getPremiumTheme(themeName);
    const c = theme.colors;

    // Layout configuration
    const PADDING = 60;
    const CONTENT_WIDTH = WIDTH - (PADDING * 2);
    const CHARS_PER_LINE = 90;
    const LINE_HEIGHT = 32;
    
    // Process text
    const todayLines = wrapText(todayText, CHARS_PER_LINE);
    const tomorrowLines = wrapText(tomorrowText, CHARS_PER_LINE);

    // Calculate dynamic heights
    let currentY = 180;
    
    // Build Text Sections
    let textContent = '';

    if (todayLines.length > 0) {
      textContent += `
        <g transform="translate(${PADDING}, ${currentY})">
          <text x="0" y="0" fill="${c.accent}" font-size="13" font-weight="700" letter-spacing="2" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.9">TODAY I...</text>
          ${todayLines.map((line, i) => 
            `<text x="0" y="${30 + (i * LINE_HEIGHT)}" fill="${c.primary}" font-size="20" font-weight="500" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${esc(line)}</text>`
          ).join('')}
        </g>
      `;
      currentY += 50 + (todayLines.length * LINE_HEIGHT);
    }

    if (tomorrowLines.length > 0) {
      // Add some spacing between sections
      currentY += 20;
      textContent += `
        <g transform="translate(${PADDING}, ${currentY})">
          <text x="0" y="0" fill="${c.accent}" font-size="13" font-weight="700" letter-spacing="2" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.9">TOMORROW I'LL...</text>
          ${tomorrowLines.map((line, i) => 
            `<text x="0" y="${30 + (i * LINE_HEIGHT)}" fill="${c.secondary}" font-size="20" font-weight="500" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${esc(line)}</text>`
          ).join('')}
        </g>
      `;
    }

    // Stats Section (Bottom)
    const stats = [
      { label: 'COMMITS', value: commits, icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z' }, // Simplified icons for now
      { label: 'ADDITIONS', value: additions },
      { label: 'DELETIONS', value: deletions },
      { label: 'MERGED PRS', value: prs },
    ];

    const statsY = HEIGHT - 100;
    const statWidth = CONTENT_WIDTH / 4;
    
    const statsContent = stats.map((stat, i) => {
      const x = PADDING + (i * statWidth);
      return `
        <g transform="translate(${x}, ${statsY})">
          <rect x="0" y="-20" width="${statWidth - 20}" height="80" rx="12" fill="${c.accent}" fill-opacity="0.05" stroke="${c.accent}" stroke-opacity="0.1" stroke-width="1"/>
          <text x="20" y="15" fill="${c.primary}" font-size="28" font-weight="700" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${stat.value}</text>
          <text x="20" y="40" fill="${c.secondary}" font-size="11" font-weight="600" letter-spacing="1" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.8">${stat.label}</text>
        </g>
      `;
    }).join('');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.bg}"/>
      <stop offset="100%" stop-color="${c.cardBg}"/>
    </linearGradient>
    <clipPath id="avatar-clip">
      <circle cx="${PADDING + 32}" cy="80" r="32"/>
    </clipPath>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${c.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-gradient)" opacity="0.5"/>
  
  <!-- Decorative Elements -->
  <circle cx="${WIDTH}" cy="0" r="300" fill="${c.accent}" fill-opacity="0.05" filter="url(#glow)"/>
  <circle cx="0" cy="${HEIGHT}" r="200" fill="${c.primary}" fill-opacity="0.05" filter="url(#glow)"/>

  <!-- Header Section -->
  <line x1="${PADDING}" y1="140" x2="${WIDTH - PADDING}" y2="140" stroke="${c.border}" stroke-width="1" stroke-opacity="0.5"/>
  
  <!-- Avatar -->
  <image xlink:href="${esc(avatar)}" x="${PADDING}" y="48" width="64" height="64" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="${PADDING + 32}" cy="80" r="32" fill="none" stroke="${c.accent}" stroke-width="2" stroke-opacity="0.5"/>

  <!-- User Info -->
  <text x="${PADDING + 80}" y="75" fill="${c.primary}" font-size="28" font-weight="800" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${name}</text>
  <text x="${PADDING + 80}" y="100" fill="${c.accent}" font-size="16" font-weight="500" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.8">@${esc(username)}</text>

  <!-- Date Badge -->
  <rect x="${WIDTH - PADDING - 140}" y="58" width="140" height="44" rx="22" fill="${c.accent}" fill-opacity="0.1"/>
  <text x="${WIDTH - PADDING - 70}" y="86" text-anchor="middle" fill="${c.primary}" font-size="16" font-weight="600" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">${date}</text>

  <!-- Content -->
  ${textContent}

  <!-- Stats -->
  ${statsContent}

  <!-- Branding -->
  <text x="${WIDTH - PADDING}" y="${HEIGHT - 30}" text-anchor="end" fill="${c.secondary}" font-size="12" font-weight="500" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" opacity="0.4">git-skins.com</text>
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
  <text x="50%" y="50%" text-anchor="middle" fill="#ef4444" font-size="24" font-family="sans-serif">Error generating card</text>
</svg>`;
    return new NextResponse(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' },
    });
  }
}
