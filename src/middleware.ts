/**
 * GitSkins - Middleware
 * 
 * Security headers, CORS, and rate limiting middleware.
 * Runs on Edge Runtime for optimal performance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityConfig, rateLimitConfig } from '@/config/site';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

/**
 * Rate limiting using KV (Upstash Redis)
 * 
 * @param request - Next.js request object
 * @param identifier - Unique identifier (IP address or user ID)
 * @returns true if within rate limit, false if exceeded
 */
async function checkRateLimit(
  request: NextRequest,
  identifier: string
): Promise<boolean> {
  if (!rateLimitConfig.enabled) {
    return true;
  }

  // If KV is not configured, skip rate limiting
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return true;
  }

  // @vercel/kv is optional - if not installed, rate limiting is disabled
  try {
    const kvModule = await import('@vercel/kv');
    
    if (!kvModule || !kvModule.kv) {
      // @vercel/kv not available - rate limiting disabled
      return true;
    }
    
    const kv = kvModule.kv;
    const key = `ratelimit:${identifier}`;
    const current = await kv.get<number>(key);

    if (current === null) {
      // First request in window
      await kv.setex(key, rateLimitConfig.windowSeconds, 1);
      return true;
    }

    if (current >= rateLimitConfig.requestsPerWindow) {
      // Rate limit exceeded
      return false;
    }

    // Increment counter
    await kv.incr(key);
    return true;
  } catch (error: any) {
    // If @vercel/kv is not installed or KV fails, allow request (fail open)
    // Rate limiting is optional, so we don't block requests if it fails
    // Check if it's a module not found error
    if (error?.code === 'MODULE_NOT_FOUND' || error?.message?.includes('Cannot find module')) {
      // Package not installed - that's okay, rate limiting is optional
      return true;
    }
    // Other errors - also allow (fail open)
    return true;
  }
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for Vercel/proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  return (
    cfConnectingIp ||
    realIp ||
    forwardedFor?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/**
 * Waitlist gating.
 *
 * When WAITLIST_ENABLED=true, all page routes redirect to /waitlist unless
 * the visitor has a bypass cookie. To bypass:
 *   - Visit any URL with ?access=<WAITLIST_SECRET> (sets a cookie)
 *   - The cookie persists for 30 days
 */
function checkWaitlistAccess(request: NextRequest): NextResponse | null {
  if (process.env.WAITLIST_ENABLED !== 'true') {
    return null; // Waitlist disabled — allow all traffic
  }

  const { pathname, searchParams } = request.nextUrl;

  // Always allow: waitlist page, waitlist API, all other APIs, auth routes
  if (
    pathname === '/waitlist' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  // Check for bypass via query param
  const accessKey = searchParams.get('access');
  const secret = process.env.WAITLIST_SECRET || 'gitskins2026';

  if (accessKey === secret) {
    // Set bypass cookie and redirect to clean URL
    const url = request.nextUrl.clone();
    url.searchParams.delete('access');
    const response = NextResponse.redirect(url);
    response.cookies.set('gitskins_access', secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // Check for existing bypass cookie
  const cookie = request.cookies.get('gitskins_access');
  if (cookie?.value === secret) {
    return null; // Has valid bypass
  }

  // Redirect to waitlist
  const waitlistUrl = request.nextUrl.clone();
  waitlistUrl.pathname = '/waitlist';
  waitlistUrl.search = '';
  return NextResponse.redirect(waitlistUrl);
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  // Waitlist gate check (runs before everything else)
  const waitlistResponse = checkWaitlistAccess(request);
  if (waitlistResponse) return waitlistResponse;

  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Content Security Policy
  const csp = [
    `default-src ${securityConfig.csp.defaultSrc.join(' ')}`,
    `img-src ${securityConfig.csp.imgSrc.join(' ')}`,
    `style-src ${securityConfig.csp.styleSrc.join(' ')}`,
    `script-src ${securityConfig.csp.scriptSrc.join(' ')}`,
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // CORS Headers (for API routes)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    if (origin && securityConfig.allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
  }

  // Rate Limiting (for API routes)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = getClientIdentifier(request);
    const isAllowed = await checkRateLimit(request, identifier);

    if (!isAllowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': rateLimitConfig.windowSeconds.toString(),
            ...Object.fromEntries(response.headers.entries()),
          },
        }
      );
    }
  }

  return response;
}
