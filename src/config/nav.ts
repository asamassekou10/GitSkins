/**
 * Single source of truth for navigation: navbar and Command Palette.
 * Edit here to add/remove or rename links site-wide.
 */

export interface NavItem {
  label: string;
  href: string;
  /** For Command Palette search; optional. */
  keywords?: string;
}

export interface NavItemWithHash extends NavItem {
  isHashLink?: boolean;
}

/** Primary links shown on the bar (no dropdown). */
export const primaryNavItems: NavItemWithHash[] = [
  { label: 'Features', href: '/#features', isHashLink: true },
  { label: 'Themes', href: '/#themes', isHashLink: true },
  { label: 'Examples', href: '/examples', isHashLink: false },
  { label: 'AI Features', href: '/ai', isHashLink: false },
  { label: 'Pricing', href: '/pricing', isHashLink: false },
];

/** Tools dropdown: product/tool pages. */
export const toolsNavItems: NavItem[] = [
  { label: 'README Generator', href: '/readme-generator', keywords: 'readme' },
  { label: 'Card Builder', href: '/cards', keywords: 'cards widgets readme markdown stats languages streak profile' },
  { label: 'Live Agent', href: '/readme-agent', keywords: 'live agent gemini' },
  { label: 'GitHub Wrapped', href: '/wrapped', keywords: 'wrapped year review' },
  { label: 'Repo Visualizer', href: '/visualize', keywords: 'visualize architecture diagram mermaid' },
  { label: 'Daily Dev Card', href: '/daily', keywords: 'daily card buildinpublic share social' },
  { label: 'Portfolio Builder', href: '/portfolio/octocat', keywords: 'portfolio' },
  { label: 'Avatar Generator', href: '/avatar', keywords: 'avatar profile picture generator themes' },
  { label: 'Project Persona', href: '/avatar/persona', keywords: 'avatar character persona projects github' },
];

/** Resources dropdown: docs, legal, support. */
export const resourcesNavItems: NavItem[] = [
  { label: 'Getting Started', href: '/getting-started', keywords: 'getting started' },
  { label: 'Blog', href: '/blog', keywords: 'blog guides seo readme github profile avatar cards' },
  { label: 'Examples Gallery', href: '/examples', keywords: 'examples gallery cards avatars themes' },
  { label: 'Docs / Themes', href: '/docs/themes', keywords: 'docs themes' },
  { label: 'Support', href: '/support', keywords: 'support help' },
  { label: 'Privacy', href: '/privacy', keywords: 'privacy' },
  { label: 'Terms', href: '/terms', keywords: 'terms' },
];

/** Flat list of all nav targets for Command Palette (primary + tools + resources). */
export const allNavItemsForCommandPalette: NavItem[] = [
  ...primaryNavItems.map(({ label, href, keywords }) => ({ label, href, keywords: keywords ?? label.toLowerCase() })),
  ...toolsNavItems,
  ...resourcesNavItems,
];
