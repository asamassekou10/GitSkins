export interface SeoLandingPageContent {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroCopy: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  preview: { src: string; alt: string };
  benefits: Array<{ title: string; copy: string }>;
  steps: Array<{ title: string; copy: string }>;
  examples: Array<{ title: string; copy: string; href: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

export const seoLandingPages: Record<string, SeoLandingPageContent> = {
  'github-profile-readme-generator': {
    slug: 'github-profile-readme-generator',
    title: 'GitHub Profile README Generator',
    description: 'Create a polished GitHub profile README with AI, animated sections, profile cards, themes, and copy-ready Markdown.',
    eyebrow: 'README generator',
    heroTitle: 'Generate a GitHub profile README that looks designed.',
    heroCopy: 'GitSkins helps developers turn their GitHub activity, projects, stack, and visual style into a structured profile README with theme-matched cards and animated Markdown blocks.',
    primaryCta: { label: 'Open README Studio', href: '/readme-generator' },
    secondaryCta: { label: 'Browse README examples', href: '/blog/github-profile-readme-examples' },
    preview: {
      src: '/api/premium-card?username=octocat&theme=neon&variant=glass&avatar=persona',
      alt: 'Generated GitHub profile README card preview',
    },
    benefits: [
      { title: 'Profile-first structure', copy: 'Create a README around identity, proof, projects, and next steps instead of dumping badges into a page.' },
      { title: 'Animated sections', copy: 'Add typing headers, dividers, badges, profile cards, and visual blocks that still keep the README readable.' },
      { title: 'Theme consistency', copy: 'Match cards, language charts, avatars, and README motion so the profile feels intentional.' },
    ],
    steps: [
      { title: 'Enter a GitHub username', copy: 'GitSkins reads public profile and repository signals to understand the developer context.' },
      { title: 'Choose a tone and theme', copy: 'Pick a clean, playful, technical, or portfolio-ready direction before generating Markdown.' },
      { title: 'Copy the README block', copy: 'Paste the generated Markdown into your profile repository and refine the final details.' },
    ],
    examples: [
      { title: 'README examples', copy: 'See structures for junior developers, senior engineers, maintainers, and freelancers.', href: '/blog/github-profile-readme-examples' },
      { title: 'README animations', copy: 'Learn where typing SVGs, dividers, and motion help or distract.', href: '/blog/best-github-readme-animations' },
      { title: 'Profile strategy', copy: 'Build the first screen around a clear signal and proof.', href: '/blog/how-to-make-github-profile-stand-out' },
    ],
    faqs: [
      { question: 'Can GitSkins generate a GitHub profile README for free?', answer: 'Signed-in free users can generate a limited number of READMEs. Pro unlocks broader AI features, premium themes, and higher limits.' },
      { question: 'Does GitSkins edit my GitHub repository automatically?', answer: 'No. GitSkins generates copy-ready Markdown so you stay in control of what gets committed to your profile repository.' },
      { question: 'Can I add animations to the generated README?', answer: 'Yes. GitSkins supports animated README elements such as typing headers, visual dividers, badges, and theme-matched cards.' },
    ],
  },
  'github-readme-stats-card': {
    slug: 'github-readme-stats-card',
    title: 'GitHub README Stats Card Generator',
    description: 'Design GitHub README stats cards, language charts, streak widgets, and profile cards with premium themes and copy-ready Markdown.',
    eyebrow: 'GitHub cards',
    heroTitle: 'Create GitHub stats cards that match your profile.',
    heroCopy: 'Use GitSkins to generate profile cards, stats widgets, language charts, and streak cards with one consistent theme across your GitHub README.',
    primaryCta: { label: 'Open Card Studio', href: '/cards' },
    secondaryCta: { label: 'Compare card types', href: '/blog/github-profile-card-guide' },
    preview: {
      src: '/api/stats?username=octocat&theme=matrix',
      alt: 'GitHub README stats card preview',
    },
    benefits: [
      { title: 'Multiple card types', copy: 'Use profile, stats, languages, and streak cards depending on what you want visitors to understand.' },
      { title: 'Copy-ready embeds', copy: 'Generate Markdown, HTML, or direct image URLs for your README.' },
      { title: 'Premium themes', copy: 'Match cards to themes like Matrix, Dracula, Neon, Studio, Zen, and seasonal palettes.' },
    ],
    steps: [
      { title: 'Pick a GitHub username', copy: 'Preview cards against real public GitHub activity.' },
      { title: 'Choose the right widget', copy: 'Use profile cards for identity, stats for activity, languages for focus, and streaks for momentum.' },
      { title: 'Embed it in your README', copy: 'Copy the generated Markdown and place it where it supports the profile story.' },
    ],
    examples: [
      { title: 'Theme catalog', copy: 'Preview every card across GitSkins theme systems.', href: '/themes' },
      { title: 'Card guide', copy: 'Learn when to use each card type.', href: '/blog/github-profile-card-guide' },
      { title: 'Profile examples', copy: 'See how cards fit inside complete developer profiles.', href: '/examples' },
    ],
    faqs: [
      { question: 'Which GitHub README card should I use first?', answer: 'Start with a profile card near the top, then add one supporting stats, language, or streak card if it strengthens the story.' },
      { question: 'Can I use GitSkins cards in any README?', answer: 'Yes. The generated image URLs and Markdown snippets can be embedded in GitHub profile READMEs and project READMEs.' },
      { question: 'Are premium themes available on the free plan?', answer: 'Free users get a smaller theme set. Pro unlocks the full theme catalog and advanced profile tooling.' },
    ],
  },
  'github-profile-avatar-generator': {
    slug: 'github-profile-avatar-generator',
    title: 'GitHub Profile Avatar Generator',
    description: 'Generate theme-matched GitHub profile pictures, developer avatars, and project personas for README cards and profile branding.',
    eyebrow: 'Avatar generator',
    heroTitle: 'Create a GitHub avatar that matches your developer brand.',
    heroCopy: 'Generate profile pictures and project personas that share the same colors and visual language as your GitSkins cards, themes, and README assets.',
    primaryCta: { label: 'Open Avatar Studio', href: '/avatar' },
    secondaryCta: { label: 'Generate project persona', href: '/avatar/persona' },
    preview: {
      src: '/api/avatar?username=octocat&family=character&character=terminal-mage&theme=dracula&expression=happy&size=800',
      alt: 'Theme-matched developer avatar preview',
    },
    benefits: [
      { title: 'Theme-matched identity', copy: 'Generate avatars that match Dracula, Matrix, Neon, Zen, and the rest of your GitSkins system.' },
      { title: 'Character and abstract styles', copy: 'Choose readable profile images that work in small GitHub UI surfaces.' },
      { title: 'Project personas', copy: 'Turn repository signals into a character for launches, docs, and project branding.' },
    ],
    steps: [
      { title: 'Choose a username or project', copy: 'Use public GitHub context to seed a consistent avatar direction.' },
      { title: 'Select a theme and style', copy: 'Match the avatar to your profile card, README, and hosted skin.' },
      { title: 'Export and reuse', copy: 'Download the image or copy a URL for GitHub, docs, launch pages, and social posts.' },
    ],
    examples: [
      { title: 'Avatar branding guide', copy: 'Learn how profile pictures support developer recognition.', href: '/blog/developer-avatar-branding' },
      { title: 'Theme systems', copy: 'Find palettes that work across avatars and cards.', href: '/themes' },
      { title: 'Project persona generator', copy: 'Generate a character based on repository signals.', href: '/avatar/persona' },
    ],
    faqs: [
      { question: 'Can I use a generated avatar as my GitHub profile picture?', answer: 'Yes. Download the generated image and upload it to GitHub like any other profile picture.' },
      { question: 'Do avatars match GitSkins themes?', answer: 'Yes. Avatar colors are designed to work with the same theme system used by cards, README assets, and profile skins.' },
      { question: 'What is a project persona?', answer: 'A project persona is a character-style visual identity generated from a repository or developer project context.' },
    ],
  },
  'github-profile-themes': {
    slug: 'github-profile-themes',
    title: 'GitHub Profile Themes',
    description: 'Browse GitHub profile themes for cards, stats widgets, avatars, README animations, profile skins, and browser extension previews.',
    eyebrow: 'Theme systems',
    heroTitle: 'Choose one theme for your entire GitHub profile.',
    heroCopy: 'GitSkins themes work across profile cards, stats, language widgets, streaks, avatars, README animations, hosted profile skins, and the Chrome extension.',
    primaryCta: { label: 'Browse Theme Catalog', href: '/themes' },
    secondaryCta: { label: 'View Matrix theme', href: '/themes/matrix' },
    preview: {
      src: '/api/premium-card?username=octocat&theme=matrix&variant=persona&avatar=persona',
      alt: 'GitHub profile theme system preview',
    },
    benefits: [
      { title: 'One visual system', copy: 'Use the same colors and mood across every GitHub profile surface.' },
      { title: 'Free and Pro themes', copy: 'Start with core themes and upgrade when you want the full catalog.' },
      { title: 'Preview before choosing', copy: 'Theme pages show cards, widgets, avatars, and suggested use cases.' },
    ],
    steps: [
      { title: 'Browse by mood', copy: 'Filter original, seasonal, holiday, developer, and aesthetic themes.' },
      { title: 'Open a theme detail page', copy: 'Preview that theme across profile cards and supporting widgets.' },
      { title: 'Apply it everywhere', copy: 'Use the theme in cards, avatars, README assets, profile skins, and extension workflows.' },
    ],
    examples: [
      { title: 'Theme catalog', copy: 'Explore all GitSkins themes.', href: '/themes' },
      { title: 'Dracula theme', copy: 'A dark developer aesthetic for polished profiles.', href: '/themes/dracula' },
      { title: 'Matrix theme', copy: 'A terminal-inspired theme for technical profiles.', href: '/themes/matrix' },
    ],
    faqs: [
      { question: 'What is a GitHub profile theme?', answer: 'A GitHub profile theme is a reusable visual system for cards, avatars, README assets, and profile skin previews.' },
      { question: 'Can I preview a theme before using it?', answer: 'Yes. Each GitSkins theme page includes preview cards and guidance for how to use the theme.' },
      { question: 'Do themes work with the Chrome extension?', answer: 'Yes. The extension lets you use theme-matched workflows directly from GitHub profile pages.' },
    ],
  },
  'github-profile-browser-extension': {
    slug: 'github-profile-browser-extension',
    title: 'GitHub Profile Browser Extension',
    description: 'Install the GitSkins Chrome extension to create GitHub profile cards, avatars, README snippets, and profile skin links directly from GitHub.',
    eyebrow: 'Chrome extension',
    heroTitle: 'Use GitSkins directly on GitHub profile pages.',
    heroCopy: 'The GitSkins Chrome extension adds a profile action bar to GitHub so you can detect usernames, create cards, open avatars, copy README snippets, and preview profile skins faster.',
    primaryCta: { label: 'Install Chrome Extension', href: '/extension' },
    secondaryCta: { label: 'Browse themes', href: '/themes' },
    preview: {
      src: '/api/premium-card?username=octocat&theme=studio&variant=persona&avatar=persona',
      alt: 'GitSkins browser extension profile card preview',
    },
    benefits: [
      { title: 'Works where you already are', copy: 'Open GitSkins actions while viewing GitHub profile pages.' },
      { title: 'Faster copy workflows', copy: 'Copy profile cards and README blocks without manually moving usernames between tabs.' },
      { title: 'Theme defaults', copy: 'Save preferred GitSkins themes and profile skin preferences in the browser.' },
    ],
    steps: [
      { title: 'Install from Chrome Web Store', copy: 'Add the extension to Chrome or a Chromium-based browser.' },
      { title: 'Open a GitHub profile', copy: 'The extension detects the username from the active GitHub profile page.' },
      { title: 'Create and copy assets', copy: 'Jump into cards, avatars, README tools, and hosted profile skin previews.' },
    ],
    examples: [
      { title: 'Extension page', copy: 'See what the accepted Chrome extension does.', href: '/extension' },
      { title: 'Privacy details', copy: 'Review exactly what the extension does and does not collect.', href: '/privacy' },
      { title: 'Support', copy: 'Get help with extension install or profile-page behavior.', href: '/support' },
    ],
    faqs: [
      { question: 'Does the extension change my GitHub profile for other visitors?', answer: 'No. It adds tools to your own browser. Public changes happen only when you copy Markdown or share a hosted GitSkins profile skin.' },
      { question: 'Does the extension collect my browsing history?', answer: 'No. It is designed for GitHub profile pages and does not collect browsing history, passwords, tokens, or payment data.' },
      { question: 'Where can I install the extension?', answer: 'The GitSkins extension is live on the Chrome Web Store and can be opened from the extension page.' },
    ],
  },
};

export const seoLandingSlugs = Object.keys(seoLandingPages);
