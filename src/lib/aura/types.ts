import type { ExtendedGitHubData } from '@/types';
import type { PremiumTheme } from '@/types/premium-theme';

export type AuraSectionName = 'hero' | 'stats' | 'stack' | 'social';

export interface AuraPalette {
  bg: string;
  card: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  ring: string;
  orbs: string[];
}

export interface AuraRenderContext {
  id: string;
  width: number;
  height: number;
  username: string;
  theme: PremiumTheme;
  palette: AuraPalette;
  data: ExtendedGitHubData;
  socials?: AuraSocialLink[];
}

export interface AuraSectionOptions {
  username: string;
  section: AuraSectionName;
  theme: PremiumTheme;
  data: ExtendedGitHubData;
  socials?: AuraSocialLink[];
}

export interface AuraSocialLink {
  label: string;
  value: string;
  url?: string;
  color?: string;
}
