/**
 * README Generator Type Definitions
 */

export type ReadmeStyle = 'minimal' | 'detailed' | 'creative';

export type ReadmeSectionType =
  | 'header'
  | 'about'
  | 'skills'
  | 'stats'
  | 'languages'
  | 'projects'
  | 'streak'
  | 'connect'
  | 'custom';

export interface ReadmeSection {
  id: string;
  type: ReadmeSectionType;
  enabled: boolean;
  title?: string;
  content?: string;
}

export interface ReadmeConfig {
  username: string;
  sections: ReadmeSectionType[];
  style: ReadmeStyle;
  theme: string;
  includeGitSkins: boolean;
}

export interface GeneratedReadme {
  markdown: string;
  sections: {
    id: string;
    type: ReadmeSectionType;
    content: string;
  }[];
  metadata: {
    username: string;
    generatedAt: string;
    languages: string[];
    repoCount: number;
    totalStars: number;
  };
}

export interface ReadmeGeneratorRequest {
  username: string;
  sections?: ReadmeSectionType[];
  style?: ReadmeStyle;
  theme?: string;
  useAI?: boolean;
  careerMode?: boolean;
  careerRole?: string;
  agentLoop?: boolean;
}

export interface ExtendedProfileData {
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location?: string | null;
  company?: string | null;
  websiteUrl?: string | null;
  twitterUsername?: string | null;
  followers: number;
  following: number;
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
  languages: {
    name: string;
    color: string;
    percentage: number;
  }[];
  pinnedRepos: {
    name: string;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    url: string;
  }[];
  streak: {
    current: number;
    longest: number;
    totalDays: number;
  };
}
