/**
 * AI Profile Analysis API Route
 *
 * POST /api/ai/analyze
 * Analyzes a GitHub profile and provides personality insights using Gemini AI.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchProfileForReadme } from '@/lib/github';
import { analyzeProfileWithGemini, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  username: z.string().min(1).max(39),
});

export async function POST(request: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      console.error('Gemini API key not configured. Set GEMINI_API_KEY environment variable.');
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

    // Analyze profile with Gemini
    const analysis = await analyzeProfileWithGemini(profileData, username);

    return NextResponse.json({
      success: true,
      username,
      analysis,
      profile: {
        name: profileData.name,
        avatarUrl: profileData.avatarUrl,
        bio: profileData.bio,
        followers: profileData.followers,
        totalStars: profileData.totalStars,
        totalRepos: profileData.totalRepos,
        totalContributions: profileData.totalContributions,
        streak: profileData.streak,
        languages: profileData.languages.slice(0, 5),
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
    console.error('Profile analysis error:', errorMessage, error);
    
    // Check for specific error types
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service configuration error. Please check API keys.', code: 'API_KEY_ERROR' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to analyze profile: ${errorMessage}`, code: 'ANALYSIS_ERROR' },
      { status: 500 }
    );
  }
}
