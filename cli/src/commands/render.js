/** `gitskins render` — refresh committed widget files from the config. */

import { log, loadConfig, parseFlags } from '../util.js';
import { renderAll, markdownSnippet } from '../render.js';

export async function renderCommand(argv) {
  const flags = parseFlags(argv);
  const cwd = process.cwd();

  let config;
  try {
    config = await loadConfig(cwd);
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }

  // CLI flags override config (handy in CI / one-off runs).
  if (flags.username) config.username = flags.username;
  if (flags.theme) config.theme = flags.theme;
  if (flags['base-url']) config.baseUrl = flags['base-url'].replace(/\/+$/, '');

  log.step(`Rendering ${config.widgets.length} widgets for @${config.username} (${config.theme})`);

  const results = await renderAll(config, cwd);

  let rendered = 0;
  let cached = 0;
  let lost = 0; // failed with no committed copy to fall back to
  for (const r of results) {
    if (r.ok) {
      rendered++;
      log.ok(`${r.label} → ${r.file} (${(r.bytes / 1024).toFixed(1)} KB)`);
    } else if (r.cached) {
      cached++;
      log.warn(`${r.label}: ${r.error} — kept existing ${r.file}`);
    } else {
      lost++;
      log.error(`${r.label || r.id}: ${r.error}`);
    }
  }

  if (flags.snippet) {
    const snippet = markdownSnippet(results);
    if (snippet) {
      log.info('\n' + log.bold('README snippet:'));
      console.log('```markdown');
      console.log(snippet);
      console.log('```');
    }
  }

  // Exit-code policy, tuned for unattended scheduled runs:
  //   --strict        → any failure (even one covered by a cached copy) fails.
  //   default         → fail only when a widget produced no file at all
  //                     (nothing fresh and nothing cached to fall back to).
  const anyFailure = cached + lost > 0;
  if (flags.strict && anyFailure) {
    log.error(`\n${cached + lost} widget(s) failed (--strict).`);
    process.exit(1);
  }
  if (lost > 0) {
    log.error(`\n${lost} widget(s) failed with no cached copy to keep.`);
    process.exit(1);
  }
  if (cached > 0) {
    log.warn(`\nDone with warnings — ${rendered} refreshed, ${cached} kept from cache.`);
    return;
  }
  log.ok(`\nDone — ${rendered} widgets up to date.`);
}
