/**
 * Live README Agent API Route — Streaming SSE endpoint
 *
 * POST /api/readme-agent
 * Streams README generation with Gemini 3 Extended Thinking.
 * Returns SSE events: { type: 'thought' | 'text' | 'status', content: string }
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { fetchProfileForReadme } from '@/lib/github';
import { streamReadmeWithGemini, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  username: z.string().min(1).max(39),
  sections: z
    .array(z.enum(['header', 'about', 'skills', 'stats', 'languages', 'projects', 'streak', 'connect']))
    .optional()
    .default(['header', 'about', 'skills', 'stats', 'projects', 'connect']),
  style: z.enum(['minimal', 'detailed', 'creative']).optional().default('detailed'),
  theme: z.string().optional().default('satan'),
  careerMode: z.boolean().optional().default(false),
  careerRole: z.string().optional().default('fullstack'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    const { username, sections, style, theme, careerMode, careerRole } = validatedData;

    if (!isGeminiConfigured()) {
      return new Response(
        JSON.stringify({ error: 'AI not configured', code: 'AI_NOT_CONFIGURED' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch profile data
    const profileData = await fetchProfileForReadme(username);
    if (!profileData) {
      return new Response(
        JSON.stringify({ error: 'User not found', code: 'USER_NOT_FOUND' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send profile fetched status
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'status', content: 'Profile fetched. Starting generation...' })}\n\n`)
          );

          const generator = streamReadmeWithGemini(profileData, {
            username,
            sections,
            style: style as 'minimal' | 'detailed' | 'creative',
            theme,
            careerMode,
            careerRole,
          });

          for await (const chunk of generator) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'status', content: `Error: ${errorMsg}` })}\n\n`)
          );
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ error: 'Failed to start generation', code: 'GENERATION_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
