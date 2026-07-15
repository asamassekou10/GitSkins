import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { auditGitignore } from '../src/gitignore.js';

async function gitRepo() {
  const dir = await mkdtemp(join(tmpdir(), 'gitskins-gi-'));
  execFileSync('git', ['init', '-q'], { cwd: dir });
  return dir;
}

test('auditGitignore adds a negation when the output dir is ignored', async () => {
  const dir = await gitRepo();
  await writeFile(join(dir, '.gitignore'), '.gitskins/\n');

  const added = await auditGitignore('.gitskins', dir);
  assert.equal(added, '!/.gitskins/');

  const gi = await readFile(join(dir, '.gitignore'), 'utf8');
  assert.match(gi, /!\/\.gitskins\//);
});

test('auditGitignore is a no-op when the dir is already tracked', async () => {
  const dir = await gitRepo();
  await writeFile(join(dir, '.gitignore'), 'node_modules/\n');

  const added = await auditGitignore('.gitskins', dir);
  assert.equal(added, null);
});

test('auditGitignore does not duplicate an existing negation rule', async () => {
  const dir = await gitRepo();
  await writeFile(join(dir, '.gitignore'), '.gitskins/\n!/.gitskins/\n');

  const added = await auditGitignore('.gitskins', dir);
  assert.equal(added, null);
});
