/** Fetch widgets from a GitSkins instance and write them as committed files. */

import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { WIDGETS, extensionForContentType } from './constants.js';

/**
 * Find an already-committed file for a widget id in `outDir`, regardless of
 * extension (e.g. a prior run wrote `card.svg`). Returns the filename or null.
 */
async function findExistingWidgetFile(outDir, id) {
  let entries;
  try {
    entries = await readdir(outDir);
  } catch {
    return null;
  }
  const prefix = `${id}.`;
  return entries.find((name) => name.startsWith(prefix)) ?? null;
}

// Read at call time (not module load) so tests and runtime overrides apply.
// Defaults are unchanged from the documented behavior.
function retryConfig() {
  return {
    maxAttempts: Number(process.env.GITSKINS_MAX_ATTEMPTS) || 3,
    retryDelayMs:
      process.env.GITSKINS_RETRY_MS !== undefined ? Number(process.env.GITSKINS_RETRY_MS) : 1500,
    timeoutMs: Number(process.env.GITSKINS_TIMEOUT_MS) || 20000,
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function widgetUrl(baseUrl, endpoint, username, theme) {
  const u = new URL(`${baseUrl}/api/${endpoint}`);
  u.searchParams.set('username', username);
  u.searchParams.set('theme', theme);
  return u.toString();
}

async function fetchOnce(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'gitskins-cli', accept: 'image/*' },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}${detail ? ` — ${detail.slice(0, 160)}` : ''}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      throw new Error(`expected an image, got "${contentType || 'unknown'}"`);
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length === 0) throw new Error('empty response body');
    return { bytes, contentType };
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch a single widget with retries. Returns { bytes, ext }. */
export async function fetchWidget({ baseUrl, endpoint, username, theme }) {
  const url = widgetUrl(baseUrl, endpoint, username, theme);
  const { maxAttempts, retryDelayMs, timeoutMs } = retryConfig();
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { bytes, contentType } = await fetchOnce(url, timeoutMs);
      return { bytes, ext: extensionForContentType(contentType), url };
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) await sleep(retryDelayMs * attempt);
    }
  }
  throw new Error(`${url}: ${lastErr.message}`);
}

/**
 * Render every configured widget to `outputDir`.
 *
 * Each result has: { id, label, ok, file?, bytes?, alt?, error?, cached? }.
 * On a fetch failure where a previously-committed file already exists, the old
 * file is left in place and the result is marked `cached: true` (ok: false) —
 * so a transient outage during a scheduled run never wipes good output.
 */
export async function renderAll(config, cwd = process.cwd()) {
  const outDir = resolve(cwd, config.outputDir);
  await mkdir(outDir, { recursive: true });

  const results = [];
  for (const id of config.widgets) {
    const widget = WIDGETS[id];
    if (!widget) {
      results.push({ id, ok: false, error: `unknown widget "${id}"` });
      continue;
    }
    const alt = widget.alt.replace('%USER%', config.username);
    try {
      const { bytes, ext } = await fetchWidget({
        baseUrl: config.baseUrl,
        endpoint: widget.endpoint,
        username: config.username,
        theme: config.theme,
      });
      const absPath = resolve(outDir, `${id}.${ext}`);
      await writeFile(absPath, bytes);
      results.push({
        id,
        label: widget.label,
        ok: true,
        file: relative(cwd, absPath),
        bytes: bytes.length,
        alt,
      });
    } catch (err) {
      const existing = await findExistingWidgetFile(outDir, id);
      results.push({
        id,
        label: widget.label,
        ok: false,
        error: err.message,
        cached: Boolean(existing),
        file: existing ? relative(cwd, resolve(outDir, existing)) : undefined,
        alt,
      });
    }
  }
  return results;
}

/**
 * Build the README markdown snippet from render results.
 * Includes any widget that has a file on disk — freshly rendered or a retained
 * cached copy — since both are valid to reference from the README.
 */
export function markdownSnippet(results) {
  return results
    .filter((r) => r.file)
    .map((r) => `![${r.alt}](${r.file})`)
    .join('\n');
}
