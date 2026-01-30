/**
 * AI Portfolio Website Edit API Route
 *
 * POST /api/ai/portfolio-website-edit
 * Edits portfolio website (HTML/CSS) via natural language chat.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { editPortfolioWebsite, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  html: z.string().min(1),
  css: z.string(),
  message: z.string().min(1).max(500),
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
    const { html, css, message } = requestSchema.parse(body);

    const { html: outHtml, css: outCss } = await editPortfolioWebsite(html, css, message);

    return NextResponse.json({
      success: true,
      html: outHtml,
      css: outCss,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Portfolio website edit error:', errorMessage, error);

    return NextResponse.json(
      { error: `Failed to edit portfolio: ${errorMessage}`, code: 'EDIT_ERROR' },
      { status: 500 }
    );
  }
}
