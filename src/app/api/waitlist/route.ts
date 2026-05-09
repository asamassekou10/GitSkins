import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Store waitlist email.
 * Uses Upstash KV if available, otherwise logs to console.
 */
async function storeEmail(email: string): Promise<void> {
  // Try KV storage first
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const kvModule = await import('@vercel/kv');
      if (kvModule?.kv) {
        const kv = kvModule.kv;
        // Store as a set member for deduplication
        await kv.sadd('waitlist:emails', email);
        // Also store timestamp
        await kv.hset('waitlist:timestamps', { [email]: Date.now() });
        return;
      }
    } catch {
      // KV not available, fall through to console logging
    }
  }

  // Avoid writing raw emails to server logs. In local development we only log a
  // redacted marker so contributors know the request reached the fallback path.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[WAITLIST] ${new Date().toISOString()} — ${email.replace(/(^.).*(@.*$)/, '$1***$2')}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmed = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    await storeEmail(trimmed);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
