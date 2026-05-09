export type PortfolioTemplateId = 'terminal-pro' | 'studio' | 'founder' | 'open-source' | 'creative-dev' | 'minimal-resume';
export type PortfolioGoal = 'get-hired' | 'win-clients' | 'promote-open-source' | 'showcase-products' | 'personal-brand';
export type PortfolioTone = 'premium' | 'technical' | 'minimal' | 'playful' | 'founder';

export interface PortfolioTemplate {
  id: PortfolioTemplateId;
  name: string;
  tagline: string;
  bestFor: string;
  accent: string;
  prompt: string;
}

export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: 'terminal-pro',
    name: 'Terminal Pro',
    tagline: 'A command-line inspired portfolio for backend, infra, AI, and security engineers.',
    bestFor: 'Backend, DevOps, AI, security',
    accent: '#22c55e',
    prompt: 'Use a premium terminal-inspired visual system: dark background, command-line details, compact technical sections, terminal cards, repo logs, and precise engineering language.',
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'Editorial, polished, and product-minded with strong case-study presentation.',
    bestFor: 'Product engineers, full-stack builders',
    accent: '#8b5cf6',
    prompt: 'Use an editorial studio layout: refined typography, roomy spacing, elegant case-study cards, subtle gradients, and a portfolio that feels like a premium product design studio.',
  },
  {
    id: 'founder',
    name: 'Founder',
    tagline: 'A SaaS-style portfolio focused on products, launches, traction, and CTAs.',
    bestFor: 'Indie builders, founders',
    accent: '#f59e0b',
    prompt: 'Use a founder/product landing-page layout: clear value proposition, shipped products, traction metrics, product cards, strong CTAs, and concise business-oriented copy.',
  },
  {
    id: 'open-source',
    name: 'Open Source',
    tagline: 'Repository-first portfolio for maintainers, contributors, and community builders.',
    bestFor: 'OSS maintainers, library authors',
    accent: '#38bdf8',
    prompt: 'Use an open-source maintainer layout: repository ecosystem, contribution paths, stars/forks context, docs links, issue/community cues, and clear maintainer credibility.',
  },
  {
    id: 'creative-dev',
    name: 'Creative Dev',
    tagline: 'Motion-friendly, visual, and expressive for frontend and creative engineers.',
    bestFor: 'Frontend, creative coding, design engineers',
    accent: '#ec4899',
    prompt: 'Use a creative developer layout: bento sections, animated-feeling CSS, expressive project previews, playful but polished copy, and strong visual hierarchy.',
  },
  {
    id: 'minimal-resume',
    name: 'Minimal Resume',
    tagline: 'Recruiter-friendly, clean, and focused on proof without visual noise.',
    bestFor: 'Job search, consulting, senior ICs',
    accent: '#e5e7eb',
    prompt: 'Use a minimal resume-style layout: crisp sections, quiet typography, strong project outcomes, readable skills, accessible contrast, and very restrained decoration.',
  },
];

export const portfolioGoals: Array<{ id: PortfolioGoal; label: string; prompt: string }> = [
  { id: 'get-hired', label: 'Get hired', prompt: 'Optimize for recruiters and hiring managers: role fit, project proof, stack clarity, outcomes, and contact path.' },
  { id: 'win-clients', label: 'Win clients', prompt: 'Optimize for consulting or freelance clients: services, outcomes, credibility, project impact, and a strong contact CTA.' },
  { id: 'promote-open-source', label: 'Promote open source', prompt: 'Optimize for open-source credibility: active repositories, contribution paths, documentation, maintainership, and community trust.' },
  { id: 'showcase-products', label: 'Showcase products', prompt: 'Optimize for shipped products: live demos, problem/solution framing, traction, product cards, and conversion CTAs.' },
  { id: 'personal-brand', label: 'Build personal brand', prompt: 'Optimize for recognition: memorable positioning, writing voice, profile consistency, and links to projects, writing, and social channels.' },
];

export const portfolioTones: Array<{ id: PortfolioTone; label: string; prompt: string }> = [
  { id: 'premium', label: 'Premium', prompt: 'Write with polished, confident, premium product language.' },
  { id: 'technical', label: 'Technical', prompt: 'Write with precise engineering language, architecture decisions, trade-offs, and implementation credibility.' },
  { id: 'minimal', label: 'Minimal', prompt: 'Write with concise, understated, low-fluff copy.' },
  { id: 'playful', label: 'Playful', prompt: 'Write with a tasteful, energetic voice while staying professional.' },
  { id: 'founder', label: 'Founder', prompt: 'Write with product, traction, user-value, and shipping momentum in mind.' },
];

export function getPortfolioTemplate(id: string | undefined): PortfolioTemplate {
  return portfolioTemplates.find((template) => template.id === id) ?? portfolioTemplates[0];
}

export function getPortfolioGoal(id: string | undefined) {
  return portfolioGoals.find((goal) => goal.id === id) ?? portfolioGoals[0];
}

export function getPortfolioTone(id: string | undefined) {
  return portfolioTones.find((tone) => tone.id === id) ?? portfolioTones[0];
}
