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

/**
 * Build AI prompt for README generation
 */
export function buildReadmePrompt(
  data: ExtendedProfileData,
  config: ReadmeConfig
): string {
  const sectionsToInclude = config.sections.join(', ');
  const topLanguages = data.languages.slice(0, 5).map(l => l.name).join(', ');

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
- Sections to include: ${sectionsToInclude}
- Theme for GitSkins widgets: ${config.theme}

**Instructions:**
1. Generate a professional, well-structured README.md
2. Use proper markdown formatting with headers, lists, and sections
3. For the stats section, include these GitSkins widget URLs:
   - Profile Card: ![GitHub Stats](https://gitskins.com/api/premium-card?username=${config.username}&theme=${config.theme})
   - Languages: ![Top Languages](https://gitskins.com/api/languages?username=${config.username}&theme=${config.theme})
   - Streak: ![Streak Stats](https://gitskins.com/api/streak?username=${config.username}&theme=${config.theme})
4. Keep the tone ${config.style === 'creative' ? 'fun and engaging' : config.style === 'detailed' ? 'professional and comprehensive' : 'clean and minimal'}
5. ${config.style === 'minimal' ? 'Keep content brief and focused' : 'Include detailed descriptions'}
6. Use badges for technologies/languages when appropriate
7. Include a proper header with the developer's name
8. End with social links/contact info if available

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

  return {
    markdown: markdown.trim(),
    sections,
    metadata: {
      username: config.username,
      generatedAt: new Date().toISOString(),
      languages: data.languages.map(l => l.name),
      repoCount: data.totalRepos,
      totalStars: data.totalStars,
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
