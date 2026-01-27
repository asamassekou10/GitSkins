/**
 * AI Chat Assistant API Route
 *
 * POST /api/ai/chat
 * Chat with GitSkins AI Assistant powered by Gemini.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { chatWithGemini, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    username: z.string().optional(),
    currentTheme: z.string().optional(),
    profileData: z.object({
      totalRepos: z.number().optional(),
      totalStars: z.number().optional(),
      totalContributions: z.number().optional(),
    }).optional(),
  }).optional().default({}),
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
    const { message, context } = requestSchema.parse(body);

    // Chat with Gemini
    const response = await chatWithGemini(message, context);

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', code: 'CHAT_ERROR' },
      { status: 500 }
    );
  }
}
