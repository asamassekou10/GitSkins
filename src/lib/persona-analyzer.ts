import type { ExtendedProfileData } from './github';
import type { AvatarCharacter } from './avatar-generator';

export type DeveloperPersona = {
  username: string;
  displayName: string;
  archetype: AvatarCharacter;
  title: string;
  theme: string;
  expression: 'focused' | 'happy' | 'mysterious';
  summary: string;
  traits: string[];
  evidence: string[];
  languages: string[];
  avatarUrl: string;
};

type ScoreKey = AvatarCharacter;

const ARCHETYPE_META: Record<ScoreKey, { title: string; theme: string; summary: string }> = {
  'terminal-mage': {
    title: 'Terminal Mage',
    theme: 'matrix',
    summary: 'Your projects have command-line energy: practical tools, automation, and systems that feel built for power users.',
  },
  'ai-alchemist': {
    title: 'AI Alchemist',
    theme: 'aurora',
    summary: 'Your profile reads like an experiment lab: APIs, intelligence, automation, and ideas being turned into working products.',
  },
  'interface-architect': {
    title: 'Interface Architect',
    theme: 'neon',
    summary: 'Your work leans toward polished products, visual systems, and interfaces that make technical ideas usable.',
  },
  'systems-ranger': {
    title: 'Systems Ranger',
    theme: 'midnight',
    summary: 'Your repositories suggest low-level problem solving, infrastructure thinking, and a taste for reliable machinery.',
  },
  'pixel-adventurer': {
    title: 'Pixel Adventurer',
    theme: 'retro',
    summary: 'Your projects carry creative energy: games, experiments, visual worlds, and playful technical exploration.',
  },
  'cloud-pilot': {
    title: 'Cloud Pilot',
    theme: 'ocean',
    summary: 'Your work points toward deployed systems, APIs, backend services, and projects that live beyond localhost.',
  },
  'data-oracle': {
    title: 'Data Oracle',
    theme: 'pastel',
    summary: 'Your repositories suggest analysis, pattern finding, and turning messy information into something legible.',
  },
  'docs-sage': {
    title: 'Docs Sage',
    theme: 'zen',
    summary: 'Your profile feels thoughtful and communicative, with projects that value clarity, explanation, and maintainability.',
  },
  'indie-builder': {
    title: 'Indie Builder',
    theme: 'github-dark',
    summary: 'Your project mix looks pragmatic and product-minded: shipping, iterating, and turning ideas into useful tools.',
  },
};

function includesAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function add(scores: Record<ScoreKey, number>, key: ScoreKey, amount: number) {
  scores[key] += amount;
}

export function analyzeDeveloperPersona(profile: ExtendedProfileData, username: string, origin = 'https://gitskins.com'): DeveloperPersona {
  const scores: Record<ScoreKey, number> = {
    'terminal-mage': 0,
    'ai-alchemist': 0,
    'interface-architect': 0,
    'systems-ranger': 0,
    'pixel-adventurer': 0,
    'cloud-pilot': 0,
    'data-oracle': 0,
    'docs-sage': 0,
    'indie-builder': 1,
  };

  const languages = profile.languages.map((lang) => lang.name);
  const weightedLanguages = profile.languages.slice(0, 6);
  const repoText = [
    profile.bio ?? '',
    ...profile.pinnedRepos.map((repo) => `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''}`),
  ].join(' ').toLowerCase();

  for (const lang of weightedLanguages) {
    const weight = Math.max(1, Math.round(lang.percentage / 10));
    const name = lang.name.toLowerCase();

    if (['typescript', 'javascript', 'html', 'css', 'vue', 'svelte'].includes(name)) add(scores, 'interface-architect', weight);
    if (['python', 'jupyter notebook', 'r', 'matlab'].includes(name)) add(scores, 'data-oracle', weight);
    if (['go', 'rust', 'c', 'c++', 'zig'].includes(name)) add(scores, 'systems-ranger', weight);
    if (['shell', 'powershell', 'perl'].includes(name)) add(scores, 'terminal-mage', weight);
    if (['java', 'kotlin', 'c#', 'php', 'ruby'].includes(name)) add(scores, 'cloud-pilot', weight);
    if (['lua', 'gdscript', 'shaderlab'].includes(name)) add(scores, 'pixel-adventurer', weight);
  }

  if (includesAny(repoText, ['ai', 'ml', 'llm', 'gemini', 'openai', 'agent', 'prompt', 'model', 'neural'])) add(scores, 'ai-alchemist', 8);
  if (includesAny(repoText, ['cli', 'terminal', 'shell', 'dotfiles', 'script', 'automation', 'bot'])) add(scores, 'terminal-mage', 7);
  if (includesAny(repoText, ['ui', 'ux', 'frontend', 'portfolio', 'dashboard', 'design', 'component', 'tailwind'])) add(scores, 'interface-architect', 7);
  if (includesAny(repoText, ['api', 'server', 'backend', 'database', 'auth', 'stripe', 'saas', 'deploy'])) add(scores, 'cloud-pilot', 6);
  if (includesAny(repoText, ['docker', 'kubernetes', 'infra', 'compiler', 'kernel', 'runtime', 'performance'])) add(scores, 'systems-ranger', 8);
  if (includesAny(repoText, ['game', 'pixel', 'unity', 'godot', 'three', 'canvas', 'webgl'])) add(scores, 'pixel-adventurer', 8);
  if (includesAny(repoText, ['data', 'analytics', 'chart', 'visualization', 'notebook', 'dataset'])) add(scores, 'data-oracle', 7);
  if (includesAny(repoText, ['docs', 'guide', 'readme', 'tutorial', 'learn', 'course'])) add(scores, 'docs-sage', 6);

  if (profile.totalRepos > 20) add(scores, 'indie-builder', 2);
  if (profile.totalStars > 50) add(scores, 'indie-builder', 2);
  if (profile.streak.longest > 30) add(scores, 'terminal-mage', 2);

  const archetype = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'indie-builder') as ScoreKey;
  const meta = ARCHETYPE_META[archetype];
  const traits = buildTraits(profile, archetype, repoText);
  const evidence = buildEvidence(profile, languages);
  const expression = archetype === 'docs-sage' || archetype === 'indie-builder' ? 'happy' : archetype === 'terminal-mage' ? 'mysterious' : 'focused';
  const avatarUrl = `${origin}/api/avatar?${new URLSearchParams({
    username,
    family: 'character',
    character: archetype,
    theme: meta.theme,
    expression,
    bg: 'gradient',
    size: '400',
  }).toString()}`;

  return {
    username,
    displayName: profile.name ?? username,
    archetype,
    title: meta.title,
    theme: meta.theme,
    expression,
    summary: meta.summary,
    traits,
    evidence,
    languages: languages.slice(0, 5),
    avatarUrl,
  };
}

function buildTraits(profile: ExtendedProfileData, archetype: ScoreKey, repoText: string): string[] {
  const traits = new Set<string>();
  traits.add(ARCHETYPE_META[archetype].title);
  if (profile.totalRepos > 20) traits.add('Prolific builder');
  if (profile.totalStars > 25) traits.add('Community signal');
  if (profile.streak.longest > 14) traits.add('Consistent shipper');
  if (includesAny(repoText, ['ai', 'agent', 'llm'])) traits.add('AI-curious');
  if (includesAny(repoText, ['dashboard', 'ui', 'design'])) traits.add('Product-minded');
  if (includesAny(repoText, ['api', 'server', 'database'])) traits.add('Backend capable');
  return Array.from(traits).slice(0, 5);
}

function buildEvidence(profile: ExtendedProfileData, languages: string[]): string[] {
  const evidence = [
    languages.length > 0 ? `Top language signal: ${languages.slice(0, 3).join(', ')}` : 'Language mix is still emerging',
    `${profile.totalRepos} public repositories`,
    `${profile.totalStars} total stars`,
  ];

  const notableRepo = profile.pinnedRepos[0];
  if (notableRepo) evidence.push(`Featured repo: ${notableRepo.name}`);

  return evidence.slice(0, 4);
}
