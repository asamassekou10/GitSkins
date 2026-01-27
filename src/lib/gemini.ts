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

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const GEMINI_MODEL_FAST = process.env.GEMINI_MODEL_FAST || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_MODEL_PRO = process.env.GEMINI_MODEL_PRO || process.env.GEMINI_MODEL || 'gemini-1.5-pro';

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
 * Get the Gemini model instance
 */
function getModel(modelName: string = GEMINI_MODEL_FAST) {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }
  return genAI.getGenerativeModel({ model: modelName, safetySettings });
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
  }
): Promise<string> {
  const model = getModel(GEMINI_MODEL_PRO);

  const topLanguages = profileData.languages.slice(0, 5).map((l) => l.name).join(', ');
  const pinnedReposText = profileData.pinnedRepos
    .map((r) => `- ${r.name}: ${r.description || 'No description'} (${r.stars} stars, ${r.language || 'Unknown'})`)
    .join('\n');

  const prompt = `You are a professional GitHub profile README generator. Create an outstanding, well-structured README.md that will impress recruiters and fellow developers.

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
  return response.text();
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
  const model = getModel(GEMINI_MODEL_FAST);

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
  const model = getModel(GEMINI_MODEL_FAST);

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
  const model = getModel(GEMINI_MODEL_FAST);

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
  const model = getModel(GEMINI_MODEL_FAST);

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
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
