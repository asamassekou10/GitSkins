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

export interface ThemeRecommendation {
  theme: string;
  score: number;
  reason: string;
}

export interface ProfileIntel {
  summary: string;
  benchmarks: Array<{ label: string; value: string; context: string }>;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ProfileData {
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers?: number;
  totalStars?: number;
  totalRepos?: number;
  totalContributions?: number;
  streak?: number;
  languages?: string[];
}

export const THEME_COLORS: Record<string, string> = {
  satan: '#dc2626',
  neon: '#22d3ee',
  zen: '#a3a3a3',
  'github-dark': '#238636',
  dracula: '#bd93f9',
  ocean: '#0ea5e9',
  forest: '#22c55e',
  sunset: '#f97316',
  midnight: '#3b82f6',
  aurora: '#a855f7',
  retro: '#f472b6',
  minimal: '#737373',
  pastel: '#fda4af',
  matrix: '#22c55e',
  winter: '#7dd3fc',
  spring: '#86efac',
  summer: '#fcd34d',
  autumn: '#ea580c',
  christmas: '#dc2626',
  halloween: '#f97316',
};
