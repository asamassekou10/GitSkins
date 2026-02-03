/**
 * Proxy external images for portfolio preview so they load in same-origin iframes.
 * Only allows image.pollinations.ai and other configured hosts.
 */

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['image.pollinations.ai', 'images.unsplash.com', 'picsum.photos'];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && ALLOWED_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || !isAllowedUrl(url)) {
    return new NextResponse('Bad request', { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'GitSkins-Portfolio-Preview/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      return new NextResponse('Upstream error', { status: 502 });
    }
    const contentType = res.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await res.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    console.warn('Proxy image failed:', e);
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
}
