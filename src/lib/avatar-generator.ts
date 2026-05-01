/**
 * Avatar Generator — deterministic seeded helpers.
 * Pure functions with no JSX (JSX lives in the route file).
 */

export function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h) || 1;
}

/** Tiny xorshift PRNG seeded from username+theme+style */
export function seededRng(seed: number) {
  let s = (seed ^ 0xdeadbeef) >>> 0 || 1;
  return (): number => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0x100000000;
  };
}

/** Pull first solid hex colour out of a CSS gradient string */
export function extractBg(bg: string): string {
  if (!bg.includes('gradient')) return bg;
  const m = bg.match(/#[a-fA-F0-9]{6}/);
  return m ? m[0] : '#0a0a0a';
}

/** Hex + alpha → rgba string */
export function hexRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}

export type AvatarStyle = 'orbs' | 'geo' | 'pixel';

export const AVATAR_SIZE = 400;
