/**
 * AI Portfolio Builder API Route
 *
 * POST /api/ai/portfolio
 * Generates portfolio case studies from GitHub repos using Gemini.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchProfileForReadme } from '@/lib/github';
import { buildPortfolioCaseStudies, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  username: z.string().min(1).max(39),
});

export async function POST(request: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'AI features not available', code: 'AI_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { username } = requestSchema.parse(body);

    const profileData = await fetchProfileForReadme(username);

    if (!profileData) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const caseStudies = await buildPortfolioCaseStudies(profileData, username);

    return NextResponse.json({
      success: true,
      username,
      caseStudies,
      profile: {
        name: profileData.name,
        avatarUrl: profileData.avatarUrl,
        bio: profileData.bio,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Portfolio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to build portfolio', code: 'PORTFOLIO_ERROR' },
      { status: 500 }
    );
  }
}
