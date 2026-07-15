/**
 * Ensure the generated-widget directory isn't excluded from git.
 *
 * If a repo's .gitignore has a broad rule (e.g. `.g*`, `*skins*`, or an explicit
 * entry) that would drop the output dir, the GitHub Action would render files
 * that never get committed. We detect that with `git check-ignore` and append a
 * negation rule so the widgets are tracked.
 */

import { execFileSync } from 'node:child_process';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/** True if `path` is ignored by git in `cwd`. Returns false when git is absent. */
export function isIgnored(path, cwd = process.cwd()) {
  try {
    execFileSync('git', ['check-ignore', '-q', path], { cwd, stdio: 'ignore' });
    return true; // exit 0 → the path is ignored
  } catch {
    return false; // exit 1 (not ignored) or git missing
  }
}

/**
 * If `outputDir` is git-ignored, append a negation rule to .gitignore.
 * Returns the rule that was added, or null if nothing needed changing.
 */
export async function auditGitignore(outputDir, cwd = process.cwd()) {
  // A representative file path inside the dir, so check-ignore evaluates it even
  // when the dir itself is empty.
  const probe = `${outputDir.replace(/\/+$/, '')}/card.svg`;
  if (!isIgnored(probe, cwd)) return null;

  const rule = `!/${outputDir.replace(/^\.?\/+/, '').replace(/\/+$/, '')}/`;
  const gitignorePath = resolve(cwd, '.gitignore');

  if (existsSync(gitignorePath)) {
    const current = await readFile(gitignorePath, 'utf8');
    if (current.split(/\r?\n/).some((line) => line.trim() === rule)) return null;
    const sep = current.endsWith('\n') || current.length === 0 ? '' : '\n';
    await appendFile(gitignorePath, `${sep}\n# Keep GitSkins-generated widgets tracked\n${rule}\n`);
  } else {
    await writeFile(gitignorePath, `# Keep GitSkins-generated widgets tracked\n${rule}\n`);
  }
  return rule;
}
