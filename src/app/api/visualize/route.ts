/**
 * Repo Architecture Visualizer API Route — Streaming SSE endpoint
 *
 * POST /api/visualize
 * Streams AI architecture analysis with Gemini 3 Extended Thinking.
 * Returns SSE events: { type: 'thought' | 'text' | 'status', content: string }
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { fetchRepoTree } from '@/lib/github';
import { streamRepoArchitecture, isGeminiConfigured } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  owner: z.string().min(1).max(39),
  repo: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { owner, repo } = requestSchema.parse(body);

    if (!isGeminiConfigured()) {
      return new Response(
        JSON.stringify({ error: 'AI not configured', code: 'AI_NOT_CONFIGURED' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const treeData = await fetchRepoTree(owner, repo);
    if (!treeData) {
      return new Response(
        JSON.stringify({ error: 'Repository not found', code: 'REPO_NOT_FOUND' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'status', content: `Fetched ${treeData.totalFiles} files from ${owner}/${repo}. Analyzing architecture...` })}\n\n`)
          );

          const generator = streamRepoArchitecture(treeData);

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
      JSON.stringify({ error: 'Failed to start analysis', code: 'GENERATION_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
