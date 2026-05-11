/**
 * README Generator API Route
 *
 * POST /api/generate-readme
 * Generates a professional GitHub profile README using Gemini AI or templates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { fetchProfileForReadme } from '@/lib/github';
import {
  generateReadmeTemplate,
  parseGeneratedReadme,
  buildReadmeStrategy,
  scoreReadme,
  applyReadmeAnimationPack,
} from '@/lib/readme-generator';
import { generateReadmeWithGemini, isGeminiConfigured } from '@/lib/gemini';
import { checkReadmeAllowed, checkReadmeAllowedById, incrementReadmeUsage, incrementReadmeUsageById } from '@/lib/server-usage';
import type { ReadmeConfig, ReadmeSectionType, ReadmeStyle } from '@/types/readme';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const inFlightReadmeGenerations = new Map<string, number>();
const IN_FLIGHT_TTL_MS = 90_000;

function reserveGenerationSlot(userId: string): boolean {
  const now = Date.now();
  for (const [key, startedAt] of inFlightReadmeGenerations.entries()) {
    if (now - startedAt > IN_FLIGHT_TTL_MS) {
      inFlightReadmeGenerations.delete(key);
    }
  }

  if (inFlightReadmeGenerations.has(userId)) {
    return false;
  }

  inFlightReadmeGenerations.set(userId, now);
  return true;
}

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
  agentLoop: z.boolean().optional().default(false),
  useAI: z.boolean().optional().default(true),
  goal: z.enum(['get-hired', 'open-source', 'freelance', 'indie-hacker', 'student', 'founder', 'personal-brand']).optional().default('personal-brand'),
  structure: z.enum(['portfolio', 'hiring', 'open-source', 'founder', 'minimal', 'visual', 'technical']).optional().default('visual'),
  tone: z.enum(['concise', 'confident', 'friendly', 'senior', 'founder', 'playful', 'recruiter']).optional().default('confident'),
  motionStyle: z.enum(['none', 'subtle', 'animated', 'playful']).optional().default('none'),
  typingHeadline: z.boolean().optional().default(false),
  typingLines: z.array(z.string().min(1).max(90)).max(4).optional().default([]),
  animatedDivider: z.boolean().optional().default(false),
  contributionSnake: z.boolean().optional().default(false),
  skillBadges: z.boolean().optional().default(true),
  visitorCounter: z.boolean().optional().default(false),
  githubTrophies: z.boolean().optional().default(false),
  avatarBlock: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const sessionUser = session.user as { id?: string; username?: string };
    if (!sessionUser.id && !sessionUser.username) {
      return NextResponse.json(
        { error: 'No user identifier in session', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const inFlightKey = sessionUser.id ?? sessionUser.username!;
    if (!reserveGenerationSlot(inFlightKey)) {
      return NextResponse.json(
        {
          error: 'A README generation is already running. Wait for it to finish before retrying.',
          code: 'GENERATION_IN_PROGRESS',
        },
        { status: 409 }
      );
    }

    try {
      const usageCheckBefore = sessionUser.id
        ? await checkReadmeAllowedById(sessionUser.id)
        : await checkReadmeAllowed(sessionUser.username!);
      if (!usageCheckBefore.allowed) {
        return NextResponse.json(
          {
            error: usageCheckBefore.plan === 'pro'
              ? 'Daily README generation limit reached.'
              : 'You have used your free README generations for this month.',
            code: 'LIMIT_REACHED',
            remaining: 0,
            limit: usageCheckBefore.limit,
            plan: usageCheckBefore.plan,
            period: usageCheckBefore.period,
          },
          { status: 429 }
        );
      }

      const body = await request.json();
      const validatedData = requestSchema.parse(body);

      const {
        username,
        sections,
        style,
        theme,
        careerMode,
        careerRole,
        agentLoop,
        useAI,
        goal,
        structure,
        tone,
        motionStyle,
        typingHeadline,
        typingLines,
        animatedDivider,
        contributionSnake,
        skillBadges,
        visitorCounter,
        githubTrophies,
        avatarBlock,
      } = validatedData;

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
      goal,
      structure,
      tone,
      motionStyle,
      typingHeadline,
      typingLines,
      animatedDivider,
      contributionSnake,
      skillBadges,
      visitorCounter,
      githubTrophies,
      avatarBlock,
    };

    let result;
    let aiProvider: 'gemini' | 'gemini_refined' | 'openai' | 'template' = 'template';
    let refinementNotes: string[] | undefined;
    let reasoning: string | undefined;

    // Try Gemini AI generation first (primary provider)
    if (useAI && isGeminiConfigured()) {
      try {
        const geminiResult = await generateReadmeWithGemini(profileData, {
          username,
          sections,
          style: style as 'minimal' | 'detailed' | 'creative',
          theme,
          careerMode,
          careerRole,
          agentLoop,
          goal,
          structure,
          tone,
          motionStyle,
          typingHeadline,
          typingLines,
          animatedDivider,
          contributionSnake,
          skillBadges,
          visitorCounter,
          githubTrophies,
          avatarBlock,
        });

        if (geminiResult?.markdown) {
          result = parseGeneratedReadme(geminiResult.markdown, config);
          result.metadata = {
            ...result.metadata,
            username,
            languages: profileData.languages.map((l) => l.name),
            repoCount: profileData.totalRepos,
            totalStars: profileData.totalStars,
          };
          aiProvider = geminiResult.refinementNotes ? 'gemini_refined' : 'gemini';
          refinementNotes = geminiResult.refinementNotes ?? undefined;
          reasoning = geminiResult.reasoning ?? undefined;
        }
      } catch (geminiError) {
        console.error('Gemini generation failed:', geminiError);
      }
    }

    // Fallback to OpenAI if Gemini fails
    if (!result && useAI && process.env.OPENAI_API_KEY) {
      try {
        const { buildReadmePrompt } = await import('@/lib/readme-generator');
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
            aiProvider = 'openai';
          }
        }
      } catch (aiError) {
        console.error('OpenAI generation failed, falling back to template:', aiError);
      }
    }

    // Fallback to template-based generation
    if (!result) {
      result = generateReadmeTemplate(profileData, config);
    }

    const animationPack = applyReadmeAnimationPack(result.markdown, profileData, config);
    result.markdown = animationPack.markdown;

    const strategy = buildReadmeStrategy(profileData, config);
    const score = scoreReadme(result.markdown, profileData, config);
    result.metadata = {
      ...result.metadata,
      strategy,
      score,
    };

    let usageCheckAfter = usageCheckBefore;
    if (sessionUser.id) {
      const usageIncrement = await incrementReadmeUsageById(sessionUser.id);
      if (usageCheckBefore.plan !== 'pro' && !usageIncrement) {
        return NextResponse.json(
          {
            error: 'Usage tracking is temporarily unavailable. Please retry in a moment.',
            code: 'USAGE_UPDATE_FAILED',
          },
          { status: 503 }
        );
      }
      usageCheckAfter = await checkReadmeAllowedById(sessionUser.id);
      await db.readmeGeneration.create({
        data: {
          userId: sessionUser.id,
          username,
          title: `${username} README`,
          goal,
          structure,
          tone,
          style,
          theme,
          score: score.overall,
          markdown: result.markdown,
        },
      }).catch((err) => console.error('[readme] save generation failed:', err));
    } else {
      await incrementReadmeUsage(sessionUser.username!);
      usageCheckAfter = await checkReadmeAllowed(sessionUser.username!);
    }

      return NextResponse.json({
        success: true,
        readme: result.markdown,
        sections: result.sections,
        metadata: result.metadata,
        aiProvider,
        refinementNotes,
        reasoning,
        strategy,
        score,
        animationBlocks: animationPack.blocks,
        setupInstructions: animationPack.setupInstructions,
        profile: {
          name: profileData.name,
          avatarUrl: profileData.avatarUrl,
          bio: profileData.bio,
          followers: profileData.followers,
          totalStars: profileData.totalStars,
          totalRepos: profileData.totalRepos,
        },
        usage: {
          remaining: usageCheckAfter.remaining,
          limit: usageCheckAfter.limit,
          plan: usageCheckAfter.plan,
          creditsRemaining: usageCheckAfter.creditsRemaining,
        },
      });
    } finally {
      inFlightReadmeGenerations.delete(inFlightKey);
    }
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
