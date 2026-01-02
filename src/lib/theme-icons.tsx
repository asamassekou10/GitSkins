/**
 * GitSkins - Theme-Specific SVG Icons
 *
 * Custom SVG icons for each theme to replace generic emojis.
 * Each icon is designed to match the theme's aesthetic.
 */

import type { ThemeName } from '@/types';

/**
 * Icon component props
 */
interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Satan Theme Icons - Fire, flames, and demonic elements
 */
export const SatanIcons = {
  star: ({ size = 24, color = '#ff4500' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 2L13.5 7L12 9L10.5 7L12 2Z"
        fill="#ff6b35"
        opacity="0.8"
      />
    </svg>
  ),

  fire: ({ size = 24, color = '#ff4500' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C10 6 8 8 7 12C6 16 8 20 12 22C16 20 18 16 17 12C16 8 14 6 12 2Z"
        fill={color}
      />
      <path
        d="M12 6C11 8 10 9 9.5 11C9 13 10 15 12 16C14 15 15 13 14.5 11C14 9 13 8 12 6Z"
        fill="#ff6b35"
      />
      <path
        d="M12 10C11.5 11 11 11.5 11 12.5C11 13.5 11.5 14 12 14.5C12.5 14 13 13.5 13 12.5C13 11.5 12.5 11 12 10Z"
        fill="#ffd700"
      />
    </svg>
  ),

  contributions: ({ size = 24, color = '#ff4500' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13 8L18 6L15 12L22 13L15 15L18 20L13 17L12 23L11 17L6 20L9 15L2 13L9 12L6 6L11 8L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/**
 * Neon Theme Icons - Cyberpunk, tech, and digital elements
 */
export const NeonIcons = {
  star: ({ size = 24, color = '#00ffff' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  ),

  fire: ({ size = 24, color = '#00ffff' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2V8M12 16V22M4.93 4.93L9.17 9.17M14.83 14.83L19.07 19.07M2 12H8M16 12H22M4.93 19.07L9.17 14.83M14.83 9.17L19.07 4.93"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  ),

  contributions: ({ size = 24, color = '#00ffff' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="4" height="4" fill={color} opacity="0.3" />
      <rect x="10" y="3" width="4" height="4" fill={color} opacity="0.6" />
      <rect x="17" y="3" width="4" height="4" fill={color} />
      <rect x="3" y="10" width="4" height="4" fill={color} opacity="0.5" />
      <rect x="10" y="10" width="4" height="4" fill={color} />
      <rect x="17" y="10" width="4" height="4" fill={color} opacity="0.7" />
      <rect x="3" y="17" width="4" height="4" fill={color} opacity="0.8" />
      <rect x="10" y="17" width="4" height="4" fill={color} opacity="0.4" />
      <rect x="17" y="17" width="4" height="4" fill={color} />
    </svg>
  ),
};

/**
 * Dracula Theme Icons - Gothic, vampire, and dark fantasy elements
 */
export const DraculaIcons = {
  star: ({ size = 24, color = '#bd93f9' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
        opacity="0.8"
      />
      <circle cx="12" cy="3" r="1.5" fill="#ff79c6" />
      <circle cx="8" cy="9" r="1" fill="#ff79c6" />
      <circle cx="16" cy="9" r="1" fill="#ff79c6" />
    </svg>
  ),

  fire: ({ size = 24, color = '#bd93f9' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C11 3 10 5 9 8C8 10 9 14 12 14C15 14 16 10 15 8C14 5 13 3 12 2Z"
        fill={color}
        opacity="0.3"
      />
      <circle cx="10" cy="6" r="6" fill={color} opacity="0.15" />
      <circle cx="14" cy="8" r="5" fill="#ff79c6" opacity="0.15" />
      <path
        d="M12 4C11.5 5 11 6 10.5 7.5C10 9 10.5 11 12 11C13.5 11 14 9 13.5 7.5C13 6 12.5 5 12 4Z"
        fill="#ff79c6"
      />
    </svg>
  ),

  contributions: ({ size = 24, color = '#bd93f9' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L14 8L19 10L14 12L12 17L10 12L5 10L10 8L12 3Z"
        fill={color}
      />
      <path
        d="M18 5L19 7L21 8L19 9L18 11L17 9L15 8L17 7L18 5Z"
        fill="#ff79c6"
        opacity="0.8"
      />
      <path
        d="M6 15L7 17L9 18L7 19L6 21L5 19L3 18L5 17L6 15Z"
        fill="#ff79c6"
        opacity="0.6"
      />
    </svg>
  ),
};

/**
 * Zen Theme Icons - Nature, bamboo, and minimalist elements
 */
export const ZenIcons = {
  star: ({ size = 24, color = '#4ade80' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="12" cy="12" r="2" fill={color} />
      <path d="M12 4V6M12 18V20M4 12H6M18 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  fire: ({ size = 24, color = '#4ade80' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M10 22C10 22 10 20 10 18C10 16 9 14 9 12C9 10 10 8 11 6C11 6 11 8 11 10C11 12 12 14 13 16C14 14 15 12 15 10C15 8 15 6 15 6C16 8 17 10 17 12C17 14 16 16 16 18C16 20 16 22 16 22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M12 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),

  contributions: ({ size = 24, color = '#4ade80' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="5" r="1.5" fill={color} opacity="0.6" />
      <circle cx="12" cy="19" r="1.5" fill={color} opacity="0.6" />
      <circle cx="5" cy="12" r="1.5" fill={color} opacity="0.6" />
      <circle cx="19" cy="12" r="1.5" fill={color} opacity="0.6" />
      <circle cx="7" cy="7" r="1" fill={color} opacity="0.4" />
      <circle cx="17" cy="7" r="1" fill={color} opacity="0.4" />
      <circle cx="7" cy="17" r="1" fill={color} opacity="0.4" />
      <circle cx="17" cy="17" r="1" fill={color} opacity="0.4" />
    </svg>
  ),
};

/**
 * GitHub Dark Theme Icons - Octocat, code, and GitHub elements
 */
export const GitHubDarkIcons = {
  star: ({ size = 24, color = '#58a6ff' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
      />
    </svg>
  ),

  fire: ({ size = 24, color = '#58a6ff' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="5" width="3" height="14" rx="1" fill={color} opacity="0.6" />
      <rect x="10" y="3" width="4" height="18" rx="1" fill={color} />
      <rect x="16" y="7" width="3" height="10" rx="1" fill={color} opacity="0.7" />
    </svg>
  ),

  contributions: ({ size = 24, color = '#58a6ff' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 19C4 20.5 4 16.5 2 16M16 22V18.13C16 17.13 16.12 16.62 15.5 16C18.5 15.68 22 14.5 22 9C22 7.5 21.5 6.5 20.5 5.5C20.62 5.12 21.12 3.5 20.38 2C20.38 2 19 1.62 16 3.5C14.62 3.12 13 3 11.5 3C10 3 8.38 3.12 7 3.5C4 1.62 2.62 2 2.62 2C1.88 3.5 2.38 5.12 2.5 5.5C1.5 6.5 1 7.5 1 9C1 14.5 4.5 15.68 7.5 16C6.88 16.62 7 17.13 7 18.13V22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
};

/**
 * Get theme-specific icons
 */
export function getThemeIcons(theme: ThemeName) {
  switch (theme) {
    case 'satan':
      return SatanIcons;
    case 'neon':
      return NeonIcons;
    case 'dracula':
      return DraculaIcons;
    case 'zen':
      return ZenIcons;
    case 'github-dark':
      return GitHubDarkIcons;
    default:
      return SatanIcons;
  }
}

/**
 * Render icon as JSX element with proper Satori compatibility
 */
export function renderIcon(
  IconComponent: (props: IconProps) => JSX.Element,
  size: number,
  color: string
): JSX.Element {
  return IconComponent({ size, color });
}
