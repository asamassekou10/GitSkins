/**
 * README Generator Library
 *
 * Generates professional GitHub profile READMEs using AI or templates.
 */

import type {
  ReadmeConfig,
  ReadmeStyle,
  ReadmeSectionType,
  GeneratedReadme,
  ExtendedProfileData,
  ReadmeGoal,
  ReadmeStructure,
  ReadmeTone,
  ReadmeStrategy,
  ReadmeScore,
} from '@/types/readme';

/**
 * Language badges mapping
 */
const languageBadges: Record<string, string> = {
  TypeScript: 'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white',
  JavaScript: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
  Python: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white',
  Java: 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white',
  Go: 'https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white',
  Rust: 'https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white',
  'C++': 'https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white',
  C: 'https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=black',
  'C#': 'https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white',
  PHP: 'https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white',
  Ruby: 'https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white',
  Swift: 'https://img.shields.io/badge/Swift-FA7343?style=for-the-badge&logo=swift&logoColor=white',
  Kotlin: 'https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white',
  Dart: 'https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white',
  HTML: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white',
  CSS: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white',
  Shell: 'https://img.shields.io/badge/Shell-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white',
  Vue: 'https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white',
  React: 'https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black',
  Svelte: 'https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white',
};

const goalLabels: Record<ReadmeGoal, string> = {
  'get-hired': 'get hired or attract recruiters',
  'open-source': 'grow open-source trust and contributor confidence',
  freelance: 'win freelance or consulting opportunities',
  'indie-hacker': 'show builder momentum and product taste',
  student: 'show learning velocity and project potential',
  founder: 'present as a technical founder',
  'personal-brand': 'build a memorable developer brand',
};

const structureLabels: Record<ReadmeStructure, string> = {
  portfolio: 'portfolio README with featured proof and clear CTAs',
  hiring: 'hiring README optimized for recruiter scanning',
  'open-source': 'open-source maintainer README with contribution clarity',
  founder: 'founder README emphasizing products, traction, and direction',
  minimal: 'minimal badge-light README',
  visual: 'visual GitSkins README with profile card and widgets',
  technical: 'technical deep-dive README emphasizing systems and stack',
};

const toneLabels: Record<ReadmeTone, string> = {
  concise: 'concise and direct',
  confident: 'confident without hype',
  friendly: 'friendly and approachable',
  senior: 'senior engineer with judgment and ownership',
  founder: 'founder-style, outcome-focused, product-minded',
  playful: 'playful but still professional',
  recruiter: 'recruiter-focused and easy to scan',
};

export function buildReadmeStrategy(data: ExtendedProfileData, config: ReadmeConfig): ReadmeStrategy {
  const languages = data.languages.slice(0, 3).map((l) => l.name);
  const primaryRole = inferPrimaryRole(languages, config);
  const strongestSignals = [
    ...languages.map((language) => `${language} work`),
    data.totalStars > 0 ? `${data.totalStars} earned stars` : '',
    data.totalRepos > 0 ? `${data.totalRepos} public repositories` : '',
    data.streak.current > 0 ? `${data.streak.current}-day current streak` : '',
  ].filter(Boolean).slice(0, 4);
  const weakSignals = [
    data.pinnedRepos.length === 0 ? 'No pinned repositories detected' : '',
    !data.bio ? 'Bio is missing or too thin' : '',
    !data.websiteUrl ? 'No portfolio or website link detected' : '',
    data.totalStars === 0 ? 'Limited external project proof from stars' : '',
  ].filter(Boolean).slice(0, 4);

  return {
    primaryRole,
    strongestSignals: strongestSignals.length ? strongestSignals : ['Consistent GitHub presence'],
    weakSignals: weakSignals.length ? weakSignals : ['Keep the README concise and proof-driven'],
    suggestedTone: toneLabels[config.tone ?? 'confident'],
    profileGoal: goalLabels[config.goal ?? 'personal-brand'],
  };
}

export function scoreReadme(markdown: string, data: ExtendedProfileData, config: ReadmeConfig): ReadmeScore {
  const hasProfileCard = markdown.includes('/api/premium-card');
  const hasProjects = /## .*project|## .*work|### \[/.test(markdown.toLowerCase());
  const hasContact = /connect|contact|twitter|website|linkedin|github\.com/.test(markdown.toLowerCase());
  const length = markdown.length;
  const profileClarity = clampScore(55 + (data.bio ? 15 : 0) + (markdown.startsWith('#') || markdown.includes('<h1') ? 15 : 0) + (config.goal ? 10 : 0));
  const projectProof = clampScore(45 + Math.min(25, data.pinnedRepos.length * 6) + (hasProjects ? 20 : 0) + (data.totalStars > 0 ? 10 : 0));
  const visualConsistency = clampScore(55 + (hasProfileCard ? 25 : 0) + (markdown.includes(`theme=${config.theme}`) ? 15 : 0));
  const recruiterScanability = clampScore(45 + (hasContact ? 15 : 0) + (length < 5000 ? 20 : 5) + (markdown.split('\n## ').length >= 4 ? 15 : 0));
  const overall = Math.round((profileClarity + projectProof + visualConsistency + recruiterScanability) / 4);

  const suggestions = [
    !data.bio ? 'Add a clearer GitHub bio so the README can open with a sharper positioning line.' : '',
    data.pinnedRepos.length < 3 ? 'Pin or feature at least three strong repositories for better project proof.' : '',
    !hasContact ? 'Add a clear contact or portfolio link so visitors know what to do next.' : '',
    !hasProfileCard ? 'Include a GitSkins profile card near the top for a stronger visual first impression.' : '',
    length > 6500 ? 'Shorten the README so the strongest projects remain above the fold.' : '',
  ].filter(Boolean).slice(0, 3);

  return {
    overall,
    profileClarity,
    projectProof,
    visualConsistency,
    recruiterScanability,
    suggestions: suggestions.length ? suggestions : ['Strong structure. Keep project descriptions specific and outcome-focused.'],
  };
}

function inferPrimaryRole(languages: string[], config: ReadmeConfig): string {
  if (config.goal === 'founder') return 'Technical founder';
  if (config.goal === 'freelance') return 'Freelance developer or consultant';
  if (config.goal === 'open-source') return 'Open-source maintainer';
  const normalized = languages.map((l) => l.toLowerCase());
  if (normalized.some((l) => ['typescript', 'javascript', 'html', 'css', 'vue', 'svelte'].includes(l))) return 'Frontend or full-stack engineer';
  if (normalized.some((l) => ['go', 'rust', 'java', 'c#', 'python'].includes(l))) return 'Backend or systems engineer';
  return 'Product-minded developer';
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Build AI prompt for README generation
 */
export function buildReadmePrompt(
  data: ExtendedProfileData,
  config: ReadmeConfig
): string {
  const sectionsToInclude = config.sections.join(', ');
  const topLanguages = data.languages.slice(0, 5).map(l => l.name).join(', ');
  const strategy = buildReadmeStrategy(data, config);

  const pinnedReposText = data.pinnedRepos
    .map(r => `- ${r.name}: ${r.description || 'No description'} (${r.stars} stars)`)
    .join('\n');

  return `You are a professional README generator for GitHub profiles. Create a clean, modern README.md.

**Developer Profile:**
- Name: ${data.name || config.username}
- Bio: ${data.bio || 'Not provided'}
- Location: ${data.location || 'Not specified'}
- Company: ${data.company || 'Not specified'}
- Website: ${data.websiteUrl || 'Not provided'}
- Twitter: ${data.twitterUsername ? `@${data.twitterUsername}` : 'Not provided'}
- Followers: ${data.followers} | Following: ${data.following}
- Total Repositories: ${data.totalRepos}
- Total Stars: ${data.totalStars}
- Contributions This Year: ${data.totalContributions}
- Current Streak: ${data.streak.current} days
- Longest Streak: ${data.streak.longest} days
- Top Languages: ${topLanguages || 'None detected'}

**Pinned/Featured Repositories:**
${pinnedReposText || 'No pinned repositories'}

**Generation Settings:**
- Style: ${config.style}
- Goal: ${goalLabels[config.goal ?? 'personal-brand']}
- Structure: ${structureLabels[config.structure ?? 'visual']}
- Tone: ${toneLabels[config.tone ?? 'confident']}
- Sections to include: ${sectionsToInclude}
- Theme for GitSkins widgets: ${config.theme}

**Profile Strategy:**
- Primary role: ${strategy.primaryRole}
- Strongest signals: ${strategy.strongestSignals.join(', ')}
- Weak signals to compensate for: ${strategy.weakSignals.join(', ')}
- Profile goal: ${strategy.profileGoal}

**Instructions:**
1. Generate a professional, well-structured README.md
2. Use proper markdown formatting with headers, lists, and sections
3. For the stats section, include these GitSkins widget URLs:
   - Profile Card: ![GitHub Stats](https://gitskins.com/api/premium-card?username=${config.username}&theme=${config.theme})
   - Languages: ![Top Languages](https://gitskins.com/api/languages?username=${config.username}&theme=${config.theme})
   - Streak: ![Streak Stats](https://gitskins.com/api/streak?username=${config.username}&theme=${config.theme})
4. Keep the tone ${toneLabels[config.tone ?? 'confident']}
5. ${config.structure === 'minimal' || config.style === 'minimal' ? 'Keep content brief and focused' : 'Include specific project proof and clear descriptions'}
6. Use badges for technologies/languages when appropriate
7. Include a proper header with the developer's name
8. End with social links/contact info if available
9. Do not invent employers, degrees, metrics, links, or project claims that are not supported by the profile data

Generate ONLY the markdown content, no explanations.`;
}

/**
 * Generate README using template (fallback when AI is unavailable)
 */
export function generateReadmeTemplate(
  data: ExtendedProfileData,
  config: ReadmeConfig
): GeneratedReadme {
  const sections: GeneratedReadme['sections'] = [];
  let markdown = '';

  const displayName = data.name || config.username;

  // Header Section
  if (config.sections.includes('header')) {
    const headerContent = generateHeaderSection(displayName, data, config.style);
    sections.push({ id: 'header', type: 'header', content: headerContent });
    markdown += headerContent + '\n\n';
  }

  // About Section
  if (config.sections.includes('about')) {
    const aboutContent = generateAboutSection(data, config.style);
    sections.push({ id: 'about', type: 'about', content: aboutContent });
    markdown += aboutContent + '\n\n';
  }

  // Skills/Languages Section
  if (config.sections.includes('skills') || config.sections.includes('languages')) {
    const skillsContent = generateSkillsSection(data, config.style);
    sections.push({ id: 'skills', type: 'skills', content: skillsContent });
    markdown += skillsContent + '\n\n';
  }

  // Stats Section
  if (config.sections.includes('stats')) {
    const statsContent = generateStatsSection(config.username, config.theme, config.style);
    sections.push({ id: 'stats', type: 'stats', content: statsContent });
    markdown += statsContent + '\n\n';
  }

  // Streak Section
  if (config.sections.includes('streak')) {
    const streakContent = generateStreakSection(config.username, config.theme, data.streak);
    sections.push({ id: 'streak', type: 'streak', content: streakContent });
    markdown += streakContent + '\n\n';
  }

  // Projects Section
  if (config.sections.includes('projects')) {
    const projectsContent = generateProjectsSection(data.pinnedRepos, config.style);
    sections.push({ id: 'projects', type: 'projects', content: projectsContent });
    markdown += projectsContent + '\n\n';
  }

  // Connect Section
  if (config.sections.includes('connect')) {
    const connectContent = generateConnectSection(data, config.username);
    sections.push({ id: 'connect', type: 'connect', content: connectContent });
    markdown += connectContent + '\n\n';
  }

  // Footer
  markdown += '---\n\n';
  markdown += `<p align="center">Profile README generated with <a href="https://gitskins.com/readme-generator">GitSkins</a></p>\n`;
  const strategy = buildReadmeStrategy(data, config);
  const score = scoreReadme(markdown, data, config);

  return {
    markdown: markdown.trim(),
    sections,
    metadata: {
      username: config.username,
      generatedAt: new Date().toISOString(),
      languages: data.languages.map(l => l.name),
      repoCount: data.totalRepos,
      totalStars: data.totalStars,
      strategy,
      score,
    },
  };
}

function generateHeaderSection(name: string, data: ExtendedProfileData, style: ReadmeStyle): string {
  if (style === 'minimal') {
    return `# Hi, I'm ${name} 👋`;
  }

  if (style === 'creative') {
    return `<h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=22C55E&center=true&vCenter=true&width=435&lines=Hi+👋+I'm+${encodeURIComponent(name)};Welcome+to+my+profile!" alt="Typing SVG" />
</h1>

<p align="center">
  <img src="${data.avatarUrl}" width="150" style="border-radius: 50%;" alt="${name}" />
</p>`;
  }

  return `<h1 align="center">Hi 👋, I'm ${name}</h1>

<p align="center">
  <img src="${data.avatarUrl}" width="120" style="border-radius: 50%;" alt="${name}" />
</p>`;
}

function generateAboutSection(data: ExtendedProfileData, style: ReadmeStyle): string {
  const bio = data.bio || 'Passionate developer building awesome things.';

  if (style === 'minimal') {
    return `${bio}`;
  }

  let about = `## 👨‍💻 About Me\n\n${bio}\n\n`;

  const details: string[] = [];
  if (data.location) details.push(`📍 Based in **${data.location}**`);
  if (data.company) details.push(`🏢 Working at **${data.company}**`);
  if (data.websiteUrl) details.push(`🌐 Check out my [website](${data.websiteUrl})`);
  details.push(`👥 **${data.followers}** followers · **${data.following}** following`);

  if (details.length > 0) {
    about += details.map(d => `- ${d}`).join('\n');
  }

  return about;
}

function generateSkillsSection(data: ExtendedProfileData, style: ReadmeStyle): string {
  if (data.languages.length === 0) {
    return '';
  }

  let section = style === 'minimal' ? '## Tech Stack\n\n' : '## 🛠️ Languages & Tools\n\n';

  // Add badges for known languages
  const badges = data.languages
    .slice(0, 6)
    .map(lang => {
      const badge = languageBadges[lang.name];
      if (badge) {
        return `![${lang.name}](${badge})`;
      }
      return null;
    })
    .filter(Boolean);

  if (badges.length > 0) {
    section += badges.join(' ') + '\n';
  } else {
    // Fallback to text list
    section += data.languages
      .slice(0, 6)
      .map(l => `**${l.name}** (${l.percentage}%)`)
      .join(' • ');
  }

  return section;
}

function generateStatsSection(username: string, theme: string, style: ReadmeStyle): string {
  const title = style === 'minimal' ? '## Stats\n\n' : '## 📊 GitHub Stats\n\n';

  if (style === 'minimal') {
    return `${title}![GitHub Stats](https://gitskins.com/api/stats?username=${username}&theme=${theme})`;
  }

  return `${title}<p align="center">
  <img src="https://gitskins.com/api/premium-card?username=${username}&theme=${theme}" alt="GitHub Stats" />
</p>

<p align="center">
  <img src="https://gitskins.com/api/languages?username=${username}&theme=${theme}" alt="Top Languages" />
</p>`;
}

function generateStreakSection(
  username: string,
  theme: string,
  streak: ExtendedProfileData['streak']
): string {
  return `## 🔥 Contribution Streak

<p align="center">
  <img src="https://gitskins.com/api/streak?username=${username}&theme=${theme}" alt="GitHub Streak" />
</p>

- 🔥 **Current Streak:** ${streak.current} days
- 🏆 **Longest Streak:** ${streak.longest} days
- 📅 **Total Active Days:** ${streak.totalDays} days`;
}

function generateProjectsSection(
  repos: ExtendedProfileData['pinnedRepos'],
  style: ReadmeStyle
): string {
  if (repos.length === 0) {
    return '';
  }

  let section = style === 'minimal' ? '## Projects\n\n' : '## 🚀 Featured Projects\n\n';

  repos.slice(0, 6).forEach(repo => {
    const langBadge = repo.language ? ` \`${repo.language}\`` : '';
    const description = repo.description || 'No description provided';

    section += `### [${repo.name}](${repo.url})${langBadge}\n`;
    section += `${description}\n`;
    section += `⭐ ${repo.stars} | 🍴 ${repo.forks}\n\n`;
  });

  return section;
}

function generateConnectSection(data: ExtendedProfileData, username: string): string {
  let section = '## 🤝 Connect With Me\n\n';

  const links: string[] = [];

  links.push(`[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${username})`);

  if (data.twitterUsername) {
    links.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${data.twitterUsername})`);
  }

  if (data.websiteUrl) {
    links.push(`[![Website](https://img.shields.io/badge/Website-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](${data.websiteUrl})`);
  }

  section += links.join(' ');

  return section;
}

/**
 * Parse AI-generated README into sections
 */
export function parseGeneratedReadme(markdown: string, config: ReadmeConfig): GeneratedReadme {
  const sections: GeneratedReadme['sections'] = [];

  // Simple parsing - split by ## headers
  const parts = markdown.split(/(?=^## )/gm);

  parts.forEach((part, index) => {
    if (part.trim()) {
      const lines = part.trim().split('\n');
      const firstLine = lines[0].toLowerCase();

      let type: ReadmeSectionType = 'custom';
      if (firstLine.includes('about') || index === 0) type = 'about';
      else if (firstLine.includes('skill') || firstLine.includes('tech') || firstLine.includes('language')) type = 'skills';
      else if (firstLine.includes('stat')) type = 'stats';
      else if (firstLine.includes('streak')) type = 'streak';
      else if (firstLine.includes('project') || firstLine.includes('repo')) type = 'projects';
      else if (firstLine.includes('connect') || firstLine.includes('contact')) type = 'connect';

      sections.push({
        id: `section-${index}`,
        type,
        content: part.trim(),
      });
    }
  });

  return {
    markdown,
    sections,
    metadata: {
      username: config.username,
      generatedAt: new Date().toISOString(),
      languages: [],
      repoCount: 0,
      totalStars: 0,
    },
  };
}
