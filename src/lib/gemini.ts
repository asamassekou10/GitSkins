/**
 * Gemini AI Integration Library
 *
 * Provides AI-powered features using Google's Gemini model:
 * - README generation
 * - Theme recommendations
 * - Profile personality analysis
 * - Widget customization suggestions
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { ExtendedProfileData } from '@/types/readme';

// Safety settings for content generation
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

/**
 * Lazy initialization of Gemini client to avoid build-time errors
 */
let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

function getModelName(type: 'fast' | 'pro' = 'fast'): string {
  if (type === 'pro') {
    return process.env.GEMINI_MODEL_PRO || process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  }
  return process.env.GEMINI_MODEL_FAST || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

/**
 * Get the Gemini model instance
 */
function getModel(modelName?: string) {
  const name = modelName || getModelName('fast');
  return getGenAI().getGenerativeModel({ model: name, safetySettings });
}

/**
 * Generate README using Gemini AI
 */
export async function generateReadmeWithGemini(
  profileData: ExtendedProfileData,
  config: {
    username: string;
    sections: string[];
    style: 'minimal' | 'detailed' | 'creative';
    theme: string;
    careerMode?: boolean;
    careerRole?: string;
    agentLoop?: boolean;
  }
): Promise<{ markdown: string; refinementNotes?: string[]; reasoning?: string }> {
  const model = getModel(getModelName('pro'));

  const topLanguages = profileData.languages.slice(0, 5).map((l) => l.name).join(', ');
  const pinnedReposText = profileData.pinnedRepos
    .map((r) => `- ${r.name}: ${r.description || 'No description'} (${r.stars} stars, ${r.language || 'Unknown'})`)
    .join('\n');

  let reasoning: string | undefined;
  if (config.careerMode) {
    const reasoningModel = getModel(getModelName('fast'));
    const reasoningPrompt = `You are tailoring a GitHub profile README for a ${config.careerRole || 'fullstack'} role. Profile: ${config.username}, top languages: ${topLanguages || 'unknown'}. In 1–2 short sentences, state how you will focus the README for this role (e.g. "Focusing on backend: emphasizing APIs, data pipelines, and reliability."). Be specific to the role. Reply with ONLY that reasoning, no heading.`;
    const reasoningResult = await reasoningModel.generateContent(reasoningPrompt);
    reasoning = reasoningResult.response.text().trim();
  }

  const roleContext = config.careerMode
    ? `\n**Target Role:** ${config.careerRole || 'fullstack'} (tailor narrative, highlights, and skills for this role)\n`
    : '';

  const prompt = `You are a professional GitHub profile README generator. Create an outstanding, well-structured README.md that will impress recruiters and fellow developers.${roleContext}

**Developer Profile:**
- Username: ${config.username}
- Name: ${profileData.name || config.username}
- Bio: ${profileData.bio || 'Not provided'}
- Location: ${profileData.location || 'Not specified'}
- Company: ${profileData.company || 'Not specified'}
- Website: ${profileData.websiteUrl || 'Not provided'}
- Twitter: ${profileData.twitterUsername ? `@${profileData.twitterUsername}` : 'Not provided'}
- Followers: ${profileData.followers} | Following: ${profileData.following}
- Total Repositories: ${profileData.totalRepos}
- Total Stars Earned: ${profileData.totalStars}
- Contributions This Year: ${profileData.totalContributions}
- Current Streak: ${profileData.streak.current} days
- Longest Streak: ${profileData.streak.longest} days
- Top Languages: ${topLanguages || 'None detected'}

**Pinned/Featured Repositories:**
${pinnedReposText || 'No pinned repositories'}

**Generation Settings:**
- Style: ${config.style} (${config.style === 'minimal' ? 'clean and concise' : config.style === 'creative' ? 'fun, engaging with emojis and personality' : 'professional and comprehensive'})
- Sections to include: ${config.sections.join(', ')}
- Widget theme: ${config.theme}

**IMPORTANT - Include these GitSkins widgets:**
\`\`\`markdown
<!-- Profile Card -->
![${config.username}'s GitHub Profile](https://gitskins.com/api/premium-card?username=${config.username}&theme=${config.theme})

<!-- Top Languages -->
![Top Languages](https://gitskins.com/api/languages?username=${config.username}&theme=${config.theme})

<!-- GitHub Streak -->
![GitHub Streak](https://gitskins.com/api/streak?username=${config.username}&theme=${config.theme})

<!-- GitHub Stats -->
![GitHub Stats](https://gitskins.com/api/stats?username=${config.username}&theme=${config.theme})
\`\`\`

**Instructions:**
1. Create an engaging header with the developer's name
2. Write a compelling "About Me" section based on their bio and activity
3. Showcase their tech stack with badges for their top languages
4. Include the GitSkins widgets in a visually appealing layout
5. Feature their best projects if they have pinned repos
6. Add social/contact links at the end
7. Use proper markdown formatting (headers, alignment, badges)
8. Match the requested style (${config.style})
9. End with a footer mentioning GitSkins

Output ONLY the markdown content. No explanations or code blocks around it.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let markdown = response.text();

  if (config.careerMode && config.agentLoop) {
    const critiquePrompt = `You are a senior technical recruiter and README editor. Review the README below and list up to 5 concrete improvements to better position the candidate for a ${config.careerRole || 'fullstack'} role.\n\nREADME:\n${markdown}\n\nReturn ONLY a JSON array of short improvement notes.`;
    const critiqueResult = await model.generateContent(critiquePrompt);
    const critiqueText = critiqueResult.response.text();
    const cleanedCritique = critiqueText.replace(/```json\n?|\n?```/g, '').trim();
    let refinementNotes: string[] | undefined;
    try {
      refinementNotes = JSON.parse(cleanedCritique);
    } catch {
      refinementNotes = undefined;
    }

    if (refinementNotes && refinementNotes.length > 0) {
      const refinePrompt = `You are refining a GitHub profile README. Apply these improvement notes while preserving the original structure and widgets. Improvement notes:\n- ${refinementNotes.join('\n- ')}\n\nOriginal README:\n${markdown}\n\nReturn ONLY the improved markdown.`;
      const refineResult = await model.generateContent(refinePrompt);
      markdown = refineResult.response.text();
      return { markdown, refinementNotes, reasoning };
    }
  }

  return { markdown, reasoning };
}

/**
 * Analyze a GitHub profile and provide personality insights
 */
export interface ProfileAnalysis {
  developerType: string;
  personality: string;
  strengths: string[];
  codingStyle: string;
  collaborationLevel: string;
  recommendedTheme: string;
  themeReason: string;
  careerInsight: string;
  funFact: string;
}

export async function analyzeProfileWithGemini(
  profileData: ExtendedProfileData,
  username: string
): Promise<ProfileAnalysis> {
  const model = getModel(getModelName('fast'));

  const topLanguages = profileData.languages.slice(0, 5).map((l) => `${l.name} (${l.percentage}%)`).join(', ');
  const pinnedReposText = profileData.pinnedRepos
    .map((r) => `${r.name}: ${r.description || 'No description'} (${r.stars} stars)`)
    .join('; ');

  const prompt = `Analyze this GitHub developer profile and provide insights. Be creative and insightful!

**Profile Data:**
- Username: ${username}
- Name: ${profileData.name || 'Unknown'}
- Bio: ${profileData.bio || 'None'}
- Location: ${profileData.location || 'Unknown'}
- Company: ${profileData.company || 'None'}
- Followers: ${profileData.followers}
- Following: ${profileData.following}
- Total Repos: ${profileData.totalRepos}
- Total Stars: ${profileData.totalStars}
- Contributions This Year: ${profileData.totalContributions}
- Current Streak: ${profileData.streak.current} days
- Longest Streak: ${profileData.streak.longest} days
- Top Languages: ${topLanguages}
- Pinned Repos: ${pinnedReposText || 'None'}

**Available Themes for Recommendation:**
- satan (dark red, bold)
- neon (vibrant cyberpunk)
- zen (calm, minimal)
- github-dark (classic GitHub)
- dracula (purple dark theme)
- ocean (blue, serene)
- forest (green, nature)
- sunset (warm orange/red)
- midnight (deep blue/black)
- aurora (colorful northern lights)
- retro (80s vintage)
- minimal (clean black/white)
- pastel (soft colors)
- matrix (green hacker style)
- winter/spring/summer/autumn (seasonal)
- christmas/halloween (holiday)

Respond with ONLY a JSON object (no markdown code blocks):
{
  "developerType": "Brief title like 'Full-Stack Innovator' or 'Open Source Champion'",
  "personality": "2-3 sentence personality description based on their coding habits",
  "strengths": ["strength1", "strength2", "strength3"],
  "codingStyle": "Description of their coding style based on languages and projects",
  "collaborationLevel": "High/Medium/Low with brief explanation",
  "recommendedTheme": "theme-name",
  "themeReason": "Why this theme matches their profile",
  "careerInsight": "Brief career/growth insight",
  "funFact": "A fun observation about their profile"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Clean up the response - remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch {
    // Return default analysis if parsing fails
    return {
      developerType: 'Versatile Developer',
      personality: 'A passionate coder who loves building things.',
      strengths: ['Problem solving', 'Continuous learning', 'Code quality'],
      codingStyle: 'Balanced approach with focus on maintainability',
      collaborationLevel: 'Medium - Active in the community',
      recommendedTheme: 'github-dark',
      themeReason: 'A classic choice that suits most developers',
      careerInsight: 'Keep building and sharing your work!',
      funFact: `Has ${profileData.totalRepos} repositories and counting!`,
    };
  }
}

/**
 * Get AI-powered theme recommendations
 */
export interface ThemeRecommendation {
  theme: string;
  score: number;
  reason: string;
}

export async function getThemeRecommendations(
  profileData: ExtendedProfileData,
  username: string
): Promise<ThemeRecommendation[]> {
  const model = getModel(getModelName('fast'));

  const topLanguages = profileData.languages.slice(0, 3).map((l) => l.name).join(', ');

  const prompt = `Based on this GitHub profile, recommend the top 5 widget themes that would best match their coding style and personality.

**Profile:**
- Username: ${username}
- Bio: ${profileData.bio || 'None'}
- Top Languages: ${topLanguages}
- Total Stars: ${profileData.totalStars}
- Contribution Streak: ${profileData.streak.current} days
- Total Contributions: ${profileData.totalContributions}

**Available Themes:**
1. satan - Dark red, bold, aggressive
2. neon - Vibrant cyberpunk, glowing effects
3. zen - Calm, minimal, peaceful
4. github-dark - Classic GitHub dark mode
5. dracula - Purple vampire theme
6. ocean - Blue, serene, water-inspired
7. forest - Green, nature, organic
8. sunset - Warm orange and red gradients
9. midnight - Deep blue and black
10. aurora - Colorful northern lights
11. retro - 80s vintage aesthetic
12. minimal - Clean black and white
13. pastel - Soft, gentle colors
14. matrix - Green hacker style
15. winter - Cool icy blues
16. spring - Fresh greens and pinks
17. summer - Bright warm colors
18. autumn - Warm fall colors
19. christmas - Festive red and green
20. halloween - Spooky orange and purple

Respond with ONLY a JSON array (no markdown):
[
  {"theme": "theme-name", "score": 95, "reason": "Brief reason"},
  {"theme": "theme-name", "score": 88, "reason": "Brief reason"},
  ...
]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch {
    // Return default recommendations
    return [
      { theme: 'github-dark', score: 90, reason: 'Classic and professional' },
      { theme: 'ocean', score: 85, reason: 'Clean and calming' },
      { theme: 'midnight', score: 80, reason: 'Elegant and modern' },
      { theme: 'neon', score: 75, reason: 'Bold and eye-catching' },
      { theme: 'minimal', score: 70, reason: 'Simple and effective' },
    ];
  }
}

export interface ProfileIntel {
  summary: string;
  benchmarks: Array<{ label: string; value: string; context: string }>;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export async function getProfileIntelligence(
  profileData: ExtendedProfileData,
  username: string
): Promise<ProfileIntel> {
  const model = getModel(getModelName('fast'));
  const topLanguages = profileData.languages.slice(0, 4).map((l) => l.name).join(', ');
  const prompt = `You are a career coach analyzing a GitHub profile. Produce a concise intelligence report.

Profile:
- Username: ${username}
- Bio: ${profileData.bio || 'None'}
- Followers: ${profileData.followers}
- Total Repos: ${profileData.totalRepos}
- Total Stars: ${profileData.totalStars}
- Contributions This Year: ${profileData.totalContributions}
- Current Streak: ${profileData.streak.current} days
- Top Languages: ${topLanguages || 'None'}

Return ONLY JSON:
{
  "summary": "2-3 sentence summary",
  "benchmarks": [
    {"label": "Activity level", "value": "Top 20%", "context": "Compared to active OSS devs"}
  ],
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2"],
  "recommendations": ["action1", "action2", "action3"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      summary: 'A consistent contributor with growing momentum and solid project breadth.',
      benchmarks: [
        { label: 'Activity level', value: 'High', context: 'Regular recent contributions' },
        { label: 'Project breadth', value: 'Moderate', context: 'Balanced repo variety' },
      ],
      strengths: ['Consistent commits', 'Clear focus areas', 'Healthy repo mix'],
      gaps: ['Add more impact metrics', 'Highlight deployment/demo links'],
      recommendations: [
        'Pin your most impactful repos with demos',
        'Add project impact metrics to READMEs',
        'Showcase one flagship project with a case study',
      ],
    };
  }
}

export interface PortfolioCaseStudy {
  title: string;
  repo: string;
  problem: string;
  approach: string;
  impact: string;
  stack: string[];
  highlights: string[];
  repoUrl?: string;
}

export async function buildPortfolioCaseStudies(
  profileData: ExtendedProfileData,
  username: string
): Promise<PortfolioCaseStudy[]> {
  const model = getModel(getModelName('pro'));
  const repoList = profileData.pinnedRepos;
  const repoSummaries = repoList
    .map((repo) => `${repo.name}: ${repo.description || 'No description'} (${repo.stars} stars, ${repo.language || 'Unknown'})`)
    .join('\n');
  const prompt = `Create 2-3 portfolio case studies from these repositories.

Repos:
${repoSummaries}

Return ONLY JSON array:
[
  {
    "title": "Case study title",
    "repo": "repo-name",
    "problem": "What problem it solved",
    "approach": "How it was built",
    "impact": "Outcome or measurable impact",
    "stack": ["Tech1", "Tech2"],
    "highlights": ["Highlight 1", "Highlight 2"],
    "repoUrl": "https://github.com/${username}/repo-name"
  }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    if (repoList.length === 0) {
      return [
        {
          title: 'Flagship Project Case Study',
          repo: 'Your top repository',
          problem: 'Summarize the core problem this project solves.',
          approach: 'Describe the architecture, tools, and decisions made.',
          impact: 'Quantify results, usage, or user outcomes.',
          stack: ['TypeScript', 'Next.js'],
          highlights: ['Clear scope', 'User-facing impact'],
        },
      ];
    }
    return repoList.slice(0, 2).map((repo) => ({
      title: `${repo.name} Case Study`,
      repo: repo.name,
      problem: repo.description || 'A project that solves a real developer pain point.',
      approach: 'Built with a focus on reliability, usability, and clarity.',
      impact: `${repo.stars} stars and growing adoption.`,
      stack: [repo.language || 'TypeScript'],
      highlights: ['Clear architecture', 'User-focused experience'],
      repoUrl: repo.url,
    }));
  }
}

/**
 * Generate a full portfolio website (HTML + CSS) from profile and case studies.
 * Returns a single-page, self-contained portfolio; CSS can be embedded in HTML or separate.
 */
export async function generatePortfolioWebsite(
  profileData: ExtendedProfileData,
  username: string,
  caseStudies: PortfolioCaseStudy[]
): Promise<{ html: string; css: string }> {
  const model = getModel(getModelName('pro'));
  const caseStudiesJson = JSON.stringify(caseStudies, null, 2);
  const topLangs = profileData.languages.slice(0, 5).map((l) => l.name).join(', ');

  const prompt = `You are a professional web designer. Generate a single-page portfolio website for a developer.

**Profile:**
- Username: ${username}
- Name: ${profileData.name || username}
- Bio: ${profileData.bio || 'Not provided'}
- Avatar URL: ${profileData.avatarUrl}
- Followers: ${profileData.followers} | Repos: ${profileData.totalRepos} | Stars: ${profileData.totalStars}
- Top languages: ${topLangs}

**Case studies (use this exact data):**
${caseStudiesJson}

**Requirements:**
1. Output TWO code blocks only. First block: \`\`\`html\\n...\\n\`\`\` (full HTML from <!DOCTYPE> to </html>, semantic: header, hero, section per case study, optional contact/footer). Second block: \`\`\`css\\n...\\n\`\`\` (all styles). No other text.
2. Single page, responsive, no external CDN or fonts (use system fonts). Green (#22c55e) and black/dark theme to match GitSkins.
3. Include the avatar, name, bio, and each case study with title, repo, problem, approach, impact, stack, highlights. Link repo names to repoUrl when present.
4. Professional, minimal, developer portfolio style. No placeholder lorem.

Return ONLY the two code blocks (html then css).`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const htmlMatch = text.match(/```html\s*([\s\S]*?)```/);
  const cssMatch = text.match(/```css\s*([\s\S]*?)```/);
  let html = htmlMatch ? htmlMatch[1].trim() : '';
  let css = cssMatch ? cssMatch[1].trim() : '';

  if (!html) {
    html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${username} - Portfolio</title></head><body><h1>${username}</h1><p>Portfolio</p></body></html>`;
  }
  if (!css) {
    css = 'body { font-family: system-ui; background: #050505; color: #fafafa; margin: 0; padding: 20px; }';
  }

  return { html, css };
}

/**
 * Edit portfolio website via natural language. Returns updated html and css.
 */
export async function editPortfolioWebsite(
  html: string,
  css: string,
  userMessage: string
): Promise<{ html: string; css: string }> {
  const model = getModel(getModelName('pro'));
  const truncatedHtml = html.length > 12000 ? html.slice(0, 12000) + '\n<!-- ... truncated -->' : html;
  const truncatedCss = css.length > 8000 ? css.slice(0, 8000) + '\n/* ... truncated */' : css;

  const prompt = `You are a web designer. The user wants to change their portfolio page.

**Current HTML (excerpt):**
\`\`\`html
${truncatedHtml}
\`\`\`

**Current CSS (excerpt):**
\`\`\`css
${truncatedCss}
\`\`\`

**User request:** ${userMessage}

**Instructions:**
1. Apply the requested change. Return the FULL updated HTML and FULL updated CSS.
2. Output ONLY two code blocks. First: \`\`\`html\\n...\\n\`\`\` (complete HTML). Second: \`\`\`css\\n...\\n\`\`\` (complete CSS). No other text.
3. Keep the same structure and green/black theme unless the user asks to change it.
4. If HTML or CSS was truncated above, extend from what you see and keep the rest consistent.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const htmlMatch = text.match(/```html\s*([\s\S]*?)```/);
  const cssMatch = text.match(/```css\s*([\s\S]*?)```/);
  const outHtml = htmlMatch ? htmlMatch[1].trim() : html;
  const outCss = cssMatch ? cssMatch[1].trim() : css;

  return { html: outHtml, css: outCss };
}

/**
 * AI Chat for widget customization assistance
 */
export async function chatWithGemini(
  message: string,
  context: {
    username?: string;
    currentTheme?: string;
    profileData?: Partial<ExtendedProfileData>;
  }
): Promise<string> {
  const model = getModel(getModelName('fast'));

  const systemContext = `You are GitSkins AI Assistant, helping developers customize their GitHub profile widgets.

**GitSkins Features:**
- 20+ premium themes for profile cards
- GitHub stats widgets (contributions, stars, repos)
- Top languages visualization
- Contribution streak tracker
- AI-powered README generator
- One-click embed codes for GitHub READMEs

**Available Themes:** satan, neon, zen, github-dark, dracula, ocean, forest, sunset, midnight, aurora, retro, minimal, pastel, matrix, winter, spring, summer, autumn, christmas, halloween

${context.username ? `**Current User:** ${context.username}` : ''}
${context.currentTheme ? `**Current Theme:** ${context.currentTheme}` : ''}
${context.profileData ? `**User Stats:** ${context.profileData.totalRepos || 0} repos, ${context.profileData.totalStars || 0} stars` : ''}

Be helpful, friendly, and concise. Suggest themes, explain features, and help users get the most out of GitSkins.`;

  // Use startChat for multi-turn conversation
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemContext }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand! I\'m GitSkins AI Assistant, ready to help with profile customization, theme recommendations, and widget setup. How can I help you today?' }],
      },
    ],
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}

/**
 * Generate widget embed suggestions
 */
export async function generateWidgetSuggestions(
  profileData: ExtendedProfileData,
  username: string
): Promise<{
  layout: string;
  widgets: Array<{
    type: string;
    url: string;
    description: string;
  }>;
  embedCode: string;
}> {
  const model = getModel(getModelName('fast'));

  const prompt = `Create an optimal widget layout suggestion for this GitHub profile.

**Profile:**
- Username: ${username}
- Total Repos: ${profileData.totalRepos}
- Total Stars: ${profileData.totalStars}
- Contributions: ${profileData.totalContributions}
- Current Streak: ${profileData.streak.current} days
- Top Languages: ${profileData.languages.slice(0, 3).map((l) => l.name).join(', ')}

Suggest which GitSkins widgets would best showcase this profile and in what order.

**Available Widgets:**
1. premium-card - Full profile card with avatar, stats
2. stats - GitHub statistics (contributions, stars, etc.)
3. languages - Top programming languages chart
4. streak - Contribution streak tracker

Respond with ONLY a JSON object (no markdown):
{
  "layout": "Brief description of suggested layout",
  "widgets": [
    {"type": "widget-type", "url": "https://gitskins.com/api/widget?username=${username}&theme=github-dark", "description": "Why this widget"}
  ],
  "embedCode": "Complete markdown code block for the suggested layout"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch {
    return {
      layout: 'Standard layout with profile card, stats, and languages',
      widgets: [
        {
          type: 'premium-card',
          url: `https://gitskins.com/api/premium-card?username=${username}&theme=github-dark`,
          description: 'Main profile overview',
        },
        {
          type: 'languages',
          url: `https://gitskins.com/api/languages?username=${username}&theme=github-dark`,
          description: 'Showcase your tech stack',
        },
        {
          type: 'streak',
          url: `https://gitskins.com/api/streak?username=${username}&theme=github-dark`,
          description: 'Show your commitment',
        },
      ],
      embedCode: `![Profile](https://gitskins.com/api/premium-card?username=${username}&theme=github-dark)\n![Languages](https://gitskins.com/api/languages?username=${username}&theme=github-dark)\n![Streak](https://gitskins.com/api/streak?username=${username}&theme=github-dark)`,
    };
  }
}

/**
 * Explain a GitHub profile in 2–3 sentences (summary only).
 */
export async function explainProfileWithGemini(
  profileData: ExtendedProfileData,
  username: string
): Promise<string> {
  const model = getModel(getModelName('fast'));
  const topLanguages = profileData.languages.slice(0, 5).map((l) => l.name).join(', ');
  const pinnedReposText = profileData.pinnedRepos
    .map((r) => `- ${r.name}: ${r.description || 'No description'} (${r.stars} stars)`)
    .join('\n');

  const prompt = `Summarize this GitHub profile in 2–3 short sentences for a recruiter or visitor. Focus on: type of developer, main tech/languages, and standout traits (e.g. open-source presence, consistency, focus areas). Be concise and factual.

**Profile:**
- Username: ${username}
- Name: ${profileData.name || username}
- Bio: ${profileData.bio || 'None'}
- Location: ${profileData.location || 'Not specified'}
- Company: ${profileData.company || 'Not specified'}
- Followers: ${profileData.followers} | Following: ${profileData.following}
- Total Repos: ${profileData.totalRepos} | Total Stars: ${profileData.totalStars}
- Contributions This Year: ${profileData.totalContributions}
- Current Streak: ${profileData.streak.current} days
- Top Languages: ${topLanguages || 'None'}

**Pinned Repos:**
${pinnedReposText || 'None'}

Reply with ONLY the 2–3 sentence summary, no heading or bullet points.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Get safe Gemini status for client-side display
 */
export function getGeminiStatus(): { configured: boolean; model: string } {
  return {
    configured: !!process.env.GEMINI_API_KEY,
    model: getModelName('fast'),
  };
}
