/**
 * AI Theme Recommendations API Route
 *
 * POST /api/ai/recommend-themes
 * Recommends the best themes for a GitHub profile using Gemini AI.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchProfileForReadme } from '@/lib/github';
import { getThemeRecommendations, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  username: z.string().min(1).max(39),
});

export async function POST(request: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      console.error('Gemini API key not configured');
      return NextResponse.json(
        { error: 'AI features not available. Please ensure GEMINI_API_KEY is configured.', code: 'AI_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { username } = requestSchema.parse(body);

    // Fetch GitHub profile data
    const profileData = await fetchProfileForReadme(username);

    if (!profileData) {
      return NextResponse.json(
        { error: `GitHub user "${username}" not found`, code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get theme recommendations with Gemini
    const recommendations = await getThemeRecommendations(profileData, username);

    return NextResponse.json({
      success: true,
      username,
      recommendations,
      profile: {
        name: profileData.name,
        avatarUrl: profileData.avatarUrl,
        topLanguages: profileData.languages.slice(0, 3).map((l) => l.name),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Theme recommendation error:', errorMessage, error);
    
    return NextResponse.json(
      { error: `Failed to get recommendations: ${errorMessage}`, code: 'RECOMMENDATION_ERROR' },
      { status: 500 }
    );
  }
}
