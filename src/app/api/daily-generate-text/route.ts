import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateDailyCardText, isGeminiConfigured } from '@/lib/gemini';
import { getUserPlanById } from '@/lib/server-usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Sign in required', code: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const plan = await getUserPlanById(userId);
    if (plan !== 'pro') {
      return NextResponse.json({ error: 'Pro plan required. Upgrade at gitskins.com/pricing', code: 'UPGRADE_REQUIRED' }, { status: 403 });
    }

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
