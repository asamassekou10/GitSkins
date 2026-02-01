import { NextRequest, NextResponse } from 'next/server';
import { generateDailyCardText, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'AI not configured', code: 'AI_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const { commitMessages, username } = await request.json();
    const text = await generateDailyCardText(commitMessages || [], username || 'developer');
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate text', code: 'GENERATION_ERROR' },
      { status: 500 }
    );
  }
}
