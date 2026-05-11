import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  username: z.string().min(1).max(39).regex(/^[a-zA-Z0-9-]+$/),
  size: z.coerce.number().int().min(40).max(1200).default(400),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    username: request.nextUrl.searchParams.get('username') ?? '',
    size: request.nextUrl.searchParams.get('size') ?? 400,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid GitHub avatar request' }, { status: 400 });
  }

  const { username, size } = parsed.data;
  const avatarUrl = `https://github.com/${encodeURIComponent(username)}.png?size=${size}`;

  try {
    const response = await fetch(avatarUrl, {
      headers: {
        'User-Agent': 'GitSkins/1.0',
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8',
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'GitHub avatar not found' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') ?? 'image/png';
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load GitHub avatar' }, { status: 502 });
  }
}
