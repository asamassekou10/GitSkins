/**
 * AI Explain Profile API Route
 *
 * POST /api/ai/explain-profile
 * Returns a 2–3 sentence Gemini summary of a GitHub profile.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPlanById } from '@/lib/server-usage';
import { z } from 'zod';
import { fetchProfileForReadme } from '@/lib/github';
import { explainProfileWithGemini, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  username: z.string().min(1).max(39),
});

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
        { error: 'AI features not available. Please ensure GEMINI_API_KEY is configured.', code: 'AI_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { username } = requestSchema.parse(body);

    const profileData = await fetchProfileForReadme(username);

    if (!profileData) {
      return NextResponse.json(
        { error: `GitHub user "${username}" not found`, code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const summary = await explainProfileWithGemini(profileData, username);

    return NextResponse.json({
      success: true,
      username,
      summary,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Explain profile error:', errorMessage, error);

    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service configuration error. Please check API keys.', code: 'API_KEY_ERROR' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Failed to explain profile: ${errorMessage}`, code: 'EXPLAIN_ERROR' },
      { status: 500 }
    );
  }
}
