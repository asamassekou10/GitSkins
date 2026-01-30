/**
 * AI Portfolio Website Generate API Route
 *
 * POST /api/ai/portfolio-website
 * Generates a full portfolio website (HTML + CSS) from GitHub profile and case studies.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchProfileForReadme } from '@/lib/github';
import { buildPortfolioCaseStudies, generatePortfolioWebsite, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  username: z.string().min(1).max(39),
});

export async function POST(request: NextRequest) {
  try {
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

    const caseStudies = await buildPortfolioCaseStudies(profileData, username);
    const { html, css } = await generatePortfolioWebsite(profileData, username, caseStudies);

    return NextResponse.json({
      success: true,
      html,
      css,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Portfolio website generation error:', errorMessage, error);

    return NextResponse.json(
      { error: `Failed to generate portfolio website: ${errorMessage}`, code: 'GENERATE_ERROR' },
      { status: 500 }
    );
  }
}
