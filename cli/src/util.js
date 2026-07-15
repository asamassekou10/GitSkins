/** Tiny logging + config helpers, kept dependency-free. */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONFIG_FILENAME, DEFAULT_BASE_URL, DEFAULT_OUTPUT_DIR, DEFAULT_THEME, DEFAULT_WIDGETS } from './constants.js';

const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const useColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;
const paint = (c, s) => (useColor ? `${colors[c]}${s}${colors.reset}` : s);

export const log = {
  info: (m) => console.log(m),
  step: (m) => console.log(`${paint('cyan', '›')} ${m}`),
  ok: (m) => console.log(`${paint('green', '✓')} ${m}`),
  warn: (m) => console.warn(`${paint('yellow', '!')} ${m}`),
  error: (m) => console.error(`${paint('red', '✗')} ${m}`),
  dim: (m) => console.log(paint('dim', m)),
  bold: (m) => paint('bold', m),
};

export function fail(message) {
  log.error(message);
  process.exit(1);
}

export function configPath(cwd = process.cwd()) {
  return resolve(cwd, CONFIG_FILENAME);
}

export function configExists(cwd = process.cwd()) {
  return existsSync(configPath(cwd));
}

/** Load and normalize `.gitskins.json`, applying defaults. Throws if missing. */
export async function loadConfig(cwd = process.cwd()) {
  const path = configPath(cwd);
  if (!existsSync(path)) {
    throw new Error(`No ${CONFIG_FILENAME} found. Run \`npx gitskins init\` first.`);
  }
  let raw;
  try {
    raw = JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    throw new Error(`Could not parse ${CONFIG_FILENAME}: ${err.message}`);
  }
  if (!raw.username || typeof raw.username !== 'string') {
    throw new Error(`${CONFIG_FILENAME} is missing a "username".`);
  }
  return {
    username: raw.username.trim(),
    theme: (raw.theme || DEFAULT_THEME).trim(),
    outputDir: (raw.outputDir || DEFAULT_OUTPUT_DIR).trim(),
    baseUrl: (raw.baseUrl || DEFAULT_BASE_URL).trim().replace(/\/+$/, ''),
    widgets: Array.isArray(raw.widgets) && raw.widgets.length ? raw.widgets : DEFAULT_WIDGETS,
  };
}

export async function writeConfig(config, cwd = process.cwd()) {
  const path = configPath(cwd);
  const body = {
    username: config.username,
    theme: config.theme,
    outputDir: config.outputDir,
    widgets: config.widgets,
  };
  if (config.baseUrl && config.baseUrl !== DEFAULT_BASE_URL) {
    body.baseUrl = config.baseUrl;
  }
  await writeFile(path, JSON.stringify(body, null, 2) + '\n');
  return path;
}

/** Parse `--key value` / `--key=value` / `--flag` args into an object. */
export function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const eq = arg.indexOf('=');
    if (eq !== -1) {
      flags[arg.slice(2, eq)] = arg.slice(eq + 1);
    } else {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        flags[arg.slice(2)] = next;
        i++;
      } else {
        flags[arg.slice(2)] = true;
      }
    }
  }
  return flags;
}
