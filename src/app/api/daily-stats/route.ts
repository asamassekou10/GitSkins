import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchDailyActivity } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  username: z.string().min(1).max(39),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = requestSchema.parse(body);

    const data = await fetchDailyActivity(username);
    if (!data) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch activity', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
