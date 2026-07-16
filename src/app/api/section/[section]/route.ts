import { NextRequest, NextResponse } from 'next/server';
import { fetchExtendedGitHubData } from '@/lib/github';
import { validateWidgetQuery } from '@/lib/validations';
import { getPremiumTheme } from '@/registry/themes/premium-registry';
import type { PremiumThemeName } from '@/types/premium-theme';
import { isAuraSectionName, renderAuraSection, renderErrorSection } from '@/lib/aura/sections';
import { svgResponse } from '@/lib/aura/svg';
import type { AuraSocialLink } from '@/lib/aura/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ section: string }> | { section: string };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const section = params.section;
  const searchParams = request.nextUrl.searchParams;

  try {
    if (!isAuraSectionName(section)) {
      return svgResponse(renderErrorSection('gitskins', 'github-dark', `Unknown section: ${section}`));
    }

    const { username, theme } = validateWidgetQuery({
      username: searchParams.get('username'),
      theme: searchParams.get('theme') || 'aurora',
    });
    const data = await fetchExtendedGitHubData(username);

    if (!data) {
      return svgResponse(renderErrorSection(username, theme, `GitHub user not found: ${username}`));
    }

    const premiumTheme = getPremiumTheme(theme as PremiumThemeName);
    return svgResponse(renderAuraSection({
      username,
      section,
      theme: premiumTheme,
      data,
      socials: readSocialParams(searchParams),
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to render section';
    return svgResponse(renderErrorSection('gitskins', 'github-dark', message));
  }
}

function readSocialParams(searchParams: URLSearchParams): AuraSocialLink[] {
  const website = searchParams.get('website');
  const x = searchParams.get('x') || searchParams.get('twitter');
  const linkedin = searchParams.get('linkedin');
  const email = searchParams.get('email');

  const links: Array<AuraSocialLink | null> = [
    website ? { label: 'Website', value: cleanDisplayValue(website), color: '#38bdf8' } : null,
    x ? { label: 'X', value: x.startsWith('@') ? x : `@${x}`, color: '#f8fafc' } : null,
    linkedin ? { label: 'LinkedIn', value: cleanDisplayValue(linkedin), color: '#60a5fa' } : null,
    email ? { label: 'Email', value: cleanDisplayValue(email), color: '#f472b6' } : null,
  ];

  return links.filter((link): link is AuraSocialLink => Boolean(link));
}

function cleanDisplayValue(value: string): string {
  return value
    .replace(/^https?:\/\//i, '')
    .replace(/^mailto:/i, '')
    .replace(/\/$/, '');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
