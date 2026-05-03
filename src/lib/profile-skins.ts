export type ProfileSkinId =
  | 'renaissance'
  | 'inferno'
  | 'frosted'
  | 'divine'
  | 'cyber'
  | 'studio';

export interface ProfileSkin {
  id: ProfileSkinId;
  label: string;
  tagline: string;
  theme: string;
  character: string;
  expression: string;
  background: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  glow: string;
  font: string;
  pattern: string;
}

export const profileSkins: ProfileSkin[] = [
  {
    id: 'renaissance',
    label: 'Renaissance',
    tagline: 'Archive-grade profile page with manuscript detail.',
    theme: 'autumn',
    character: 'docs-sage',
    expression: 'focused',
    background:
      'radial-gradient(circle at 20% 10%, rgba(214, 158, 88, 0.34), transparent 34%), linear-gradient(135deg, #2a1d12 0%, #6b4a2c 48%, #d8bd88 100%)',
    surface: 'rgba(45, 31, 19, 0.72)',
    surfaceStrong: 'rgba(246, 219, 166, 0.13)',
    border: 'rgba(239, 198, 128, 0.36)',
    text: '#fff4d6',
    muted: '#d7bb89',
    accent: '#f1b85b',
    accent2: '#7aa05a',
    glow: 'rgba(241, 184, 91, 0.28)',
    font: 'Georgia, serif',
    pattern: 'manuscript',
  },
  {
    id: 'inferno',
    label: 'Inferno',
    tagline: 'High-drama profile skin with heat-map energy.',
    theme: 'satan',
    character: 'terminal-mage',
    expression: 'mysterious',
    background:
      'radial-gradient(circle at 72% 34%, rgba(255, 115, 36, 0.38), transparent 28%), radial-gradient(circle at 20% 80%, rgba(168, 32, 18, 0.45), transparent 34%), linear-gradient(135deg, #050101, #2a0705 54%, #110302)',
    surface: 'rgba(20, 6, 5, 0.78)',
    surfaceStrong: 'rgba(255, 94, 31, 0.11)',
    border: 'rgba(255, 120, 62, 0.28)',
    text: '#fff0e8',
    muted: '#cf8d78',
    accent: '#ff6b2c',
    accent2: '#ffd166',
    glow: 'rgba(255, 89, 36, 0.36)',
    font: 'Inter, system-ui, sans-serif',
    pattern: 'ember',
  },
  {
    id: 'frosted',
    label: 'Frosted',
    tagline: 'Soft cinematic glass for polished portfolio profiles.',
    theme: 'winter',
    character: 'interface-architect',
    expression: 'happy',
    background:
      'radial-gradient(circle at 26% 22%, rgba(152, 219, 255, 0.36), transparent 28%), linear-gradient(135deg, #07121f, #4d7181 48%, #d5edf4)',
    surface: 'rgba(12, 24, 34, 0.52)',
    surfaceStrong: 'rgba(224, 247, 255, 0.14)',
    border: 'rgba(216, 244, 255, 0.24)',
    text: '#f4fbff',
    muted: '#b9d5df',
    accent: '#7dd3fc',
    accent2: '#38bdf8',
    glow: 'rgba(125, 211, 252, 0.26)',
    font: 'Satoshi, Inter, system-ui, sans-serif',
    pattern: 'glass',
  },
  {
    id: 'divine',
    label: 'Divine',
    tagline: 'Dark gold editorial style with warm highlights.',
    theme: 'midnight',
    character: 'ai-alchemist',
    expression: 'calm',
    background:
      'radial-gradient(circle at 50% 18%, rgba(255, 219, 140, 0.32), transparent 26%), linear-gradient(135deg, #050505, #21170c 58%, #080604)',
    surface: 'rgba(15, 12, 8, 0.76)',
    surfaceStrong: 'rgba(255, 213, 128, 0.10)',
    border: 'rgba(255, 216, 145, 0.25)',
    text: '#fff8e7',
    muted: '#c9ad78',
    accent: '#f6c45f',
    accent2: '#ffffff',
    glow: 'rgba(246, 196, 95, 0.28)',
    font: 'Satoshi, Inter, system-ui, sans-serif',
    pattern: 'halo',
  },
  {
    id: 'cyber',
    label: 'Cyber',
    tagline: 'Terminal console skin for systems and AI builders.',
    theme: 'matrix',
    character: 'systems-ranger',
    expression: 'focused',
    background:
      'radial-gradient(circle at 80% 18%, rgba(34, 197, 94, 0.28), transparent 24%), linear-gradient(135deg, #010402, #05170b 58%, #020805)',
    surface: 'rgba(2, 12, 6, 0.78)',
    surfaceStrong: 'rgba(34, 197, 94, 0.10)',
    border: 'rgba(74, 222, 128, 0.24)',
    text: '#eafff0',
    muted: '#8bd9a2',
    accent: '#22c55e',
    accent2: '#86efac',
    glow: 'rgba(34, 197, 94, 0.30)',
    font: 'Geist Mono, ui-monospace, monospace',
    pattern: 'scanline',
  },
  {
    id: 'studio',
    label: 'Studio',
    tagline: 'Clean premium profile page for broad professional use.',
    theme: 'neon',
    character: 'interface-architect',
    expression: 'happy',
    background:
      'radial-gradient(circle at 18% 18%, rgba(34, 197, 94, 0.22), transparent 26%), radial-gradient(circle at 76% 34%, rgba(59, 130, 246, 0.18), transparent 24%), linear-gradient(135deg, #050505, #101315 58%, #070707)',
    surface: 'rgba(14, 16, 18, 0.76)',
    surfaceStrong: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.12)',
    text: '#fafafa',
    muted: '#a1a1a1',
    accent: '#22c55e',
    accent2: '#60a5fa',
    glow: 'rgba(34, 197, 94, 0.22)',
    font: 'Satoshi, Inter, system-ui, sans-serif',
    pattern: 'grid',
  },
];

export function getProfileSkin(id: string | null): ProfileSkin {
  return profileSkins.find((skin) => skin.id === id) ?? profileSkins[0];
}
