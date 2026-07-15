/**
 * Helpers for safely rendering AI/model output.
 *
 * Models are asked for arrays of short strings but sometimes return objects
 * (e.g. `{ improvement, details }`, `{ text }`, `{ title, description }`).
 * Rendering an object as a React child throws (React error #31) and takes down
 * the whole page. These pure helpers coerce any value into a display string, so
 * they're safe to use on both the server (normalizing at the source) and the
 * client (defensive at the render, which also protects data saved earlier).
 */

/** Coerce any value into a human-readable string — never an object. */
export function toDisplayText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value == null) return '';
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    // Prefer common label/description fields, in rough priority order.
    const parts = [
      o.improvement, o.suggestion, o.text, o.note, o.title, o.name, o.label,
      o.details, o.detail, o.description, o.value,
    ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    if (parts.length > 0) return parts.join(' — ');
    return JSON.stringify(value);
  }
  return String(value);
}

/** Coerce a value expected to be `string[]` into a clean `string[]`. */
export function toTextArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(toDisplayText).filter((s) => s.trim().length > 0);
}
