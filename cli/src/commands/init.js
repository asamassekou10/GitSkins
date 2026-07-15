/** `gitskins init` — scaffold config + GitHub Action, print the README snippet. */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createInterface } from 'node:readline/promises';
import { log, writeConfig, configExists, parseFlags } from '../util.js';
import { DEFAULT_THEME, DEFAULT_OUTPUT_DIR, DEFAULT_WIDGETS, DEFAULT_BASE_URL, WIDGETS } from '../constants.js';
import { renderAll, markdownSnippet } from '../render.js';
import { auditGitignore } from '../gitignore.js';

const here = dirname(fileURLToPath(import.meta.url));
const WORKFLOW_TEMPLATE = resolve(here, '../../templates/workflow.yml');
const { version: CLI_VERSION } = createRequire(import.meta.url)('../../package.json');

async function prompt(question, fallback) {
  if (!process.stdin.isTTY) return fallback;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const suffix = fallback ? ` (${fallback})` : '';
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    return answer || fallback;
  } finally {
    rl.close();
  }
}

async function writeWorkflow(cwd) {
  const dest = resolve(cwd, '.github/workflows/gitskins.yml');
  if (existsSync(dest)) {
    log.warn('.github/workflows/gitskins.yml already exists — left untouched.');
    return false;
  }
  await mkdir(dirname(dest), { recursive: true });
  const template = (await readFile(WORKFLOW_TEMPLATE, 'utf8')).replaceAll(
    '__CLI_VERSION__',
    CLI_VERSION,
  );
  await writeFile(dest, template);
  log.ok('Added GitHub Action → .github/workflows/gitskins.yml');
  return true;
}

export async function initCommand(argv) {
  const flags = parseFlags(argv);
  const cwd = process.cwd();

  if (configExists(cwd) && !flags.force) {
    log.warn('.gitskins.json already exists. Re-run with --force to overwrite.');
    return;
  }

  log.info(log.bold('\nGitSkins — set up self-updating profile widgets\n'));

  const username =
    flags.username || (await prompt('GitHub username', ''));
  if (!username) {
    log.error('A GitHub username is required. Pass --username <name>.');
    process.exit(1);
  }
  const theme = flags.theme || (await prompt('Theme', DEFAULT_THEME));

  const config = {
    username,
    theme,
    outputDir: flags['output-dir'] || DEFAULT_OUTPUT_DIR,
    baseUrl: flags['base-url'] || DEFAULT_BASE_URL,
    widgets: DEFAULT_WIDGETS,
  };

  const path = await writeConfig(config, cwd);
  log.ok(`Wrote config → ${path.replace(cwd + '/', '')}`);

  await writeWorkflow(cwd);

  try {
    const added = await auditGitignore(config.outputDir, cwd);
    if (added) log.ok(`Un-ignored generated widgets in .gitignore (${added})`);
  } catch (err) {
    log.warn(`Could not audit .gitignore: ${err.message}`);
  }

  if (flags['skip-render']) {
    log.dim('\nSkipping first render (--skip-render).');
    printNextSteps(config, []);
    return;
  }

  log.step(`\nRendering ${config.widgets.length} widgets from ${config.baseUrl} …`);
  const results = await renderAll(config, cwd);
  reportResults(results);
  printNextSteps(config, results);
}

function reportResults(results) {
  for (const r of results) {
    if (r.ok) log.ok(`${r.label} → ${r.file}`);
    else if (r.cached) log.warn(`${r.label}: ${r.error} — kept existing ${r.file}`);
    else log.error(`${r.label || r.id}: ${r.error}`);
  }
}

function printNextSteps(config, results) {
  const snippet = markdownSnippet(results) ||
    config.widgets
      .filter((id) => WIDGETS[id])
      .map((id) => `![${WIDGETS[id].alt.replace('%USER%', config.username)}](${config.outputDir}/${id}.${WIDGETS[id].defaultExt})`)
      .join('\n');

  log.info('\n' + log.bold('Paste this into your README.md:\n'));
  console.log('```markdown');
  console.log(snippet);
  console.log('```\n');
  log.info(log.bold('Next steps:'));
  log.info('  1. Commit .gitskins.json, the .gitskins/ folder, and the workflow.');
  log.info('  2. Push to GitHub — the Action refreshes widgets daily.');
  log.dim('     (Settings → Actions → General → Workflow permissions → Read and write.)\n');
}
