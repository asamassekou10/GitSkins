import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { extensionForContentType, WIDGETS, DEFAULT_WIDGETS } from '../src/constants.js';
import { parseFlags } from '../src/util.js';
import { markdownSnippet } from '../src/render.js';

test('extensionForContentType maps mime types', () => {
  assert.equal(extensionForContentType('image/svg+xml'), 'svg');
  assert.equal(extensionForContentType('image/png'), 'png');
  assert.equal(extensionForContentType('image/jpeg'), 'jpg');
  assert.equal(extensionForContentType('image/gif'), 'gif');
  assert.equal(extensionForContentType('image/webp'), 'webp');
  assert.equal(extensionForContentType(''), 'png');
  assert.equal(extensionForContentType(undefined), 'png');
});

test('every default widget exists in the catalog with an endpoint', () => {
  for (const id of DEFAULT_WIDGETS) {
    assert.ok(WIDGETS[id], `missing widget ${id}`);
    assert.ok(WIDGETS[id].endpoint, `widget ${id} has no endpoint`);
    assert.ok(WIDGETS[id].defaultExt, `widget ${id} has no defaultExt`);
  }
});

test('parseFlags handles --key value, --key=value, and bare flags', () => {
  const flags = parseFlags(['--username', 'torvalds', '--theme=satan', '--strict']);
  assert.equal(flags.username, 'torvalds');
  assert.equal(flags.theme, 'satan');
  assert.equal(flags.strict, true);
});

test('parseFlags treats a flag followed by another flag as boolean', () => {
  const flags = parseFlags(['--snippet', '--theme', 'neon']);
  assert.equal(flags.snippet, true);
  assert.equal(flags.theme, 'neon');
});

test('markdownSnippet includes fresh and cached files, skips fully-lost widgets', () => {
  const snippet = markdownSnippet([
    { ok: true, file: '.gitskins/card.svg', alt: 'card' },
    { ok: false, cached: true, file: '.gitskins/streak.png', alt: 'streak' },
    { ok: false, cached: false, alt: 'stats' },
  ]);
  assert.equal(
    snippet,
    '![card](.gitskins/card.svg)\n![streak](.gitskins/streak.png)',
  );
});

test('loadConfig normalizes defaults and requires a username', async () => {
  const { loadConfig } = await import('../src/util.js');
  const dir = await mkdtemp(join(tmpdir(), 'gitskins-cfg-'));

  await writeFile(join(dir, '.gitskins.json'), JSON.stringify({ username: 'octocat' }));
  const cfg = await loadConfig(dir);
  assert.equal(cfg.username, 'octocat');
  assert.equal(cfg.theme, 'github-dark');
  assert.equal(cfg.outputDir, '.gitskins');
  assert.deepEqual(cfg.widgets, DEFAULT_WIDGETS);

  await writeFile(join(dir, '.gitskins.json'), JSON.stringify({ theme: 'satan' }));
  await assert.rejects(() => loadConfig(dir), /missing a "username"/);
});

test('writeConfig omits the default baseUrl but keeps a custom one', async () => {
  const { writeConfig } = await import('../src/util.js');
  const dir = await mkdtemp(join(tmpdir(), 'gitskins-cfg-'));

  await writeConfig(
    { username: 'a', theme: 'satan', outputDir: '.gitskins', widgets: ['card'], baseUrl: 'https://gitskins.com' },
    dir,
  );
  let saved = JSON.parse(await readFile(join(dir, '.gitskins.json'), 'utf8'));
  assert.equal(saved.baseUrl, undefined);

  await writeConfig(
    { username: 'a', theme: 'satan', outputDir: '.gitskins', widgets: ['card'], baseUrl: 'https://staging.example.com' },
    dir,
  );
  saved = JSON.parse(await readFile(join(dir, '.gitskins.json'), 'utf8'));
  assert.equal(saved.baseUrl, 'https://staging.example.com');
});
