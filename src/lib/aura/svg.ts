import type { NextResponse } from 'next/server';
import { apiConfig } from '@/config/site';
import type { AuraPalette, AuraRenderContext } from './types';
import type { PremiumTheme } from '@/types/premium-theme';

const FALLBACK_BG = '#08080c';

export function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function clampText(value: unknown, max = 80): string {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en', { notation: value >= 10000 ? 'compact' : 'standard' }).format(value);
}

export function safeId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'aura';
}

function firstHex(value: string | undefined): string | null {
  return value?.match(/#[0-9a-fA-F]{3,8}/)?.[0] ?? null;
}

function rgbToHex(value: string | undefined): string | null {
  const match = value?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return null;
  return `#${match.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
}

function solidColor(value: string | undefined, fallback: string): string {
  return firstHex(value) ?? rgbToHex(value) ?? fallback;
}

export function auraPalette(theme: PremiumTheme): AuraPalette {
  const graphColors = theme.graphColors.length ? theme.graphColors : [theme.colors.accent, theme.colors.primary];
  const bg = solidColor(theme.colors.bg, FALLBACK_BG);
  return {
    bg,
    card: solidColor(theme.colors.cardBg, bg),
    border: solidColor(theme.colors.border, theme.colors.accent),
    primary: solidColor(theme.colors.primary, '#ffffff'),
    secondary: solidColor(theme.colors.secondary, '#a1a1aa'),
    accent: solidColor(theme.colors.accent, '#22c55e'),
    ring: solidColor(theme.colors.ring, theme.colors.accent),
    orbs: Array.from(new Set([theme.colors.accent, theme.colors.primary, theme.colors.secondary, ...graphColors].map((color) => solidColor(color, theme.colors.accent))))
      .filter(Boolean)
      .slice(0, 8),
  };
}

export function svgResponse(svg: string): NextResponse {
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': `public, max-age=${apiConfig.cacheMaxAge}, s-maxage=${apiConfig.cacheSMaxAge}, stale-while-revalidate=86400`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  }) as NextResponse;
}

export function svgShell(ctx: AuraRenderContext, body: string): string {
  const { id, width, height, palette } = ctx;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitSkins ${escapeXml(id)} section">
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bg}"/>
      <stop offset="54%" stop-color="${palette.card}"/>
      <stop offset="100%" stop-color="${palette.bg}"/>
    </linearGradient>
    ${palette.orbs.map((color, index) => `
    <radialGradient id="${id}-orb-${index}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="${index % 2 === 0 ? '0.72' : '0.5'}"/>
      <stop offset="58%" stop-color="${color}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>`).join('')}
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${palette.primary}" stop-opacity="0.2"/>
      <stop offset="44%" stop-color="${palette.accent}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${palette.secondary}" stop-opacity="0.22"/>
    </linearGradient>
    <linearGradient id="${id}-holo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.primary}"/>
      <stop offset="18%" stop-color="${palette.bg}"/>
      <stop offset="38%" stop-color="${palette.accent}"/>
      <stop offset="58%" stop-color="${palette.secondary}"/>
      <stop offset="78%" stop-color="${palette.bg}"/>
      <stop offset="100%" stop-color="${palette.primary}"/>
      <animateTransform attributeName="gradientTransform" type="rotate" from="0 0.5 0.5" to="360 0.5 0.5" dur="8s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <style>
    #${id} .aura-orb-a { animation: ${id}-float-a 9s ease-in-out infinite; }
    #${id} .aura-orb-b { animation: ${id}-float-b 11s ease-in-out infinite 1.1s; }
    #${id} .aura-orb-c { animation: ${id}-float-c 13s ease-in-out infinite 0.6s; }
    #${id} .aura-ring { animation: ${id}-ring 8s ease-in-out infinite; }
    #${id} .aura-ring-b { animation: ${id}-ring 10s ease-in-out infinite 1.6s; }
    #${id} .aura-chip { animation: ${id}-chip 650ms ease-out both; }
    #${id} .aura-cursor { animation: ${id}-cursor 1.1s step-end infinite; }
    #${id} .aura-bar { animation: ${id}-bar 1.15s ease-out both; transform-box: fill-box; transform-origin: left; }
    @keyframes ${id}-float-a { 0%,100% { transform: translate(0,0); opacity: .58; } 50% { transform: translate(28px,-20px); opacity: .86; } }
    @keyframes ${id}-float-b { 0%,100% { transform: translate(0,0); opacity: .42; } 50% { transform: translate(-24px,18px); opacity: .72; } }
    @keyframes ${id}-float-c { 0%,100% { transform: translate(0,0) scale(1); opacity: .34; } 50% { transform: translate(18px,-12px) scale(1.18); opacity: .62; } }
    @keyframes ${id}-ring { 0%,100% { opacity: .06; } 50% { opacity: .22; } }
    @keyframes ${id}-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ${id}-cursor { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
    @keyframes ${id}-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  </style>
  <g id="${id}">
    <rect width="${width}" height="${height}" rx="20" fill="url(#${id}-bg)"/>
    ${body}
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="19.5" fill="none" stroke="${palette.border}" stroke-opacity="0.62"/>
  </g>
</svg>`;
}

export function orbField(ctx: AuraRenderContext): string {
  const { id, width, height } = ctx;
  return `
    <ellipse class="aura-orb-a" cx="${Math.round(width * 0.16)}" cy="${Math.round(height * 0.18)}" rx="${Math.round(width * 0.24)}" ry="${Math.round(height * 0.46)}" fill="url(#${id}-orb-0)"/>
    <ellipse class="aura-orb-b" cx="${Math.round(width * 0.76)}" cy="${Math.round(height * 0.22)}" rx="${Math.round(width * 0.28)}" ry="${Math.round(height * 0.42)}" fill="url(#${id}-orb-1)"/>
    <ellipse class="aura-orb-c" cx="${Math.round(width * 0.58)}" cy="${Math.round(height * 0.88)}" rx="${Math.round(width * 0.36)}" ry="${Math.round(height * 0.34)}" fill="url(#${id}-orb-2)"/>
    <ellipse class="aura-orb-b" cx="${Math.round(width * 0.96)}" cy="${Math.round(height * 0.78)}" rx="${Math.round(width * 0.2)}" ry="${Math.round(height * 0.42)}" fill="url(#${id}-orb-3)"/>`;
}

export function radarRings(ctx: AuraRenderContext, cx: number, cy: number, radius = 92): string {
  const { palette } = ctx;
  return `
    <circle class="aura-ring" cx="${cx}" cy="${cy}" r="${radius * 0.36}" fill="none" stroke="${palette.primary}" stroke-opacity="0.36"/>
    <circle class="aura-ring-b" cx="${cx}" cy="${cy}" r="${radius * 0.62}" fill="none" stroke="${palette.primary}" stroke-opacity="0.22"/>
    <circle class="aura-ring" cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${palette.primary}" stroke-opacity="0.14"/>
    <g transform="rotate(-32 ${cx} ${cy})">
      <circle cx="${cx + radius * 0.62}" cy="${cy}" r="4" fill="${palette.accent}">
        <animateTransform attributeName="transform" type="scale" values="0.85;1.2;0.85" dur="1.6s" repeatCount="indefinite"/>
      </circle>
    </g>`;
}

export function text(x: number, y: number, value: unknown, attrs = ''): string {
  return `<text x="${x}" y="${y}" ${attrs}>${escapeXml(value)}</text>`;
}
