/**
 * Shared constants and widget catalog for the GitSkins CLI.
 *
 * A "widget" is an endpoint under `${baseUrl}/api/<endpoint>` that renders an
 * image. The CLI fetches each one and commits the bytes into the user's repo so
 * their README references a local, self-updating file instead of hot-linking
 * gitskins.com on every view.
 */

export const CONFIG_FILENAME = '.gitskins.json';
export const DEFAULT_BASE_URL = 'https://gitskins.com';
export const DEFAULT_OUTPUT_DIR = '.gitskins';
export const DEFAULT_THEME = 'github-dark';

/**
 * Catalog of renderable widgets, keyed by the id used in `.gitskins.json`.
 * `endpoint` is the path under /api. `label` is used in printed snippets.
 * `alt` is the alt text baked into the generated README markdown.
 */
export const WIDGETS = {
  card: {
    endpoint: 'premium-card',
    label: 'Profile Card',
    alt: "%USER%'s GitHub profile",
    // Default extension used only for the pre-render snippet; the actual
    // extension always comes from the response content-type.
    defaultExt: 'svg',
  },
  languages: {
    endpoint: 'languages',
    label: 'Top Languages',
    alt: "%USER%'s most used languages",
    defaultExt: 'png',
  },
  streak: {
    endpoint: 'streak',
    label: 'Contribution Streak',
    alt: "%USER%'s contribution streak",
    defaultExt: 'png',
  },
  stats: {
    endpoint: 'stats',
    label: 'GitHub Stats',
    alt: "%USER%'s GitHub stats",
    defaultExt: 'png',
  },
};

/** Widgets included by default when a config is scaffolded. */
export const DEFAULT_WIDGETS = ['card', 'languages', 'streak', 'stats'];

/** Map a response content-type to a file extension. */
export function extensionForContentType(contentType) {
  if (!contentType) return 'png';
  if (contentType.includes('svg')) return 'svg';
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  if (contentType.includes('gif')) return 'gif';
  if (contentType.includes('webp')) return 'webp';
  return 'png';
}
