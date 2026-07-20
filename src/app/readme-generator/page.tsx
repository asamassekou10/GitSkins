'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FREE_THEMES } from '@/config/subscription';
import { ThinkingProgress } from '@/components/ThinkingProgress';
import { useThinkingProgress } from '@/hooks/useThinkingProgress';
import { invalidateUserPlanCache, useUserPlan } from '@/hooks/useUserPlan';
import { toDisplayText } from '@/lib/ai-text';

type ReadmeStyle = 'minimal' | 'detailed' | 'creative';
type SectionType = 'header' | 'about' | 'skills' | 'stats' | 'projects' | 'streak' | 'connect';
type CareerRole = 'frontend' | 'backend' | 'fullstack' | 'data' | 'mobile' | 'devops' | 'product';
type ReadmeGoal = 'get-hired' | 'open-source' | 'freelance' | 'indie-hacker' | 'student' | 'founder' | 'personal-brand';
type ReadmeStructure = 'portfolio' | 'hiring' | 'open-source' | 'founder' | 'minimal' | 'visual' | 'technical';
type ReadmeTone = 'concise' | 'confident' | 'friendly' | 'senior' | 'founder' | 'playful' | 'recruiter';
type MotionStyle = 'none' | 'subtle' | 'animated' | 'playful';
type AnimatedSection = 'hero' | 'stats' | 'stack' | 'social';
type InspectorTab = 'content' | 'style' | 'agent';
type MediaBinTab = 'profile' | 'visuals' | 'links';
type CanvasView = 'preview' | 'github' | 'markdown';
type SectionAssets = Partial<Record<SectionType, AnimatedSection[]>>;
type PreviewVisual = {
  id: string;
  label: string;
  url: string;
  alt: string;
};
type PreviewSection = {
  key: string;
  id: SectionType;
  label: string;
  description: string;
  assets: PreviewVisual[];
  markdown: string;
  isGenerated: boolean;
};

const themes = [
  { id: 'satan', name: 'Satan', color: '#ff4500', free: true },
  { id: 'neon', name: 'Neon', color: '#00ffff', free: false },
  { id: 'zen', name: 'Zen', color: '#00ff88', free: true },
  { id: 'github-dark', name: 'GitHub', color: '#238636', free: true },
  { id: 'dracula', name: 'Dracula', color: '#ff79c6', free: false },
  { id: 'aurora', name: 'Aurora', color: '#2dd4bf', free: false },
];

const availableSections: { id: SectionType; label: string; description: string }[] = [
  { id: 'header', label: 'Header', description: 'Intro with name and avatar' },
  { id: 'about', label: 'About Me', description: 'Bio and personal info' },
  { id: 'skills', label: 'Skills', description: 'Languages & tech badges' },
  { id: 'stats', label: 'GitHub Stats', description: 'GitSkins stat widgets' },
  { id: 'streak', label: 'Streak', description: 'Contribution streak widget' },
  { id: 'projects', label: 'Projects', description: 'Pinned repositories' },
  { id: 'connect', label: 'Connect', description: 'Social links & contact' },
];

const styleOptions: { id: ReadmeStyle; label: string; description: string }[] = [
  { id: 'minimal', label: 'Minimal', description: 'Clean and simple' },
  { id: 'detailed', label: 'Detailed', description: 'Professional & comprehensive' },
  { id: 'creative', label: 'Creative', description: 'Fun with animations' },
];

const goalOptions: { id: ReadmeGoal; label: string; description: string }[] = [
  { id: 'get-hired', label: 'Get Hired', description: 'Recruiter-friendly proof and contact path' },
  { id: 'open-source', label: 'Open Source', description: 'Maintainer credibility and contributor clarity' },
  { id: 'freelance', label: 'Freelance', description: 'Services, outcomes, and conversion' },
  { id: 'indie-hacker', label: 'Indie Hacker', description: 'Products, launches, and builder momentum' },
  { id: 'student', label: 'Student', description: 'Learning velocity and project potential' },
  { id: 'founder', label: 'Founder', description: 'Product vision and technical ownership' },
  { id: 'personal-brand', label: 'Personal Brand', description: 'Memorable developer positioning' },
];

const structureOptions: { id: ReadmeStructure; label: string; description: string }[] = [
  { id: 'visual', label: 'Visual Kit', description: 'GitSkins card, widgets, and polished sections' },
  { id: 'portfolio', label: 'Portfolio', description: 'Featured work and clear project proof' },
  { id: 'hiring', label: 'Hiring', description: 'Fast scan for recruiters and teams' },
  { id: 'open-source', label: 'OSS', description: 'Community and contributor oriented' },
  { id: 'founder', label: 'Founder', description: 'Products, direction, and outcomes' },
  { id: 'minimal', label: 'Minimal', description: 'Short, clean, low-badge layout' },
  { id: 'technical', label: 'Technical', description: 'Systems, stack, and deeper proof' },
];

const toneOptions: { id: ReadmeTone; label: string }[] = [
  { id: 'confident', label: 'Confident' },
  { id: 'concise', label: 'Concise' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'senior', label: 'Senior' },
  { id: 'founder', label: 'Founder' },
  { id: 'playful', label: 'Playful' },
  { id: 'recruiter', label: 'Recruiter' },
];

const motionOptions: { id: MotionStyle; label: string; description: string }[] = [
  { id: 'none', label: 'None', description: 'Static, professional README' },
  { id: 'subtle', label: 'Subtle', description: 'Typing headline and clean motion' },
  { id: 'animated', label: 'Animated', description: 'Typing, divider, and live widgets' },
  { id: 'playful', label: 'Playful', description: 'More personality and GitHub flair' },
];

const animatedSections: { id: AnimatedSection; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'stats', label: 'Stats' },
  { id: 'stack', label: 'Stack' },
  { id: 'social', label: 'Social' },
];

const defaultSectionAssets: Partial<Record<SectionType, AnimatedSection[]>> = {
  header: ['hero'],
  skills: ['stack'],
  stats: ['stats'],
  connect: ['social'],
};

const sectionInspectorCopy: Record<SectionType, { title: string; description: string; controls: string[] }> = {
  header: {
    title: 'Header',
    description: 'Sets the first impression: identity, role, and visual intro.',
    controls: ['Username', 'Theme', 'Typing headline'],
  },
  about: {
    title: 'About Me',
    description: 'Shapes the short profile story and positioning.',
    controls: ['Goal', 'Tone', 'Career role'],
  },
  skills: {
    title: 'Skills',
    description: 'Controls the stack badges and technical signal.',
    controls: ['Structure', 'Style', 'Visual density'],
  },
  stats: {
    title: 'GitHub Stats',
    description: 'Adds GitSkins stat cards and profile metrics.',
    controls: ['Theme', 'Animated section', 'Widget style'],
  },
  projects: {
    title: 'Projects',
    description: 'Highlights repositories as proof of work.',
    controls: ['Goal', 'Project proof', 'Layout'],
  },
  streak: {
    title: 'Streak',
    description: 'Adds contribution consistency signals.',
    controls: ['Motion', 'Widget theme', 'GitHub data'],
  },
  connect: {
    title: 'Connect',
    description: 'Adds contact links and social calls to action.',
    controls: ['Website', 'X', 'LinkedIn', 'Email'],
  },
};

const sectionWorkflowCopy: Record<SectionType, { focus: string; ai: string; output: string }> = {
  header: {
    focus: 'Identity, role, avatar, and opening visual.',
    ai: 'Uses profile name, bio, avatar, and selected goal to draft the first impression.',
    output: 'Hero card, short intro, and optional typing headline.',
  },
  about: {
    focus: 'Positioning, credibility, and human profile story.',
    ai: 'Turns public profile signals into a concise narrative without inventing history.',
    output: 'About section tuned to the selected role and tone.',
  },
  skills: {
    focus: 'Tech stack, skill badges, and language confidence.',
    ai: 'Prioritizes languages and stack signals that match profile/project evidence.',
    output: 'Stack section with badges and GitSkins visual stack.',
  },
  stats: {
    focus: 'Profile metrics, contribution proof, and GitHub activity.',
    ai: 'Pairs stats widgets with the selected visual theme and avoids overexplaining metrics.',
    output: 'Stats card layout using the active GitSkins theme.',
  },
  projects: {
    focus: 'Pinned repositories and project proof.',
    ai: 'Reads repo descriptions, languages, and stars to write specific project blurbs.',
    output: 'Featured project cards with outcome-oriented copy.',
  },
  streak: {
    focus: 'Contribution consistency and long-term activity.',
    ai: 'Uses streak/activity as support, not as a substitute for project proof.',
    output: 'Contribution streak block and optional motion widgets.',
  },
  connect: {
    focus: 'Contact path and social conversion.',
    ai: 'Uses only provided or public profile links, and never invents social URLs.',
    output: 'Social row, links, and call to connect.',
  },
};

const careerRoles: { id: CareerRole; label: string; description: string }[] = [
  { id: 'frontend', label: 'Frontend Engineer', description: 'UI/UX, performance, design systems' },
  { id: 'backend', label: 'Backend Engineer', description: 'APIs, scalability, data reliability' },
  { id: 'fullstack', label: 'Full-Stack Engineer', description: 'End-to-end delivery and ownership' },
  { id: 'data', label: 'Data/ML Engineer', description: 'Pipelines, analytics, ML systems' },
  { id: 'mobile', label: 'Mobile Engineer', description: 'iOS/Android and cross-platform' },
  { id: 'devops', label: 'DevOps/SRE', description: 'Infra, CI/CD, reliability' },
  { id: 'product', label: 'Product Engineer', description: 'Impact, experiments, growth' },
];

const sectionIdFromHeading = (heading: string): SectionType => {
  const normalized = heading.toLowerCase();
  if (normalized.includes('about')) return 'about';
  if (normalized.includes('skill') || normalized.includes('language') || normalized.includes('stack') || normalized.includes('tool')) return 'skills';
  if (normalized.includes('stat') || normalized.includes('metric')) return 'stats';
  if (normalized.includes('streak') || normalized.includes('contribution')) return 'streak';
  if (normalized.includes('project') || normalized.includes('repo') || normalized.includes('work')) return 'projects';
  if (normalized.includes('connect') || normalized.includes('contact') || normalized.includes('social')) return 'connect';
  return 'header';
};

const labelForSectionId = (sectionId: SectionType) =>
  availableSections.find((section) => section.id === sectionId)?.label ?? sectionInspectorCopy[sectionId].title;

const visualLabelFromUrl = (url: string, fallback: string) => {
  const sectionMatch = url.match(/\/api\/section\/(hero|stats|stack|social)/);
  if (sectionMatch) {
    const visual = animatedSections.find((item) => item.id === sectionMatch[1]);
    return visual?.label ?? fallback;
  }
  if (url.includes('/api/streak')) return 'Streak';
  if (url.includes('/api/languages')) return 'Languages';
  if (url.includes('/api/stats')) return 'Stats';
  if (url.includes('/api/premium-card')) return 'Profile Card';
  return fallback;
};

const extractPreviewVisuals = (markdown: string): PreviewVisual[] => {
  const visuals: PreviewVisual[] = [];
  const htmlImagePattern = /<img\b([^>]*?)>/gi;
  const markdownImagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

  let htmlMatch: RegExpExecArray | null;
  while ((htmlMatch = htmlImagePattern.exec(markdown)) !== null) {
    const attrs = htmlMatch[1];
    const src = attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!src) continue;
    const alt = attrs.match(/\balt=["']([^"']*)["']/i)?.[1] ?? 'GitSkins visual';
    const label = visualLabelFromUrl(src, alt || 'Visual');
    visuals.push({ id: `${src}-${visuals.length}`, label, url: src, alt });
  }

  let markdownMatch: RegExpExecArray | null;
  while ((markdownMatch = markdownImagePattern.exec(markdown)) !== null) {
    const alt = markdownMatch[1] || 'GitSkins visual';
    const src = markdownMatch[2];
    const label = visualLabelFromUrl(src, alt || 'Visual');
    visuals.push({ id: `${src}-${visuals.length}`, label, url: src, alt });
  }

  return visuals.filter((visual, index, list) => list.findIndex((item) => item.url === visual.url) === index);
};

const cleanPreviewMarkdown = (markdown: string) =>
  markdown
    .replace(/<p[^>]*>\s*<img\b[^>]*>\s*<\/p>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/<p\s+align=["']center["']>\s*<\/p>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\s*---\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const parseReadmePreview = (markdown: string) => {
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const withoutTitle = markdown.replace(/^#\s+.+$/m, '').trim();
  const lines = withoutTitle.split('\n');
  const chunks: { label: string; content: string[] }[] = [{ label: 'Header', content: [] }];

  lines.forEach((line) => {
    const headingMatch = line.match(/^##+\s+(.+)$/);
    if (headingMatch) {
      chunks.push({ label: headingMatch[1].replace(/[^\w\s&/-]/g, '').trim() || 'Section', content: [] });
      return;
    }
    chunks[chunks.length - 1].content.push(line);
  });

  const sections = chunks
    .map((chunk, index): PreviewSection | null => {
      const rawMarkdown = chunk.content.join('\n').trim();
      const visuals = extractPreviewVisuals(rawMarkdown);
      const cleanMarkdown = cleanPreviewMarkdown(rawMarkdown);
      if (!cleanMarkdown && visuals.length === 0) return null;
      const id = index === 0 ? 'header' : sectionIdFromHeading(chunk.label);
      return {
        key: `generated-${index}-${id}`,
        id,
        label: index === 0 ? labelForSectionId('header') : chunk.label,
        description: sectionInspectorCopy[id].description,
        assets: visuals,
        markdown: cleanMarkdown,
        isGenerated: true,
      };
    })
    .filter((section): section is PreviewSection => Boolean(section));

  const summary = cleanPreviewMarkdown(chunks[0]?.content.join('\n') ?? '')
    .split('\n')
    .map((line) => line.replace(/^>\s*/, '').trim())
    .find(Boolean);

  return {
    title,
    summary,
    sections,
  };
};

export default function ReadmeGeneratorPage() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('octocat');
  const [style, setStyle] = useState<ReadmeStyle>('detailed');
  const [theme, setTheme] = useState('satan');
  const [sections, setSections] = useState<SectionType[]>([
    'header', 'about', 'skills', 'stats', 'projects', 'connect',
  ]);
  const [selectedSection, setSelectedSection] = useState<SectionType>('header');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('content');
  const [mediaBinTab, setMediaBinTab] = useState<MediaBinTab>('profile');
  const [sectionAssets, setSectionAssets] = useState<SectionAssets>({});
  const [careerMode, setCareerMode] = useState(true);
  const [careerRole, setCareerRole] = useState<CareerRole>('fullstack');
  const [agentLoop, setAgentLoop] = useState(true);
  const [useAI, setUseAI] = useState(true);
  const [aiProfileScan, setAiProfileScan] = useState(true);
  const [goal, setGoal] = useState<ReadmeGoal>('get-hired');
  const [structure, setStructure] = useState<ReadmeStructure>('visual');
  const [tone, setTone] = useState<ReadmeTone>('confident');
  const [motionStyle, setMotionStyle] = useState<MotionStyle>('subtle');
  const [typingHeadline, setTypingHeadline] = useState(true);
  const [typingLines, setTypingLines] = useState('Building developer tools\nFull-stack product engineer\nOpen-source enthusiast');
  const [animatedDivider, setAnimatedDivider] = useState(true);
  const [contributionSnake, setContributionSnake] = useState(false);
  const [visitorCounter, setVisitorCounter] = useState(false);
  const [githubTrophies, setGithubTrophies] = useState(false);
  const [avatarBlock, setAvatarBlock] = useState(false);
  const [socialWebsite, setSocialWebsite] = useState('gitskins.com');
  const [socialX, setSocialX] = useState('octocat');
  const [socialLinkedIn, setSocialLinkedIn] = useState('');
  const [socialEmail, setSocialEmail] = useState('');
  const [copiedAnimatedSection, setCopiedAnimatedSection] = useState<AnimatedSection | 'all' | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState<'gemini' | 'gemini_refined' | 'openai' | 'template' | null>(null);
  const [profileData, setProfileData] = useState<{
    name: string | null;
    avatarUrl: string;
    bio: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedSetupPath, setCopiedSetupPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<CanvasView>('preview');
  const [refinementNotes, setRefinementNotes] = useState<string[] | null>(null);
  const [agentReasoning, setAgentReasoning] = useState<string | null>(null);
  const [agentLogExpanded, setAgentLogExpanded] = useState(false);
  const [readmeScore, setReadmeScore] = useState<{
    overall: number;
    profileClarity: number;
    projectProof: number;
    visualConsistency: number;
    recruiterScanability: number;
    suggestions: string[];
  } | null>(null);
  const [strategy, setStrategy] = useState<{
    primaryRole: string;
    strongestSignals: string[];
    weakSignals: string[];
    suggestedTone: string;
    profileGoal: string;
  } | null>(null);
  const [setupInstructions, setSetupInstructions] = useState<{
    title: string;
    description: string;
    files: { path: string; content: string }[];
  } | null>(null);

  const [usageOverride, setUsageOverride] = useState<{ remaining: number; limit: number; plan: 'free' | 'pro'; creditsRemaining?: number } | null>(null);
  const userPlanData = useUserPlan();
  const effectivePlan = usageOverride?.plan ?? userPlanData.plan;
  const effectiveLimit = usageOverride?.limit ?? userPlanData.readmeGenerationsLimit;
  const effectiveRemaining = usageOverride?.remaining ?? userPlanData.readmeGenerationsRemaining;
  const effectiveUsed = Math.max(0, effectiveLimit - effectiveRemaining);
  const effectiveCreditsRemaining = usageOverride?.creditsRemaining ?? userPlanData.creditsRemaining;
  const { loading: planLoading, authenticated } = userPlanData;
  const userIsPro = effectivePlan === 'pro';
  const usageAllowed = authenticated && (userIsPro || effectiveRemaining > 0);
  const selectedTheme = themes.find((item) => item.id === theme) ?? themes[0];
  const selectedGoal = goalOptions.find((item) => item.id === goal) ?? goalOptions[0];
  const selectedRole = careerRoles.find((item) => item.id === careerRole) ?? careerRoles[0];
  const selectedSectionInspector = sectionInspectorCopy[selectedSection];
  const selectedSectionWorkflow = sectionWorkflowCopy[selectedSection];
  const selectedSectionIndex = sections.indexOf(selectedSection);
  const selectedSectionIsIncluded = selectedSectionIndex >= 0;
  const selectedDefaultAssets = defaultSectionAssets[selectedSection] ?? [];
  const selectedManualAssets = sectionAssets[selectedSection] ?? [];
  const selectedSectionAssets = [
    ...selectedDefaultAssets,
    ...selectedManualAssets,
  ].filter((asset, index, assets) => assets.indexOf(asset) === index);

  const readmeStepLabels = useMemo(
    () =>
      careerMode && agentLoop
        ? [aiProfileScan ? 'Scanning profile and projects' : 'Fetching GitHub profile', 'Drafting README', `Refining for ${careerRole}`]
        : [aiProfileScan ? 'Scanning profile and projects' : 'Fetching GitHub profile', 'Drafting README'],
    [careerMode, agentLoop, careerRole, aiProfileScan]
  );
  const readmeProgress = useThinkingProgress(readmeStepLabels, { intervalMs: 1200 });
  const animatedSectionPreview = useMemo(() => {
    const cleanUsername = username.trim() || 'octocat';
    const buildParams = (section: AnimatedSection, absolute = false) => {
      const params = new URLSearchParams({ username: cleanUsername, theme });
      if (section === 'social') {
        if (socialWebsite.trim()) params.set('website', socialWebsite.trim());
        if (socialX.trim()) params.set('x', socialX.trim());
        if (socialLinkedIn.trim()) params.set('linkedin', socialLinkedIn.trim());
        if (socialEmail.trim()) params.set('email', socialEmail.trim());
      }
      const base = absolute ? `https://gitskins.com/api/section/${section}` : `/api/section/${section}`;
      return `${base}?${params.toString()}`;
    };
    return animatedSections.map((section) => {
      const url = buildParams(section.id);
      const absoluteUrl = buildParams(section.id, true);
      return {
        ...section,
        url,
        markdown: `<p align="center">\n  <img src="${absoluteUrl}" alt="${cleanUsername} ${section.label.toLowerCase()} section" />\n</p>`,
      };
    });
  }, [username, theme, socialWebsite, socialX, socialLinkedIn, socialEmail]);

  const getSectionPreviewAssets = useCallback((section: SectionType) => {
    const assets = [
      ...(defaultSectionAssets[section] ?? []),
      ...(sectionAssets[section] ?? []),
    ].filter((asset, index, values) => values.indexOf(asset) === index);

    return assets
      .map((asset) => animatedSectionPreview.find((item) => item.id === asset))
      .filter((asset): asset is (typeof animatedSectionPreview)[number] => Boolean(asset));
  }, [animatedSectionPreview, sectionAssets]);

  const liveDraftReadme = useMemo(() => {
    const cleanUsername = username.trim() || 'octocat';
    const selectedLabels = sections
      .map((section) => availableSections.find((item) => item.id === section)?.label)
      .filter(Boolean);
    const lines = [
      `# ${cleanUsername}`,
      '',
      `> ${selectedGoal.description}.`,
      '',
      `**Theme:** ${selectedTheme.name} · **Style:** ${styleOptions.find((item) => item.id === style)?.label ?? style} · **Agent:** ${careerMode ? selectedRole.label : 'Off'}`,
      '',
      ...sections.flatMap((section) => {
        const label = availableSections.find((item) => item.id === section)?.label ?? section;
        const editingLine = section === selectedSection ? ['> Editing this section in the inspector.'] : [];
        const assetLines = getSectionPreviewAssets(section).flatMap((asset) => ['', asset.markdown]);
        if (section === 'header') {
          return [`## ${label}`, '', ...editingLine, editingLine.length ? '' : null, `Hi, I'm **${cleanUsername}**. This README is tuned for **${selectedGoal.label.toLowerCase()}** with a ${selectedTheme.name} visual system.`, ...assetLines].filter(Boolean) as string[];
        }
        if (section === 'skills') {
          return [`## ${label}`, '', ...editingLine, editingLine.length ? '' : null, `Selected stack and skill badges will be generated from the GitHub profile and README strategy.`, ...assetLines].filter(Boolean) as string[];
        }
        if (section === 'stats') {
          return [`## ${label}`, '', ...editingLine, editingLine.length ? '' : null, `GitSkins stat widgets will use the **${selectedTheme.name}** theme.`, ...assetLines].filter(Boolean) as string[];
        }
        if (section === 'connect') {
          const links = [socialWebsite && `Website: ${socialWebsite}`, socialX && `X: ${socialX}`, socialLinkedIn && `LinkedIn: ${socialLinkedIn}`, socialEmail && `Email: ${socialEmail}`].filter(Boolean);
          return [`## ${label}`, '', ...editingLine, editingLine.length ? '' : null, links.length ? links.join(' · ') : 'Contact and social links will appear here.', ...assetLines].filter(Boolean) as string[];
        }
        return [`## ${label}`, '', ...editingLine, editingLine.length ? '' : null, sectionInspectorCopy[section].description, ...assetLines].filter(Boolean) as string[];
      }),
      '',
      `<!-- Sections: ${selectedLabels.join(', ')} -->`,
    ];
    return lines.join('\n');
  }, [username, sections, selectedSection, selectedGoal, selectedTheme, selectedRole, style, careerMode, socialWebsite, socialX, socialLinkedIn, socialEmail, getSectionPreviewAssets]);

  const livePreviewSections = useMemo<PreviewSection[]>(() => sections.map((section) => ({
    key: `live-${section}`,
    id: section,
    label: availableSections.find((item) => item.id === section)?.label ?? section,
    description: sectionInspectorCopy[section].description,
    assets: getSectionPreviewAssets(section).map((asset) => ({
      id: asset.id,
      label: asset.label,
      url: asset.url,
      alt: `${username.trim() || 'octocat'} ${asset.label.toLowerCase()} GitSkins section`,
    })),
    markdown: '',
    isGenerated: false,
  })), [sections, username, getSectionPreviewAssets]);

  const generatedPreview = useMemo(
    () => (generatedReadme ? parseReadmePreview(generatedReadme) : null),
    [generatedReadme]
  );
  const generationSectionAssets = useMemo(() => sections.reduce<SectionAssets>((acc, section) => {
    const assets = [
      ...(defaultSectionAssets[section] ?? []),
      ...(sectionAssets[section] ?? []),
    ].filter((asset, index, values) => values.indexOf(asset) === index);
    if (assets.length) acc[section] = assets;
    return acc;
  }, {}), [sections, sectionAssets]);
  const readmePreviewSections = generatedPreview?.sections.length ? generatedPreview.sections : livePreviewSections;
  const previewDocumentTitle = generatedPreview?.title || profileData?.name || username.trim() || 'octocat';
  const previewDocumentSummary = generatedPreview?.summary || `${selectedGoal.description}. Built with the ${selectedTheme.name} GitSkins visual system.`;
  const previewDocumentMode = generatedPreview?.sections.length ? 'Generated README' : 'Live GitSkins draft';

  const previewSkills = useMemo(() => {
    if (careerRole === 'frontend') return ['React', 'Next.js', 'TypeScript', 'Design Systems', 'Performance'];
    if (careerRole === 'backend') return ['Node.js', 'Postgres', 'API Design', 'Queues', 'Observability'];
    if (careerRole === 'data') return ['Python', 'SQL', 'Pipelines', 'Analytics', 'ML Systems'];
    if (careerRole === 'mobile') return ['React Native', 'Swift', 'Kotlin', 'Expo', 'App UX'];
    if (careerRole === 'devops') return ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Reliability'];
    if (careerRole === 'product') return ['Product Strategy', 'Experiments', 'UX', 'Analytics', 'Full-Stack'];
    return ['TypeScript', 'Next.js', 'React', 'Node.js', 'Product Engineering'];
  }, [careerRole]);

  const previewProjects = useMemo(() => [
    {
      name: `${username.trim() || 'octocat'}-studio`,
      copy: `A ${selectedGoal.label.toLowerCase()} portfolio project with a polished product surface.`,
      stack: previewSkills.slice(0, 3),
    },
    {
      name: 'developer-tools',
      copy: 'Reusable systems, automation, and GitHub-native workflow improvements.',
      stack: previewSkills.slice(2, 5),
    },
  ], [previewSkills, selectedGoal.label, username]);

  const timelineSections = useMemo(() => {
    const included = sections
      .map((id) => availableSections.find((section) => section.id === id))
      .filter((section): section is (typeof availableSections)[number] => Boolean(section));
    const inactive = availableSections.filter((section) => !sections.includes(section.id));
    return [...included, ...inactive];
  }, [sections]);

  const selectReadmeSection = useCallback((section: SectionType, tab: InspectorTab = 'content') => {
    setSelectedSection(section);
    setInspectorTab(tab);
    window.requestAnimationFrame(() => {
      document
        .querySelector(`[data-readme-section="${section}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  const aiScanSignals = useMemo(() => {
    const enabled = useAI && aiProfileScan;
    const visuals = Object.values(generationSectionAssets).flat().length;
    return [
      { label: 'Profile source', value: enabled ? `${username.trim() || 'octocat'} public GitHub profile` : 'Basic profile fields' },
      { label: 'Narrative target', value: selectedGoal.label },
      { label: 'Role inference', value: careerMode ? selectedRole.label : 'General developer profile' },
      { label: 'Project proof', value: enabled ? 'Pinned repos, stars, languages, descriptions' : 'Only explicit project data' },
      { label: 'Visual system', value: `${selectedTheme.name} with ${visuals || 'default'} visual cue${visuals === 1 ? '' : 's'}` },
    ];
  }, [aiProfileScan, careerMode, generationSectionAssets, selectedGoal.label, selectedRole.label, selectedTheme.name, useAI, username]);


  useEffect(() => {
    const careerParam = searchParams.get('careerMode');
    const roleParam = searchParams.get('role') as CareerRole | null;
    if (careerParam === '1') {
      setCareerMode(true);
      if (roleParam) {
        setCareerRole(roleParam);
      }
    }
  }, [searchParams]);

  const toggleSection = (sectionId: SectionType) => {
    selectReadmeSection(sectionId);
    setSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const moveSelectedSection = (direction: -1 | 1) => {
    setSections((prev) => {
      const fromIndex = prev.indexOf(selectedSection);
      const toIndex = fromIndex + direction;
      if (fromIndex < 0 || toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  };

  const insertAssetIntoSelectedSection = (asset: AnimatedSection) => {
    setInspectorTab('content');
    setSections((prev) => (prev.includes(selectedSection) ? prev : [...prev, selectedSection]));
    setSectionAssets((prev) => {
      const current = prev[selectedSection] ?? [];
      if (current.includes(asset)) return prev;
      return {
        ...prev,
        [selectedSection]: [...current, asset],
      };
    });
  };

  const removeAssetFromSelectedSection = (asset: AnimatedSection) => {
    setSectionAssets((prev) => {
      const current = prev[selectedSection] ?? [];
      const nextAssets = current.filter((item) => item !== asset);
      return {
        ...prev,
        [selectedSection]: nextAssets,
      };
    });
  };

  const isThemeLocked = (themeId: string): boolean => {
    if (userIsPro) return false;
    return !FREE_THEMES.includes(themeId as typeof FREE_THEMES[number]);
  };

  const generateReadme = useCallback(async () => {
    if (!authenticated) {
      window.location.href = '/auth';
      return;
    }

    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setIsLoading(true);
    setUsageOverride(null);
    setError(null);
    setGeneratedReadme(null);
    setAiProvider(null);
    setRefinementNotes(null);
    setAgentReasoning(null);
    setReadmeScore(null);
    setStrategy(null);
    setSetupInstructions(null);
    readmeProgress.start();

    try {
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          sections,
          style,
          theme,
          careerMode,
          careerRole,
          agentLoop,
          useAI,
          aiProfileScan,
          goal,
          structure,
          tone,
          motionStyle,
          typingHeadline: motionStyle !== 'none' && typingHeadline,
          typingLines: typingLines.split('\n').map((line) => line.trim()).filter(Boolean),
          animatedDivider: motionStyle !== 'none' && animatedDivider,
          contributionSnake: motionStyle !== 'none' && contributionSnake,
          skillBadges: true,
          visitorCounter: motionStyle !== 'none' && visitorCounter,
          githubTrophies: motionStyle === 'playful' && githubTrophies,
          avatarBlock: motionStyle !== 'none' && avatarBlock,
          socialWebsite,
          socialX,
          socialLinkedIn,
          socialEmail,
          sectionAssets: generationSectionAssets,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      setRefinementNotes(Array.isArray(data.refinementNotes) ? data.refinementNotes.map(toDisplayText) : null);
      setAgentReasoning(typeof data.reasoning === 'string' ? data.reasoning : null);
      setGeneratedReadme(data.readme);
      setAiProvider(data.aiProvider || null);
      setProfileData(data.profile);
      setReadmeScore(data.score ?? null);
      setStrategy(data.strategy ?? null);
      setSetupInstructions(data.setupInstructions ?? null);
      if (data.usage && typeof data.usage.remaining === 'number') {
        setUsageOverride(data.usage);
        invalidateUserPlanCache();
      }
      readmeProgress.complete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      readmeProgress.reset();
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, username, sections, style, theme, careerMode, careerRole, agentLoop, useAI, aiProfileScan, goal, structure, tone, motionStyle, typingHeadline, typingLines, animatedDivider, contributionSnake, visitorCounter, githubTrophies, avatarBlock, socialWebsite, socialX, socialLinkedIn, socialEmail, generationSectionAssets, readmeProgress.start, readmeProgress.complete, readmeProgress.reset]);

  const copyToClipboard = async () => {
    const markdown = generatedReadme ?? liveDraftReadme;
    if (!markdown) return;

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = markdown;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copySetupFile = async (path: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedSetupPath(path);
    setTimeout(() => setCopiedSetupPath(null), 2000);
  };

  const copyAnimatedSection = async (section: AnimatedSection | 'all') => {
    const markdown = section === 'all'
      ? animatedSectionPreview.map((item) => item.markdown).join('\n\n')
      : animatedSectionPreview.find((item) => item.id === section)?.markdown;
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setCopiedAnimatedSection(section);
    setTimeout(() => setCopiedAnimatedSection(null), 2000);
  };

  const downloadReadme = () => {
    const markdown = generatedReadme ?? liveDraftReadme;
    if (!markdown) return;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        color: '#fafafa',
      }}
    >

      <main style={{ paddingTop: '82px', paddingBottom: '10px' }}>
        {/* Hero Section */}
        <section
          className="readme-hero-intro"
          style={{
            padding: '20px 24px 48px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '100px',
                fontSize: '13px',
                color: '#22c55e',
                marginBottom: '24px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              AI profile writing studio
            </div>

            <h1
              style={{
                fontSize: 'clamp(38px, 6vw, 66px)',
                fontWeight: 900,
                margin: 0,
                marginBottom: '16px',
                letterSpacing: '-0.055em',
                lineHeight: 0.96,
              }}
            >
              Build a README that reads like a product story.
            </h1>

            <p
              style={{
                fontSize: '17px',
                color: '#a1a1a1',
                margin: '0 auto',
                maxWidth: '620px',
                lineHeight: 1.6,
              }}
            >
              Turn your repositories, skills, and profile signal into a polished GitHub README with themed cards, sections, and copy-ready Markdown.
            </p>
            <a
              href="/readme-agent"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '16px',
                padding: '8px 16px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Open the Live README Agent
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </section>

        {/* Usage Banner */}
        {!planLoading && (
          <section className="readme-usage-banner" style={{ maxWidth: '1180px', margin: '0 auto 24px', padding: '0 20px' }}>
            <div
              style={{
                background: !authenticated ? 'rgba(34, 197, 94, 0.08)' : !usageAllowed ? 'rgba(239, 68, 68, 0.1)' : '#161616',
                border: `1px solid ${!authenticated ? 'rgba(34, 197, 94, 0.22)' : !usageAllowed ? 'rgba(239, 68, 68, 0.3)' : '#2a2a2a'}`,
                borderRadius: '12px',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {!authenticated ? (
                  <span style={{ fontSize: '14px', color: '#aaa' }}>
                    Sign in to use your 5 free README generations.
                  </span>
                ) : userIsPro ? (
                  <span style={{ fontSize: '14px', color: '#888' }}>
                    Generations today:{' '}
                    <span style={{ color: effectiveRemaining > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                      {effectiveRemaining}/{effectiveLimit}
                    </span>
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: '14px', color: '#888' }}>
                      Generations this month:{' '}
                      <span style={{ color: effectiveRemaining > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                        {effectiveRemaining}/{effectiveLimit}
                      </span>
                      {effectiveCreditsRemaining ? (
                        <span style={{ color: '#58a6ff', marginLeft: 8 }}>
                          + {effectiveCreditsRemaining} paid credit{effectiveCreditsRemaining === 1 ? '' : 's'}
                        </span>
                      ) : null}
                    </span>
                    {/* Progress bar */}
                    <div style={{ width: '120px', height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${effectiveLimit > 0 ? Math.min(100, (effectiveUsed / effectiveLimit) * 100) : 0}%`,
                        background: effectiveRemaining > 0 ? '#22c55e' : '#ef4444',
                        borderRadius: '2px',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </>
                )}
              </div>

              <span
                style={{
                  padding: '6px 12px',
                  background: userIsPro || !authenticated ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: userIsPro || !authenticated ? '#22c55e' : '#666',
                  fontWeight: 600,
                }}
              >
                {!authenticated ? 'Sign in required' : userIsPro ? 'Pro Plan' : 'Free Plan'}
              </span>
            </div>
          </section>
        )}

        <section className="readme-summary-section" style={{ maxWidth: '1180px', margin: '0 auto 24px', padding: '0 20px' }}>
          <div className="readme-summary-strip">
            {[
              ['Profile', username.trim() || 'octocat'],
              ['Goal', selectedGoal.label],
              ['Theme', selectedTheme.name],
              ['Agent', careerMode ? selectedRole.label : 'Off'],
            ].map(([label, value]) => (
              <div key={label} className="readme-summary-card">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Generator Form */}
        <section className="readme-editor-section" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
          <div className="readme-video-editor-shell" data-testid="readme-editor-shell">
            <div className="readme-video-topbar" data-testid="readme-editor-topbar">
              <div className="readme-studio-brand">GitSkins README Generator</div>
              <div className="readme-studio-context">
                <span>Editing</span>
                <strong>{username.trim() || 'octocat'} / README.md</strong>
                <div>
                  <small>{selectedGoal.label}</small>
                  <small>{selectedTheme.name}</small>
                  <small>{careerMode ? selectedRole.label : 'Agent off'}</small>
                </div>
              </div>
              <div className="readme-topbar-actions" data-testid="readme-editor-actions">
                <span className="readme-draft-state">{generatedReadme ? 'Generated' : 'Live draft'}</span>
                <button type="button" onClick={copyToClipboard} data-testid="readme-copy-markdown">
                  {copied ? 'Copied' : 'Copy Markdown'}
                </button>
                <button
                  type="button"
                  onClick={generateReadme}
                  disabled={isLoading || !username.trim() || (authenticated && !usageAllowed)}
                  data-testid="readme-export-action"
                >
                  {isLoading ? 'Rendering...' : !authenticated ? 'Sign in to export' : 'Export README'}
                </button>
              </div>
            </div>

            <aside className="readme-media-bin" data-testid="readme-media-bin">
              <div className="readme-panel-tabs">
                {[
                  ['profile', 'Profile'],
                  ['visuals', 'Visuals'],
                  ['links', 'Links'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={`${label} media bin`}
                    onClick={() => setMediaBinTab(id as MediaBinTab)}
                    className={mediaBinTab === id ? 'active' : ''}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {mediaBinTab === 'profile' && (
                <div className="readme-media-tab-panel">
                  <label className="readme-editor-field">
                    <span>GitHub Username</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="octocat"
                      onKeyDown={(e) => e.key === 'Enter' && generateReadme()}
                    />
                  </label>
                  <div className="readme-mini-summary">
                    <span>Current target</span>
                    <strong>{username.trim() || 'octocat'} / README.md</strong>
                    <p>{selectedGoal.description}</p>
                  </div>
                  <div className="readme-profile-scan-panel">
                    <span>AI scan sources</span>
                    {aiScanSignals.slice(0, 4).map((signal) => (
                      <div key={signal.label}>
                        <small>{signal.label}</small>
                        <strong>{signal.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mediaBinTab === 'visuals' && (
                <div className="readme-media-tab-panel">
                  <div className="readme-bin-grid">
                    {themes.map((item) => {
                      const locked = isThemeLocked(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => !locked && setTheme(item.id)}
                          disabled={locked}
                          className={theme === item.id ? 'active' : ''}
                          style={{ '--theme-color': item.color } as CSSProperties}
                        >
                          <span />
                          {item.name}
                          {locked ? <small>Pro</small> : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="readme-asset-snippets">
                    <h3>Animated Assets</h3>
                    {animatedSectionPreview.map((section) => {
                      const isDefaultAsset = selectedDefaultAssets.includes(section.id);
                      const isManualAsset = selectedManualAssets.includes(section.id);
                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => insertAssetIntoSelectedSection(section.id)}
                          disabled={isDefaultAsset || isManualAsset}
                          className={isDefaultAsset ? 'default' : isManualAsset ? 'active' : ''}
                        >
                          <span>{section.label}</span>
                          <small>{isDefaultAsset ? 'Default visual' : isManualAsset ? 'Added' : `Add to ${selectedSectionInspector.title}`}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mediaBinTab === 'links' && (
                <div className="readme-media-tab-panel">
                  {[
                    ['Website', socialWebsite, setSocialWebsite, 'gitskins.com'],
                    ['X', socialX, setSocialX, 'octocat'],
                    ['LinkedIn', socialLinkedIn, setSocialLinkedIn, 'in/username'],
                    ['Email', socialEmail, setSocialEmail, 'hello@example.com'],
                  ].map(([label, value, setter, placeholder]) => (
                    <label key={label as string} className="readme-editor-field compact">
                      <span>{label as string}</span>
                      <input
                        type="text"
                        value={value as string}
                        onChange={(event) => (setter as (next: string) => void)(event.target.value)}
                        placeholder={placeholder as string}
                      />
                    </label>
                  ))}
                </div>
              )}
            </aside>

            <section className="readme-player-monitor" data-testid="readme-preview-monitor">
              <div className="readme-monitor-header">
                <span>README Preview</span>
                <strong>Editing: {selectedSectionInspector.title}</strong>
                <div className="readme-monitor-actions">
                  {[
                    ['preview', 'Preview'],
                    ['github', 'GitHub view'],
                    ['markdown', 'Markdown'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-label={`${label} canvas`}
                      onClick={() => setViewMode(id as CanvasView)}
                      className={viewMode === id ? 'active' : ''}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="readme-document-frame">
                {viewMode !== 'markdown' ? (
                  <div
                    className={`readme-document-preview readme-gitskins-preview ${viewMode === 'github' ? 'github-mode' : ''}`}
                    data-testid="readme-generated-preview"
                  >
                    <div className="readme-preview-sourcebar">
                      <span>{previewDocumentMode}</span>
                      <strong>{generatedReadme ? 'Rendering exported markdown' : 'Updates as you edit controls'}</strong>
                    </div>
                    <div className="readme-preview-profile">
                      <img
                        src={profileData?.avatarUrl || `https://github.com/${username.trim() || 'octocat'}.png`}
                        alt={`${username.trim() || 'octocat'} GitHub avatar`}
                      />
                      <div>
                        <span>{previewDocumentMode}</span>
                        <h1>{previewDocumentTitle}</h1>
                        <p>{previewDocumentSummary}</p>
                      </div>
                    </div>

                    {readmePreviewSections.map((section) => (
                      <section
                        key={section.key}
                        className={`readme-preview-section ${section.id === selectedSection ? 'selected' : ''}`}
                        data-section={section.id}
                        data-readme-section={section.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectReadmeSection(section.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            selectReadmeSection(section.id);
                          }
                        }}
                      >
                        <div className="readme-preview-section-heading">
                          <span>{section.label}</span>
                          <small>{section.assets.length ? `${section.assets.length} visual${section.assets.length === 1 ? '' : 's'}` : 'Text block'}</small>
                          {section.id === selectedSection ? <strong>{section.isGenerated ? 'Viewing' : 'Editing'}</strong> : null}
                        </div>

                        {section.assets.length > 0 && (
                          <div className="readme-preview-visual-stack">
                            {section.assets.map((asset) => (
                              <img
                                key={asset.id}
                                src={asset.url}
                                alt={asset.alt}
                              />
                            ))}
                          </div>
                        )}

                        {section.isGenerated && section.markdown && (
                          <div className="readme-preview-markdown">
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                              {section.markdown}
                            </ReactMarkdown>
                          </div>
                        )}

                        {!section.isGenerated && section.id === 'header' && (
                          <p>
                            Hi, I&apos;m <strong>{profileData?.name || username.trim() || 'octocat'}</strong>, a {selectedRole.label.toLowerCase()} focused on {selectedGoal.description.toLowerCase()}.
                          </p>
                        )}

                        {!section.isGenerated && section.id === 'about' && (
                          <div className="readme-preview-callout">
                            <strong>{selectedRole.label}</strong>
                            <p>{section.description} The copy is tuned for a {toneOptions.find((item) => item.id === tone)?.label.toLowerCase() ?? tone} tone and a {styleOptions.find((item) => item.id === style)?.label.toLowerCase() ?? style} README.</p>
                          </div>
                        )}

                        {!section.isGenerated && section.id === 'skills' && (
                          <div className="readme-preview-pills">
                            {previewSkills.map((skill) => (
                              <span key={skill}>{skill}</span>
                            ))}
                          </div>
                        )}

                        {!section.isGenerated && section.id === 'stats' && (
                          <div className="readme-preview-metrics">
                            <div>
                              <strong>{selectedTheme.name}</strong>
                              <span>Theme</span>
                            </div>
                            <div>
                              <strong>{motionStyle}</strong>
                              <span>Motion</span>
                            </div>
                            <div>
                              <strong>{sections.length}</strong>
                              <span>Sections</span>
                            </div>
                          </div>
                        )}

                        {!section.isGenerated && section.id === 'projects' && (
                          <div className="readme-preview-projects">
                            {previewProjects.map((project) => (
                              <article key={project.name}>
                                <strong>{project.name}</strong>
                                <p>{project.copy}</p>
                                <div>
                                  {project.stack.map((item) => (
                                    <span key={item}>{item}</span>
                                  ))}
                                </div>
                              </article>
                            ))}
                          </div>
                        )}

                        {!section.isGenerated && section.id === 'streak' && (
                          <div className="readme-preview-activity">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <p>Contribution consistency and momentum signals appear here when the section is enabled.</p>
                          </div>
                        )}

                        {!section.isGenerated && section.id === 'connect' && (
                          <div className="readme-preview-links">
                            {socialWebsite ? <span>Website: {socialWebsite}</span> : null}
                            {socialX ? <span>X: {socialX}</span> : null}
                            {socialLinkedIn ? <span>LinkedIn: {socialLinkedIn}</span> : null}
                            {socialEmail ? <span>Email: {socialEmail}</span> : null}
                            {!socialWebsite && !socialX && !socialLinkedIn && !socialEmail ? <span>Contact links will appear here.</span> : null}
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                ) : (
                  <pre className="readme-document-code">{generatedReadme ?? liveDraftReadme}</pre>
                )}
              </div>
            </section>

            <aside className="readme-properties-panel" data-testid="readme-properties-panel">
              <div className="readme-panel-tabs">
                {[
                  ['content', 'Content'],
                  ['style', 'Style'],
                  ['agent', 'Agent'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={`${label} inspector`}
                    onClick={() => setInspectorTab(id as InspectorTab)}
                    className={inspectorTab === id ? 'active' : ''}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {inspectorTab === 'content' && (
                <>
                  <div className="readme-selected-section">
                    <span>Selected Section</span>
                    <h3>{selectedSectionInspector.title}</h3>
                    <p>{selectedSectionInspector.description}</p>
                    <button
                      type="button"
                      onClick={() => toggleSection(selectedSection)}
                      className={sections.includes(selectedSection) ? 'active' : ''}
                    >
                      {sections.includes(selectedSection) ? 'Included in README' : 'Add to README'}
                    </button>
                    <div className="readme-section-order-controls">
                      <button
                        type="button"
                        onClick={() => moveSelectedSection(-1)}
                        disabled={!selectedSectionIsIncluded || selectedSectionIndex <= 0}
                      >
                        Move earlier
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSelectedSection(1)}
                        disabled={!selectedSectionIsIncluded || selectedSectionIndex >= sections.length - 1}
                      >
                        Move later
                      </button>
                    </div>
                    <div>
                      {selectedSectionInspector.controls.map((control) => (
                        <strong key={control}>{control}</strong>
                      ))}
                    </div>
                    <div className="readme-section-brief">
                      <span>Section brief</span>
                      <div>
                        <small>Focus</small>
                        <p>{selectedSectionWorkflow.focus}</p>
                      </div>
                      <div>
                        <small>AI handling</small>
                        <p>{selectedSectionWorkflow.ai}</p>
                      </div>
                      <div>
                        <small>Output</small>
                        <p>{selectedSectionWorkflow.output}</p>
                      </div>
                    </div>
                    <div className="readme-inserted-assets">
                      <span>Visuals in this section</span>
                      {selectedSectionAssets.length ? (
                        selectedSectionAssets.map((asset) => {
                          const assetLabel = animatedSections.find((item) => item.id === asset)?.label ?? asset;
                          const isDefaultAsset = selectedDefaultAssets.includes(asset);
                          return (
                            <button
                              key={asset}
                              type="button"
                              onClick={() => !isDefaultAsset && removeAssetFromSelectedSection(asset)}
                              disabled={isDefaultAsset}
                              className={isDefaultAsset ? 'default' : ''}
                            >
                              {assetLabel}
                              <small>{isDefaultAsset ? 'Default' : 'Remove'}</small>
                            </button>
                          );
                        })
                      ) : (
                        <p>No visuals in this section.</p>
                      )}
                    </div>
                  </div>

                  <div className="readme-property-group">
                    <h3>README Goal</h3>
                    <div className="readme-option-stack">
                      {goalOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setGoal(option.id)}
                          className={goal === option.id ? 'active' : ''}
                        >
                          <strong>{option.label}</strong>
                          <span>{option.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedSection === 'connect' && (
                    <div className="readme-property-group">
                      <h3>Social Links</h3>
                      {[
                        ['Website', socialWebsite, setSocialWebsite, 'gitskins.com'],
                        ['X', socialX, setSocialX, 'octocat'],
                        ['LinkedIn', socialLinkedIn, setSocialLinkedIn, 'in/username'],
                        ['Email', socialEmail, setSocialEmail, 'hello@example.com'],
                      ].map(([label, value, setter, placeholder]) => (
                        <label key={label as string} className="readme-editor-field compact">
                          <span>{label as string}</span>
                          <input
                            type="text"
                            value={value as string}
                            onChange={(event) => (setter as (next: string) => void)(event.target.value)}
                            placeholder={placeholder as string}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </>
              )}

              {inspectorTab === 'style' && (
                <>
                  <div className="readme-property-group">
                    <h3>Style</h3>
                    <div className="readme-segmented">
                      {styleOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setStyle(option.id)}
                          className={style === option.id ? 'active' : ''}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="readme-property-group">
                    <h3>Structure</h3>
                    <div className="readme-token-list">
                      {structureOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setStructure(option.id)}
                          className={structure === option.id ? 'active' : ''}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="readme-property-group">
                    <h3>Motion</h3>
                    <div className="readme-option-stack compact">
                      {motionOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setMotionStyle(option.id)}
                          className={motionStyle === option.id ? 'active' : ''}
                        >
                          <strong>{option.label}</strong>
                          <span>{option.description}</span>
                        </button>
                      ))}
                    </div>
                    {motionStyle !== 'none' && (
                      <div className="readme-toggle-stack">
                        {[
                          ['Typing headline', typingHeadline, setTypingHeadline],
                          ['Animated divider', animatedDivider, setAnimatedDivider],
                          ['Avatar block', avatarBlock, setAvatarBlock],
                          ['Visitor counter', visitorCounter, setVisitorCounter],
                          ['Contribution snake', contributionSnake, setContributionSnake],
                        ].map(([label, checked, setter]) => (
                          <label key={label as string} className="readme-editor-check">
                            <span>{label as string}</span>
                            <input type="checkbox" checked={checked as boolean} onChange={(event) => (setter as (next: boolean) => void)(event.target.checked)} />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {inspectorTab === 'agent' && (
                <>
                  <div className="readme-property-group">
                    <h3>Career Agent</h3>
                    <label className="readme-editor-check">
                      <span>Career mode</span>
                      <input type="checkbox" checked={careerMode} onChange={(e) => setCareerMode(e.target.checked)} />
                    </label>
                    <label className="readme-editor-check">
                      <span>Agent refinement</span>
                      <input type="checkbox" checked={agentLoop} onChange={(e) => setAgentLoop(e.target.checked)} />
                    </label>
                    <select value={careerRole} onChange={(event) => setCareerRole(event.target.value as CareerRole)}>
                      {careerRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="readme-editor-check">
                    <span>Use AI Enhancement</span>
                    <input type="checkbox" checked={useAI} onChange={(e) => setUseAI(e.target.checked)} />
                  </label>
                  <div className="readme-ai-scan-card">
                    <div>
                      <strong>AI profile scan</strong>
                      <span>Reads public GitHub profile data, pinned projects, languages, stars, and repo descriptions before writing.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiProfileScan}
                      disabled={!useAI}
                      onChange={(event) => setAiProfileScan(event.target.checked)}
                    />
                  </div>
                  <div className="readme-ai-scan-evidence">
                    <span>Scan evidence</span>
                    {aiScanSignals.map((signal) => (
                      <div key={signal.label}>
                        <small>{signal.label}</small>
                        <strong>{signal.value}</strong>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {isLoading && (
                <ThinkingProgress
                  steps={readmeProgress.steps}
                  activeIndex={readmeProgress.activeIndex}
                  variant="card"
                />
              )}
              {error && <div className="readme-editor-error">{error}</div>}
            </aside>

            <section className="readme-editor-timeline">
              <div className="readme-timeline-toolbar">
                <strong>README Sections</strong>
                <span>Select a section to edit it</span>
              </div>
              <div className="readme-track">
                {timelineSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => selectReadmeSection(section.id)}
                    className={`${sections.includes(section.id) ? 'active' : ''} ${selectedSection === section.id ? 'selected' : ''}`.trim()}
                    title={section.description}
                  >
                    <span>{sections.includes(section.id) ? '✓' : ''}</span>
                    <strong>{section.label}</strong>
                    <small>{getSectionPreviewAssets(section.id).length ? `${getSectionPreviewAssets(section.id).length} visual assets` : section.description}</small>
                  </button>
                ))}
              </div>
            </section>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 20px',
          borderTop: '1px solid #1a1a1a',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#444', fontSize: '14px', margin: 0 }}>
          GitSkins - Beautiful GitHub README Widgets
        </p>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .readme-hero-intro,
        .readme-summary-section {
          display: none;
        }

        .readme-usage-banner {
          display: none;
        }

        .readme-usage-banner > div {
          border-radius: 6px !important;
          padding: 8px 12px !important;
        }

        .readme-editor-section {
          max-width: none !important;
          padding: 0 8px 8px !important;
        }

        .readme-video-editor-shell {
          background: #101010;
          border: 1px solid #252525;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 310px minmax(560px, 1fr) 320px;
          grid-template-rows: 56px minmax(0, 1fr) 188px;
          gap: 1px;
          height: calc(100vh - 18px);
          min-height: 740px;
          overflow: hidden;
        }

        .readme-video-topbar {
          grid-column: 1 / -1;
          align-items: center;
          background: #080808;
          border-bottom: 1px solid #252525;
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr) auto;
          gap: 16px;
          padding: 0 12px;
        }

        .readme-studio-brand {
          color: #f5f5f5;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        .readme-video-topbar > div:nth-child(2) {
          text-align: center;
        }

        .readme-studio-context div {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-top: 6px;
        }

        .readme-studio-context small {
          background: #151515;
          border: 1px solid #2b2b2b;
          border-radius: 999px;
          color: #9ca3af;
          font-size: 10px;
          font-weight: 900;
          line-height: 1;
          padding: 5px 8px;
        }

        .readme-video-topbar span,
        .readme-monitor-header span,
        .readme-timeline-toolbar span {
          color: #7a7a7a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .readme-video-topbar strong,
        .readme-monitor-header strong {
          color: #f5f5f5;
          display: block;
          font-size: 13px;
          font-weight: 800;
          margin-top: 2px;
        }

        .readme-topbar-actions {
          align-items: center;
          display: flex;
          gap: 8px;
          justify-self: end;
        }

        .readme-draft-state {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid #303030;
          border-radius: 4px;
          color: #a8a8a8;
          font-size: 11px;
          font-weight: 900;
          line-height: 1;
          padding: 8px 10px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .readme-video-topbar button {
          background: #28d89c;
          border: none;
          border-radius: 4px;
          color: #04110c;
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
          padding: 9px 12px;
        }

        .readme-topbar-actions [data-testid="readme-copy-markdown"] {
          background: #151515;
          border: 1px solid #303030;
          color: #f5f5f5;
        }

        .readme-video-topbar button:disabled {
          background: #333;
          color: #888;
          cursor: not-allowed;
        }

        .readme-media-bin,
        .readme-player-monitor,
        .readme-properties-panel,
        .readme-editor-timeline {
          background: #191919;
          min-width: 0;
          min-height: 0;
        }

        .readme-media-bin,
        .readme-properties-panel {
          overflow: auto;
          padding: 14px;
        }

        .readme-panel-tabs {
          display: flex;
          gap: 18px;
          margin-bottom: 14px;
          white-space: nowrap;
        }

        .readme-panel-tabs span,
        .readme-panel-tabs button {
          background: transparent;
          border: none;
          color: #8d8d8d;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          padding: 0;
        }

        .readme-panel-tabs .active,
        .readme-panel-tabs button.active {
          color: #28d89c;
        }

        .readme-media-tab-panel {
          display: grid;
          gap: 14px;
        }

        .readme-mini-summary {
          background: #101010;
          border: 1px solid #303030;
          border-radius: 7px;
          display: grid;
          gap: 6px;
          padding: 12px;
        }

        .readme-mini-summary span {
          color: #777;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .readme-mini-summary strong {
          color: #e8e8e8;
          font-size: 13px;
        }

        .readme-mini-summary p {
          color: #8d8d8d;
          font-size: 12px;
          line-height: 1.45;
          margin: 0;
        }

        .readme-profile-scan-panel {
          background: #101010;
          border: 1px solid #303030;
          border-radius: 7px;
          display: grid;
          gap: 8px;
          padding: 12px;
        }

        .readme-profile-scan-panel > span {
          color: #58a6ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .readme-profile-scan-panel div {
          border-top: 1px solid #242424;
          display: grid;
          gap: 3px;
          padding-top: 8px;
        }

        .readme-profile-scan-panel div:first-of-type {
          border-top: none;
          padding-top: 0;
        }

        .readme-profile-scan-panel small {
          color: #8aa4c7;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .readme-profile-scan-panel strong {
          color: #dbeafe;
          font-size: 12px;
          line-height: 1.35;
        }

        .readme-editor-field {
          display: grid;
          gap: 8px;
          margin-bottom: 14px;
        }

        .readme-editor-field.compact {
          margin-bottom: 8px;
        }

        .readme-editor-field span,
        .readme-property-group h3 {
          color: #e8e8e8;
          font-size: 13px;
          font-weight: 900;
          margin: 0;
        }

        .readme-editor-field input,
        .readme-property-group select {
          background: #0f0f0f;
          border: 1px solid #303030;
          border-radius: 6px;
          color: #fff;
          font-size: 13px;
          outline: none;
          padding: 11px 12px;
          width: 100%;
        }

        .readme-bin-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .readme-bin-grid button {
          aspect-ratio: 1.35;
          background: #111;
          border: 1px solid #303030;
          border-radius: 7px;
          color: #aaa;
          cursor: pointer;
          display: grid;
          font-size: 12px;
          font-weight: 800;
          gap: 8px;
          justify-items: start;
          padding: 10px;
          text-align: left;
        }

        .readme-bin-grid button span {
          background:
            radial-gradient(circle at 30% 30%, var(--theme-color), transparent 44%),
            linear-gradient(135deg, #202020, #070707);
          border-radius: 5px;
          display: block;
          height: 42px;
          width: 100%;
        }

        .readme-bin-grid button.active {
          border-color: var(--theme-color);
          color: #fff;
        }

        .readme-bin-grid button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .readme-bin-grid small {
          color: #666;
          font-size: 10px;
          text-transform: uppercase;
        }

        .readme-asset-snippets {
          border-top: 1px solid #2b2b2b;
          display: grid;
          gap: 8px;
          margin-top: 16px;
          padding-top: 16px;
        }

        .readme-asset-snippets h3 {
          color: #e8e8e8;
          font-size: 13px;
          font-weight: 900;
          margin: 0 0 4px;
        }

        .readme-asset-snippets button {
          align-items: center;
          background: #101010;
          border: 1px solid #303030;
          border-radius: 6px;
          color: #d8d8d8;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 10px;
          text-align: left;
        }

        .readme-asset-snippets button.default,
        .readme-asset-snippets button.active {
          background: rgba(40, 216, 156, 0.07);
          border-color: rgba(40, 216, 156, 0.24);
        }

        .readme-asset-snippets button:disabled {
          cursor: default;
        }

        .readme-asset-snippets button span {
          font-size: 12px;
          font-weight: 900;
        }

        .readme-asset-snippets button small {
          color: #28d89c;
          font-size: 11px;
          font-weight: 800;
        }

        .readme-player-monitor {
          display: grid;
          grid-template-rows: 42px minmax(0, 1fr);
          padding: 12px;
        }

        .readme-monitor-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .readme-monitor-actions {
          display: flex;
          gap: 6px;
        }

        .readme-monitor-actions button {
          background: #101010;
          border: 1px solid #303030;
          border-radius: 5px;
          color: #999;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 9px;
        }

        .readme-monitor-actions button.active {
          background: rgba(40,216,156,0.12);
          border-color: #28d89c;
          color: #28d89c;
        }

        .readme-document-frame {
          align-items: center;
          background:
            radial-gradient(circle at 50% 0%, rgba(88, 166, 255, 0.08), transparent 35%),
            #080808;
          border: 1px solid #2c2c2c;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          overflow: auto;
          padding: 18px;
        }

        .readme-document-preview,
        .readme-document-code,
        .readme-document-empty {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.45);
          color: #c9d1d9;
          height: 100%;
          max-width: 920px;
          overflow: auto;
          padding: 28px;
          width: 100%;
        }

        .readme-gitskins-preview.github-mode {
          background: #0d1117;
          border-color: #30363d;
          box-shadow: 0 0 0 1px rgba(88, 166, 255, 0.08), 0 24px 80px rgba(0,0,0,0.48);
          max-width: 980px;
        }

        .readme-gitskins-preview.github-mode .readme-preview-sourcebar {
          background: #161b22;
          border-color: #30363d;
        }

        .readme-document-preview {
          font-size: 14px;
          line-height: 1.65;
        }

        .readme-document-preview h1,
        .readme-document-preview h2,
        .readme-document-preview h3 {
          color: #f0f6fc;
        }

        .readme-document-preview a {
          color: #58a6ff;
        }

        .readme-document-preview blockquote {
          background: rgba(40,216,156,0.08);
          border-left: 3px solid #28d89c;
          border-radius: 6px;
          color: #9ff5d7;
          margin: 12px 0;
          padding: 10px 12px;
        }

        .readme-document-preview img {
          display: block;
          max-width: 100%;
        }

        .readme-gitskins-preview {
          background:
            linear-gradient(180deg, rgba(13,17,23,0.98), rgba(10,13,18,0.98)),
            #0d1117;
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 22px;
        }

        .readme-preview-sourcebar {
          align-items: center;
          background: rgba(88, 166, 255, 0.06);
          border: 1px solid rgba(88, 166, 255, 0.18);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
        }

        .readme-preview-sourcebar span {
          color: #58a6ff;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .readme-preview-sourcebar strong {
          color: #c9d1d9;
          font-size: 12px;
          font-weight: 800;
          text-align: right;
        }

        .readme-preview-profile {
          align-items: center;
          border-bottom: 1px solid #30363d;
          display: grid;
          gap: 16px;
          grid-template-columns: 72px minmax(0, 1fr);
          padding-bottom: 18px;
        }

        .readme-preview-profile img {
          aspect-ratio: 1;
          border: 1px solid #30363d;
          border-radius: 50%;
          object-fit: cover;
          width: 72px;
        }

        .readme-preview-profile span,
        .readme-preview-section-heading span {
          color: #28d89c;
          display: block;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .readme-preview-profile h1 {
          color: #f0f6fc;
          font-size: 30px;
          line-height: 1.08;
          margin: 2px 0 8px;
        }

        .readme-preview-profile p,
        .readme-preview-section p {
          color: #8b949e;
          margin: 0;
        }

        .readme-preview-section {
          background: rgba(255, 255, 255, 0.018);
          border: 1px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          display: grid;
          gap: 14px;
          outline: none;
          padding: 14px;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }

        .readme-preview-section:hover,
        .readme-preview-section:focus-visible {
          border-color: rgba(40, 216, 156, 0.34);
          background: rgba(40, 216, 156, 0.045);
        }

        .readme-preview-section.selected {
          border-color: rgba(40, 216, 156, 0.68);
          box-shadow: 0 0 0 1px rgba(40, 216, 156, 0.1), 0 18px 60px rgba(0, 0, 0, 0.24);
        }

        .readme-preview-section-heading {
          align-items: center;
          display: flex;
          gap: 8px;
          justify-content: space-between;
          min-height: 20px;
        }

        .readme-preview-section-heading small {
          color: #6e7681;
          font-size: 11px;
          font-weight: 800;
          margin-left: auto;
        }

        .readme-preview-section-heading strong {
          background: rgba(40, 216, 156, 0.12);
          border: 1px solid rgba(40, 216, 156, 0.28);
          border-radius: 999px;
          color: #9ff5d7;
          font-size: 11px;
          padding: 3px 8px;
        }

        .readme-preview-visual-stack {
          display: grid;
          gap: 10px;
        }

        .readme-preview-visual-stack img {
          background: #08080c;
          border: 1px solid #30363d;
          border-radius: 8px;
          height: auto;
          margin: 0 auto;
          max-height: 300px;
          object-fit: contain;
          width: min(100%, 760px);
        }

        .readme-preview-callout {
          background: rgba(88, 166, 255, 0.07);
          border: 1px solid rgba(88, 166, 255, 0.2);
          border-radius: 8px;
          padding: 14px;
        }

        .readme-preview-callout strong {
          color: #dbeafe;
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .readme-preview-markdown {
          color: #c9d1d9;
          display: grid;
          gap: 10px;
        }

        .readme-preview-markdown > :first-child {
          margin-top: 0;
        }

        .readme-preview-markdown > :last-child {
          margin-bottom: 0;
        }

        .readme-preview-markdown h1,
        .readme-preview-markdown h2,
        .readme-preview-markdown h3,
        .readme-preview-markdown h4 {
          color: #f0f6fc;
          margin: 0;
        }

        .readme-preview-markdown p,
        .readme-preview-markdown ul,
        .readme-preview-markdown ol {
          margin: 0;
        }

        .readme-preview-markdown ul,
        .readme-preview-markdown ol {
          padding-left: 20px;
        }

        .readme-preview-markdown code {
          background: rgba(110, 118, 129, 0.22);
          border-radius: 4px;
          color: #f0f6fc;
          font-size: 12px;
          padding: 2px 5px;
        }

        .readme-preview-markdown a {
          color: #58a6ff;
          text-decoration: none;
        }

        .readme-preview-pills,
        .readme-preview-links,
        .readme-preview-projects article div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .readme-preview-pills span,
        .readme-preview-links span,
        .readme-preview-projects article div span {
          background: rgba(40, 216, 156, 0.09);
          border: 1px solid rgba(40, 216, 156, 0.22);
          border-radius: 999px;
          color: #9ff5d7;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
          padding: 7px 10px;
        }

        .readme-preview-metrics {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .readme-preview-metrics div {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .readme-preview-metrics strong {
          color: #f0f6fc;
          display: block;
          font-size: 18px;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .readme-preview-metrics span {
          color: #8b949e;
          display: block;
          font-size: 11px;
          font-weight: 800;
          margin-top: 4px;
          text-transform: uppercase;
        }

        .readme-preview-projects {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .readme-preview-projects article {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 14px;
        }

        .readme-preview-projects article strong {
          color: #f0f6fc;
          display: block;
          font-size: 14px;
          margin-bottom: 7px;
        }

        .readme-preview-projects article p {
          font-size: 13px;
          margin-bottom: 12px;
        }

        .readme-preview-projects article div span {
          background: rgba(88, 166, 255, 0.08);
          border-color: rgba(88, 166, 255, 0.2);
          color: #bfdbfe;
          font-size: 11px;
        }

        .readme-preview-activity {
          align-items: end;
          display: grid;
          gap: 7px;
          grid-template-columns: repeat(7, minmax(0, 1fr));
        }

        .readme-preview-activity span {
          background: linear-gradient(180deg, rgba(40, 216, 156, 0.9), rgba(40, 216, 156, 0.18));
          border-radius: 4px;
          min-height: 26px;
        }

        .readme-preview-activity span:nth-child(2) { min-height: 42px; }
        .readme-preview-activity span:nth-child(3) { min-height: 32px; }
        .readme-preview-activity span:nth-child(4) { min-height: 58px; }
        .readme-preview-activity span:nth-child(5) { min-height: 46px; }
        .readme-preview-activity span:nth-child(6) { min-height: 68px; }
        .readme-preview-activity span:nth-child(7) { min-height: 38px; }

        .readme-preview-activity p {
          grid-column: 1 / -1;
          margin-top: 4px;
        }

        .readme-document-code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          line-height: 1.55;
          margin: 0;
          white-space: pre-wrap;
        }

        .readme-document-empty {
          align-content: center;
          display: grid;
          justify-items: center;
          text-align: center;
        }

        .readme-document-empty span {
          color: #28d89c;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .readme-document-empty h2 {
          color: #f5f5f5;
          font-size: clamp(26px, 4vw, 44px);
          line-height: 1;
          margin: 14px 0 10px;
        }

        .readme-document-empty p {
          color: #8b949e;
          margin: 0;
          max-width: 520px;
        }

        .readme-document-empty div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 22px;
        }

        .readme-document-empty strong {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 999px;
          color: #c9d1d9;
          font-size: 12px;
          padding: 7px 10px;
        }

        .readme-property-group {
          border-bottom: 1px solid #2b2b2b;
          display: grid;
          gap: 12px;
          padding: 0 0 16px;
          margin-bottom: 16px;
        }

        .readme-selected-section {
          background: #101010;
          border: 1px solid #303030;
          border-radius: 8px;
          display: grid;
          gap: 10px;
          margin-bottom: 16px;
          padding: 14px;
        }

        .readme-selected-section > span {
          color: #28d89c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .readme-selected-section h3 {
          color: #f5f5f5;
          font-size: 18px;
          font-weight: 900;
          margin: 0;
        }

        .readme-selected-section p {
          color: #8b949e;
          font-size: 12px;
          line-height: 1.45;
          margin: 0;
        }

        .readme-selected-section button {
          background: #151515;
          border: 1px solid #303030;
          border-radius: 6px;
          color: #aaa;
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
          padding: 10px;
        }

        .readme-selected-section button.active {
          background: rgba(40,216,156,0.12);
          border-color: #28d89c;
          color: #28d89c;
        }

        .readme-selected-section button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .readme-section-order-controls {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px !important;
          margin: 0 !important;
        }

        .readme-section-order-controls button {
          font-size: 11px;
          padding: 8px;
        }

        .readme-selected-section div {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .readme-selected-section .readme-section-brief {
          border-top: 1px solid #2b2b2b;
          display: grid;
          gap: 8px;
          padding-top: 10px;
        }

        .readme-section-brief > span {
          color: #777;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .readme-section-brief div {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid #262626;
          border-radius: 6px;
          display: grid;
          gap: 4px;
          padding: 9px;
        }

        .readme-section-brief small {
          color: #28d89c;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .readme-section-brief p {
          color: #9ca3af;
          font-size: 12px;
          line-height: 1.4;
          margin: 0;
        }

        .readme-selected-section strong {
          background: #191919;
          border: 1px solid #2b2b2b;
          border-radius: 999px;
          color: #c9d1d9;
          font-size: 11px;
          padding: 6px 8px;
        }

        .readme-inserted-assets {
          border-top: 1px solid #2b2b2b;
          display: grid !important;
          gap: 8px !important;
          margin: 4px 0 0 !important;
          padding-top: 10px;
        }

        .readme-inserted-assets > span {
          color: #777;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .readme-inserted-assets p {
          color: #777;
          font-size: 12px;
          margin: 0;
        }

        .readme-inserted-assets button {
          align-items: center;
          background: #151515;
          border: 1px solid #303030;
          border-radius: 6px;
          color: #d8d8d8;
          cursor: pointer;
          display: flex;
          font-size: 12px;
          font-weight: 900;
          justify-content: space-between;
          padding: 9px 10px;
        }

        .readme-inserted-assets button.default {
          background: rgba(40, 216, 156, 0.07);
          border-color: rgba(40, 216, 156, 0.22);
          color: #d7fbea;
          cursor: default;
        }

        .readme-inserted-assets button small {
          color: #ff7b72;
          font-size: 11px;
          font-weight: 900;
        }

        .readme-inserted-assets button.default small {
          color: #28d89c;
        }

        .readme-option-stack {
          display: grid;
          gap: 8px;
        }

        .readme-option-stack.compact button {
          padding: 9px;
        }

        .readme-option-stack button,
        .readme-segmented button {
          background: #101010;
          border: 1px solid #303030;
          border-radius: 6px;
          color: #aaa;
          cursor: pointer;
          padding: 10px;
          text-align: left;
        }

        .readme-option-stack button strong {
          color: inherit;
          display: block;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .readme-option-stack button span {
          color: #666;
          display: block;
          font-size: 11px;
          line-height: 1.35;
        }

        .readme-option-stack button.active,
        .readme-segmented button.active {
          background: rgba(40,216,156,0.12);
          border-color: #28d89c;
          color: #28d89c;
        }

        .readme-segmented {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .readme-segmented button {
          text-align: center;
          font-size: 12px;
          font-weight: 800;
        }

        .readme-editor-check {
          align-items: center;
          color: #d8d8d8;
          display: flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: space-between;
          gap: 12px;
        }

        .readme-ai-scan-card {
          align-items: center;
          background: rgba(88, 166, 255, 0.07);
          border: 1px solid rgba(88, 166, 255, 0.22);
          border-radius: 8px;
          display: flex;
          gap: 12px;
          justify-content: space-between;
          padding: 12px;
        }

        .readme-ai-scan-card strong {
          color: #dbeafe;
          display: block;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .readme-ai-scan-card span {
          color: #8aa4c7;
          display: block;
          font-size: 11px;
          line-height: 1.35;
        }

        .readme-ai-scan-card input {
          flex: 0 0 auto;
        }

        .readme-ai-scan-evidence {
          background: #101010;
          border: 1px solid #303030;
          border-radius: 8px;
          display: grid;
          gap: 8px;
          margin-top: 12px;
          padding: 12px;
        }

        .readme-ai-scan-evidence > span {
          color: #58a6ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .readme-ai-scan-evidence div {
          background: rgba(88, 166, 255, 0.055);
          border: 1px solid rgba(88, 166, 255, 0.14);
          border-radius: 6px;
          display: grid;
          gap: 3px;
          padding: 9px;
        }

        .readme-ai-scan-evidence small {
          color: #8aa4c7;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .readme-ai-scan-evidence strong {
          color: #dbeafe;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.35;
        }

        .readme-toggle-stack {
          border-top: 1px solid #2b2b2b;
          display: grid;
          gap: 10px;
          padding-top: 12px;
        }

        .readme-token-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .readme-token-list button {
          background: #101010;
          border: 1px solid #303030;
          border-radius: 999px;
          color: #aaa;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          padding: 8px 10px;
        }

        .readme-token-list button.active {
          background: rgba(40,216,156,0.12);
          border-color: #28d89c;
          color: #28d89c;
        }

        .readme-editor-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          color: #ef4444;
          font-size: 13px;
          padding: 10px;
        }

        .readme-editor-timeline {
          grid-column: 1 / -1;
          border-top: 1px solid #252525;
          display: grid;
          grid-template-rows: 30px minmax(0, 1fr);
          padding: 0 12px 12px;
        }

        .readme-timeline-toolbar {
          align-items: center;
          border-bottom: 1px solid #242424;
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }

        .readme-timeline-toolbar strong {
          color: #f5f5f5;
          font-size: 13px;
          font-weight: 900;
        }

        .readme-track {
          align-items: center;
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-top: 18px;
        }

        .readme-track button {
          background:
            repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 34px),
            #10251c;
          border: 1px solid #2d8f66;
          border-radius: 5px;
          color: #d7fff0;
          cursor: pointer;
          flex: 0 0 160px;
          font-size: 12px;
          font-weight: 900;
          height: 74px;
          padding: 10px;
          text-align: left;
        }

        .readme-track button strong {
          display: block;
          font-size: 12px;
          line-height: 1.1;
          margin-top: 8px;
        }

        .readme-track button small {
          color: rgba(215, 255, 240, 0.68);
          display: block;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.25;
          margin-top: 7px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .readme-track button:not(.active) {
          background: #111;
          border-color: #2c2c2c;
          color: #777;
        }

        .readme-track button:not(.active) small {
          color: #666;
        }

        .readme-track button.selected {
          outline: 2px solid #28d89c;
          outline-offset: 2px;
        }

        .readme-track button span {
          align-items: center;
          background: #28d89c;
          border-radius: 4px;
          color: #06120d;
          display: inline-flex;
          height: 18px;
          justify-content: center;
          margin-right: 8px;
          width: 18px;
        }

        .readme-track button:not(.active) span {
          background: #252525;
        }

        @media (max-width: 980px) {
          .readme-video-editor-shell {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto auto auto;
            height: auto;
            min-height: 0;
            overflow: visible;
          }

          .readme-video-topbar,
          .readme-media-bin,
          .readme-player-monitor,
          .readme-properties-panel,
          .readme-editor-timeline {
            grid-column: 1;
          }

          .readme-video-topbar {
            grid-template-columns: 1fr;
            justify-items: start;
            padding: 12px;
          }

          .readme-video-topbar > div:nth-child(2) {
            text-align: left;
          }

          .readme-video-topbar button {
            justify-self: stretch;
            width: 100%;
          }

          .readme-topbar-actions {
            display: grid;
            justify-self: stretch;
            width: 100%;
          }

          .readme-draft-state {
            text-align: center;
          }

          .readme-player-monitor {
            grid-row: 2;
            min-height: 560px;
          }

          .readme-media-bin {
            grid-row: 3;
          }

          .readme-properties-panel {
            grid-row: 4;
          }

          .readme-editor-timeline {
            grid-row: 5;
          }

          .readme-bin-grid {
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          }

          .readme-document-frame {
            min-height: 470px;
          }

          .readme-gitskins-preview {
            padding: 16px;
          }

          .readme-preview-profile {
            grid-template-columns: 56px minmax(0, 1fr);
          }

          .readme-preview-profile img {
            width: 56px;
          }

          .readme-preview-profile h1 {
            font-size: 24px;
          }

          .readme-preview-metrics,
          .readme-preview-projects {
            grid-template-columns: 1fr;
          }
        }

        .readme-summary-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .readme-summary-card {
          background: #111;
          border: 1px solid #242424;
          border-radius: 12px;
          padding: 14px 16px;
          min-width: 0;
        }

        .readme-summary-card span {
          display: block;
          color: #666;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .readme-summary-card strong {
          display: block;
          color: #f5f5f5;
          font-size: 15px;
          font-weight: 800;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .readme-form-card {
          display: grid;
          grid-template-columns: 290px minmax(420px, 1fr) 300px;
          grid-template-rows: 44px minmax(0, 1fr) 168px;
          gap: 8px;
          align-items: stretch;
          height: calc(100vh - 150px);
          min-height: 680px;
          overflow: hidden;
        }

        .readme-form-card > * {
          min-width: 0;
        }

        .readme-form-card > :not(.readme-animated-section-panel) {
          grid-column: 1;
        }

        .readme-form-card > .readme-editor-toolbar {
          grid-column: 1 / -1;
          align-items: center;
          background: #080808;
          border: 1px solid #1f1f1f;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          min-height: 0;
          padding: 8px 12px;
        }

        .readme-editor-toolbar span {
          color: #777;
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .readme-editor-toolbar strong {
          color: #fff;
          display: block;
          font-size: 15px;
          font-weight: 900;
          margin-top: 2px;
        }

        .readme-editor-toolbar__meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .readme-editor-toolbar__meta span {
          background: #151515;
          border: 1px solid #2a2a2a;
          border-radius: 999px;
          color: #aaa;
          padding: 7px 10px;
          text-transform: none;
          letter-spacing: 0;
        }

        .readme-form-card > .readme-assets-bin {
          grid-column: 1;
          background: #101010;
          border: 1px solid #242424;
          border-radius: 8px;
          margin-bottom: 0 !important;
          overflow: auto;
          padding: 16px;
        }

        .readme-form-card > .readme-theme-bin {
          grid-column: 1;
          grid-row: 2;
          align-self: end;
          max-height: 260px;
        }

        .readme-form-card > .readme-inspector-panel {
          grid-column: 3;
          margin-bottom: 0 !important;
          max-height: none;
          overflow: auto;
        }

        .readme-form-card > .readme-timeline-panel {
          grid-column: 1 / -1;
          grid-row: 3;
          background: #0d0d0d;
          border: 1px solid #242424;
          border-radius: 8px;
          margin-bottom: 0 !important;
          overflow: hidden;
          padding: 14px;
        }

        .readme-timeline-panel > div {
          display: flex !important;
          gap: 10px !important;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .readme-timeline-panel button {
          min-width: 154px;
          position: relative;
        }

        .readme-timeline-panel button::before {
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: -5px;
          height: 3px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.35);
        }

        .readme-form-card > .readme-export-button {
          grid-column: 3;
          align-self: end;
          margin-top: 0;
        }

        .readme-advanced-drawer {
          grid-column: 3;
          margin-bottom: 0;
          padding: 14px;
          background: #101010;
          border: 1px solid #242424;
          border-radius: 8px;
        }

        .readme-advanced-drawer summary,
        .readme-compact-details summary {
          align-items: center;
          cursor: pointer;
          display: flex;
          gap: 12px;
          justify-content: space-between;
          list-style: none;
        }

        .readme-advanced-drawer summary::-webkit-details-marker,
        .readme-compact-details summary::-webkit-details-marker {
          display: none;
        }

        .readme-advanced-drawer summary span {
          color: #f5f5f5;
          font-size: 14px;
          font-weight: 800;
        }

        .readme-advanced-drawer summary small {
          color: #777;
          font-size: 12px;
          font-weight: 700;
        }

        .readme-compact-details {
          margin-bottom: 14px;
          padding: 12px;
          background: #0d0d0d;
          border: 1px solid #242424;
          border-radius: 12px;
        }

        .readme-compact-details summary {
          color: #aaa;
          font-size: 13px;
          font-weight: 800;
        }

        .readme-compact-details[open] summary {
          margin-bottom: 12px;
        }

        .readme-animated-section-panel {
          grid-column: 2;
          grid-row: 2 / span 8;
          position: static;
          max-height: none;
          overflow: auto;
          padding: 20px;
          background: #101010;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          margin-bottom: 0 !important;
        }

        @media (max-width: 820px) {
          .readme-summary-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .readme-form-card {
            grid-template-columns: 1fr;
          }

          .readme-form-card > :not(.readme-animated-section-panel),
          .readme-form-card > .readme-assets-bin,
          .readme-form-card > .readme-inspector-panel,
          .readme-form-card > .readme-timeline-panel,
          .readme-form-card > .readme-export-button,
          .readme-animated-section-panel {
            grid-column: 1;
          }

          .readme-animated-section-panel {
            grid-row: auto;
            position: static;
            max-height: none;
          }
        }

        @media (max-width: 620px) {
          .readme-summary-strip {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
