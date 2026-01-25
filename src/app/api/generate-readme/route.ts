/**
 * README Generator API Route
 *
 * POST /api/generate-readme
 * Generates a professional GitHub profile README using AI or templates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchProfileForReadme } from '@/lib/github';
import {
  generateReadmeTemplate,
  buildReadmePrompt,
  parseGeneratedReadme,
} from '@/lib/readme-generator';
import type { ReadmeConfig, ReadmeSectionType, ReadmeStyle } from '@/types/readme';

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
  useAI: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    const { username, sections, style, theme, useAI } = validatedData;

    // Fetch GitHub profile data
    const profileData = await fetchProfileForReadme(username);

    if (!profileData) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const config: ReadmeConfig = {
      username,
      sections: sections as ReadmeSectionType[],
      style: style as ReadmeStyle,
      theme,
      includeGitSkins: true,
    };

    let result;

    // Try AI generation if enabled and API key is available
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        const prompt = buildReadmePrompt(profileData, config);

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: 'You are a professional README generator. Output only valid markdown, no explanations.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 2500,
            temperature: 0.7,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const generatedMarkdown = aiData.choices?.[0]?.message?.content;

          if (generatedMarkdown) {
            result = parseGeneratedReadme(generatedMarkdown, config);
            result.metadata = {
              ...result.metadata,
              username,
              languages: profileData.languages.map((l) => l.name),
              repoCount: profileData.totalRepos,
              totalStars: profileData.totalStars,
            };
          }
        }
      } catch (aiError) {
        console.error('AI generation failed, falling back to template:', aiError);
      }
    }

    // Fallback to template-based generation
    if (!result) {
      result = generateReadmeTemplate(profileData, config);
    }

    return NextResponse.json({
      success: true,
      readme: result.markdown,
      sections: result.sections,
      metadata: result.metadata,
      profile: {
        name: profileData.name,
        avatarUrl: profileData.avatarUrl,
        bio: profileData.bio,
        followers: profileData.followers,
        totalStars: profileData.totalStars,
        totalRepos: profileData.totalRepos,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      );
    }

    console.error('README generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate README', code: 'GENERATION_ERROR' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
