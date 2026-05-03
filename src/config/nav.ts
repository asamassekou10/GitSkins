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
  { label: 'Examples', href: '/examples', isHashLink: false },
  { label: 'Blog', href: '/blog', isHashLink: false },
  { label: 'Pricing', href: '/pricing', isHashLink: false },
];

/** Tools dropdown: product/tool pages. */
export const toolsNavItems: NavItem[] = [
  { label: 'README Studio', href: '/readme-generator', keywords: 'readme generator animations markdown' },
  { label: 'Profile Cards', href: '/cards', keywords: 'cards widgets readme markdown stats languages streak profile' },
  { label: 'Profile Skins', href: '/showcase/octocat?skin=studio', keywords: 'showcase profile skins hosted github theme page' },
  { label: 'Theme Avatars', href: '/avatar', keywords: 'avatar profile picture generator themes characters' },
  { label: 'Project Persona', href: '/avatar/persona', keywords: 'avatar character persona projects github' },
  { label: 'AI Toolkit', href: '/ai', keywords: 'ai analyze themes portfolio chat profile intel' },
  { label: 'Portfolio Builder', href: '/portfolio/octocat', keywords: 'portfolio website' },
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
