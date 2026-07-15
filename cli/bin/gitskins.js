#!/usr/bin/env node
/**
 * GitSkins CLI
 *
 * Commit self-updating, themed GitHub profile widgets to your repo instead of
 * hot-linking gitskins.com in your README.
 *
 *   npx gitskins init      scaffold config + GitHub Action, render once
 *   npx gitskins render    refresh the committed widget files
 */

import { initCommand } from '../src/commands/init.js';
import { renderCommand } from '../src/commands/render.js';
import { log } from '../src/util.js';

const HELP = `
${log.bold('gitskins')} — self-updating GitHub profile widgets

${log.bold('Usage')}
  npx gitskins <command> [options]

${log.bold('Commands')}
  init      Scaffold .gitskins.json + a GitHub Action, then render once
  render    Re-render the widgets defined in .gitskins.json
  help      Show this help

${log.bold('init options')}
  --username <name>     GitHub username (prompted if omitted)
  --theme <name>        Theme id (default: github-dark)
  --output-dir <dir>    Where to write widgets (default: .gitskins)
  --base-url <url>      GitSkins instance (default: https://gitskins.com)
  --skip-render         Scaffold without the first render
  --force               Overwrite an existing .gitskins.json

${log.bold('render options')}
  --username / --theme / --base-url   Override the config for this run
  --snippet             Also print the README markdown snippet
  --strict              Exit non-zero if any widget fails, even if a
                        previously committed copy was kept

${log.bold('Examples')}
  npx gitskins init --username torvalds --theme satan
  npx gitskins render --snippet
`;

async function main() {
  const [command, ...argv] = process.argv.slice(2);

  try {
    switch (command) {
      case 'init':
        await initCommand(argv);
        break;
      case 'render':
      case 'refresh':
        await renderCommand(argv);
        break;
      case undefined:
      case 'help':
      case '--help':
      case '-h':
        console.log(HELP);
        break;
      case '--version':
      case '-v': {
        const { readFile } = await import('node:fs/promises');
        const { fileURLToPath } = await import('node:url');
        const { resolve, dirname } = await import('node:path');
        const pkg = JSON.parse(
          await readFile(resolve(dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8')
        );
        console.log(pkg.version);
        break;
      }
      default:
        log.error(`Unknown command: ${command}`);
        console.log(HELP);
        process.exit(1);
    }
  } catch (err) {
    log.error(err?.message || String(err));
    process.exit(1);
  }
}

main();
