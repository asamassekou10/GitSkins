export interface BlogSection {
  heading: string;
  body: string[];
  bullets?: string[];
  cta?: {
    label: string;
    href: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  updated: string;
  hero: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-make-github-profile-stand-out',
    title: 'How to Make Your GitHub Profile Stand Out as a Developer',
    description: 'A practical guide to building a GitHub profile that shows your taste, technical direction, and best work without becoming cluttered.',
    category: 'Profile Strategy',
    readTime: '7 min read',
    updated: '2026-05-02',
    hero: '/api/premium-card?username=octocat&theme=github-dark&variant=glass&avatar=persona',
    sections: [
      {
        heading: 'Lead with a clear signal',
        body: [
          'Most visitors scan your profile for a few seconds before deciding whether to keep reading. Your first screen should answer three questions quickly: what you build, what you are good at, and where someone should click next.',
          'A strong profile README does not need to be long. It needs hierarchy. Use one visual anchor, one concise introduction, and links to your best proof.',
        ],
        bullets: [
          'Use a profile card or short headline as the first visual element.',
          'Keep your intro to two or three lines.',
          'Put your strongest projects above experiments, badges, and secondary links.',
        ],
        cta: { label: 'Create a profile card', href: '/cards' },
      },
      {
        heading: 'Choose proof over decoration',
        body: [
          'Badges, widgets, and animations can make a profile feel alive, but they should support your credibility. Too many elements can make the page feel noisy and push important repositories below the fold.',
          'Think of every element as a job. Stats show activity, language cards show technical focus, project cards show capability, and avatars help with recognition.',
        ],
        bullets: [
          'Use one card for identity.',
          'Use one or two widgets for supporting context.',
          'Use pinned repositories for evidence.',
          'Use a consistent theme across all visuals.',
        ],
      },
      {
        heading: 'Make the next action obvious',
        body: [
          'If a recruiter, founder, collaborator, or open-source maintainer lands on your profile, the page should guide them toward the next step. That might be your portfolio, a featured project, your docs, or a contact link.',
          'A GitHub profile is not just a scrapbook. Treat it like a compact landing page for your engineering work.',
        ],
        bullets: [
          'Add a small "Featured work" section with two or three projects.',
          'Include links to live demos, case studies, or docs when available.',
          'Avoid burying contact links at the very bottom.',
        ],
        cta: { label: 'Browse profile examples', href: '/examples' },
      },
    ],
  },
  {
    slug: 'github-profile-readme-examples',
    title: 'GitHub Profile README Examples: What Good Developer Profiles Include',
    description: 'Useful README structures for junior developers, senior engineers, open-source maintainers, and freelancers.',
    category: 'README Design',
    readTime: '8 min read',
    updated: '2026-05-02',
    hero: '/api/premium-card?username=torvalds&theme=matrix&variant=terminal&avatar=persona',
    sections: [
      {
        heading: 'The reliable profile README structure',
        body: [
          'The best GitHub profile READMEs usually follow a simple pattern: identity, focus, proof, and next steps. You can adjust the tone, but the underlying structure works for most developers.',
          'Start with the reason someone should keep reading. Then show proof through projects, contribution activity, writing, open-source work, or product screenshots.',
        ],
        bullets: [
          'Header: who you are and what you build.',
          'Proof: selected projects, repositories, or metrics.',
          'Context: current focus, stack, or learning direction.',
          'Action: portfolio, email, calendar, or social links.',
        ],
      },
      {
        heading: 'Different profiles need different emphasis',
        body: [
          'A junior developer should optimize for clarity and learning momentum. A senior engineer should highlight judgment, systems thinking, and project outcomes. An open-source maintainer should make contribution paths obvious.',
          'The mistake is copying someone else exact layout without matching your own goal. Your README should make your specific strengths easier to understand.',
        ],
        bullets: [
          'Junior: show progression, projects, and what you are learning.',
          'Senior: show systems, impact, leadership, and architecture examples.',
          'Open source: show installation, contribution, roadmap, and community links.',
          'Freelance: show outcomes, stack, testimonials when real, and contact paths.',
        ],
        cta: { label: 'Generate a README draft', href: '/readme-generator' },
      },
      {
        heading: 'Keep the page scannable',
        body: [
          'A useful profile is easy to skim on mobile and desktop. Short sections, consistent spacing, and a limited visual palette make the page feel more professional.',
          'If a section does not teach the visitor something important about you, remove it or move it lower.',
        ],
      },
    ],
  },
  {
    slug: 'github-profile-card-guide',
    title: 'GitHub Profile Cards: When to Use Stats, Languages, Streaks, and Profile Cards',
    description: 'How to choose the right GitHub profile widgets without turning your README into a dashboard.',
    category: 'Widget Guide',
    readTime: '6 min read',
    updated: '2026-05-02',
    hero: '/api/stats?username=octocat&theme=github-dark',
    sections: [
      {
        heading: 'Use a profile card for the first impression',
        body: [
          'A profile card works best near the top of the README because it combines identity, tone, and proof in one compact block. It should feel like a cover image for your developer profile.',
          'Choose the card style before adding supporting widgets. That gives the rest of the page a visual direction.',
        ],
        cta: { label: 'Open Card Studio', href: '/cards' },
      },
      {
        heading: 'Use stats when activity matters',
        body: [
          'Stats cards are helpful when you want to show activity, consistency, or open-source participation. They are less useful if the numbers distract from a stronger project narrative.',
          'Place stats after your intro or near a project section, not necessarily at the very top.',
        ],
      },
      {
        heading: 'Use languages to clarify your technical lane',
        body: [
          'Language cards are best when they reinforce the kind of work you want to be known for. If your repositories contain experiments in many stacks, the chart may be less meaningful than a curated stack list.',
        ],
        bullets: [
          'Frontend profile: emphasize UI projects, design systems, and app polish.',
          'Backend profile: emphasize APIs, infrastructure, databases, and reliability.',
          'Full-stack profile: pair languages with project outcomes.',
        ],
      },
      {
        heading: 'Use streaks carefully',
        body: [
          'A streak card can communicate momentum, but it should not be the only proof of skill. Consistent commits are good. Meaningful projects are better.',
        ],
      },
    ],
  },
  {
    slug: 'developer-avatar-branding',
    title: 'Developer Avatar Branding: Matching Your Profile Picture, README, and Portfolio',
    description: 'How to use avatars, colors, and visual consistency to make your developer presence easier to recognize.',
    category: 'Avatar Design',
    readTime: '7 min read',
    updated: '2026-05-02',
    hero: '/api/avatar?username=octocat&family=character&character=terminal-mage&theme=dracula&expression=happy&size=800',
    sections: [
      {
        heading: 'Your avatar is a tiny brand system',
        body: [
          'A developer avatar appears everywhere: GitHub, pull requests, package pages, discussions, portfolios, and social posts. When it matches the rest of your profile, people recognize you faster.',
          'The goal is not to look corporate. The goal is to make your work feel intentional and easy to remember.',
        ],
        bullets: [
          'Use one dominant color palette across avatar, README, and card.',
          'Keep the avatar readable at small sizes.',
          'Avoid low-contrast details that disappear in GitHub comments.',
        ],
        cta: { label: 'Create a themed avatar', href: '/avatar' },
      },
      {
        heading: 'Match tone to audience',
        body: [
          'A playful character can work well for open-source, indie products, creative coding, or community work. A cleaner abstract avatar may fit consulting, infrastructure, security, or enterprise engineering better.',
          'The strongest choice is the one that supports how you want visitors to interpret your work.',
        ],
      },
      {
        heading: 'Use project personas for storytelling',
        body: [
          'If you maintain several projects, a project persona can give each one a distinct identity while keeping them inside the same visual family. This is especially useful for GitHub orgs, docs sites, and launch assets.',
        ],
        cta: { label: 'Generate a project persona', href: '/avatar/persona' },
      },
    ],
  },
  {
    slug: 'best-github-readme-animations',
    title: 'Best GitHub README Animations and How to Use Them Tastefully',
    description: 'A practical guide to typing SVGs, contribution snakes, animated dividers, visitor counters, and when motion helps or hurts a GitHub profile.',
    category: 'README Motion',
    readTime: '8 min read',
    updated: '2026-05-02',
    hero: '/api/premium-card?username=octocat&theme=neon&variant=glass&avatar=persona',
    sections: [
      {
        heading: 'Use motion to guide attention, not decorate everything',
        body: [
          'Animated GitHub READMEs can look memorable, but the best ones use motion sparingly. The goal is to make the profile easier to understand, not to turn it into a page full of competing effects.',
          'A typing headline, one visual card, and a clean project section usually beats five animated widgets stacked together.',
        ],
        bullets: [
          'Use one hero animation near the top.',
          'Keep project proof readable and mostly static.',
          'Avoid animations that push important links below the fold.',
        ],
        cta: { label: 'Generate an animated README', href: '/readme-generator' },
      },
      {
        heading: 'Typing SVGs work best as positioning',
        body: [
          'A typing SVG is most useful when it cycles through your role, current focus, and strongest signal. It should not be a random slogan carousel.',
          'Good lines are specific: "Full-stack product engineer", "Building developer tools", or "Open-source maintainer". Weak lines are vague: "I love coding" or "Welcome to my profile".',
        ],
        bullets: [
          'Use two to four short lines.',
          'Match the text color to your README theme.',
          'Keep the animation speed readable.',
        ],
      },
      {
        heading: 'Contribution snakes need setup',
        body: [
          'The contribution snake is popular because it turns a GitHub graph into a playful visual. It usually requires a GitHub Actions workflow that generates an SVG into an output branch.',
          'That means the README block alone is not enough. You also need the workflow file in your profile repository.',
        ],
        bullets: [
          'Add the generated workflow under .github/workflows.',
          'Make sure the workflow has contents: write permission.',
          'Use it as a lower-page flourish, not the main proof of skill.',
        ],
      },
      {
        heading: 'Avoid animation overload',
        body: [
          'Trophies, counters, badges, typing headers, GIFs, and stats can all be useful in isolation. Together, they can make a profile feel noisy and less professional.',
          'If the profile is for hiring, use motion like seasoning: enough to create personality, not enough to distract from projects and contact paths.',
        ],
        bullets: [
          'Job seeker: typing header, profile card, project proof.',
          'Open-source maintainer: stats, contribution snake, contributor links.',
          'Indie builder: product links, profile card, currently building section.',
          'Student: learning focus, small animation, project progression.',
        ],
      },
    ],
  },
  {
    slug: 'introducing-gitskins-theme-systems',
    title: 'Introducing GitSkins Theme Systems',
    description: 'GitSkins themes now work across profile cards, avatars, README assets, hosted profile skins, and the browser extension.',
    category: 'Product Update',
    readTime: '5 min read',
    updated: '2026-05-04',
    hero: '/api/premium-card?username=octocat&theme=matrix&variant=persona&avatar=persona',
    sections: [
      {
        heading: 'A theme should be more than a color picker',
        body: [
          'A developer profile has many surfaces: the README hero, stats widgets, language charts, avatars, browser previews, and portfolio links. If each piece uses a different visual style, the profile starts to feel assembled instead of designed.',
          'Theme Systems are GitSkins answer to that problem. Each theme is designed to carry across the full profile kit so the user can build one consistent developer identity.',
        ],
        bullets: [
          'Profile cards for first impression.',
          'Stats, language, and streak widgets for proof.',
          'Theme-matched avatars for recognition.',
          'README motion and dividers for structure.',
          'Hosted profile skins for sharing beyond GitHub.',
        ],
        cta: { label: 'Browse theme systems', href: '/themes' },
      },
      {
        heading: 'The catalog is built for exploration',
        body: [
          'The new theme catalog lets users search and filter every GitSkins theme by mood and category. Each detail page shows the theme across multiple profile surfaces instead of only showing a static palette.',
          'This makes theme choice more practical. Users can see whether a theme works for a polished portfolio, a playful open-source identity, a cyber console look, or a seasonal refresh.',
        ],
      },
      {
        heading: 'Available where developers work',
        body: [
          'GitSkins also brings theme systems into the browser extension. Users can copy theme-matched markdown from GitHub profile pages and optionally preview GitHub profile skins locally in their own browser.',
          'The public profile still comes from README markdown and hosted GitSkins pages, but the extension makes the creative workflow faster and more fun.',
        ],
        cta: { label: 'Preview the extension', href: '/extension' },
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
