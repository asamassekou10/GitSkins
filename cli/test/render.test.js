import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, writeFile, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { renderAll } from '../src/render.js';

// A tiny mock GitSkins instance. `mode` controls how it responds so we can
// exercise success, HTTP errors, and content-type handling deterministically.
let server;
let baseUrl;
let mode = 'ok';

const PNG_BYTES = Buffer.from('89504e470d0a1a0a', 'hex'); // PNG magic header
const SVG_BYTES = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');

before(async () => {
  process.env.GITSKINS_RETRY_MS = '0';
  process.env.GITSKINS_MAX_ATTEMPTS = '1';
  server = createServer((req, res) => {
    if (mode === 'error') {
      res.writeHead(500);
      res.end('boom');
      return;
    }
    if (req.url.startsWith('/api/premium-card')) {
      res.writeHead(200, { 'content-type': 'image/svg+xml' });
      res.end(SVG_BYTES);
    } else {
      res.writeHead(200, { 'content-type': 'image/png' });
      res.end(PNG_BYTES);
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

function config(dir, overrides = {}) {
  return {
    username: 'octocat',
    theme: 'satan',
    outputDir: '.gitskins',
    baseUrl,
    widgets: ['card', 'languages'],
    ...overrides,
  };
}

test('renderAll writes files with the extension from content-type', async () => {
  mode = 'ok';
  const dir = await mkdtemp(join(tmpdir(), 'gitskins-render-'));
  const results = await renderAll(config(dir), dir);

  assert.equal(results.length, 2);
  assert.ok(results.every((r) => r.ok));

  const files = (await readdir(join(dir, '.gitskins'))).sort();
  assert.deepEqual(files, ['card.svg', 'languages.png']);
});

test('renderAll keeps a cached copy when the server fails', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gitskins-render-'));

  mode = 'ok';
  await renderAll(config(dir), dir); // seed good files

  mode = 'error';
  const results = await renderAll(config(dir), dir);

  assert.ok(results.every((r) => !r.ok && r.cached), 'all should be cached fallbacks');
  // Files must still be on disk and non-empty.
  const svg = await readFile(join(dir, '.gitskins', 'card.svg'));
  assert.ok(svg.length > 0);
});

test('renderAll reports unknown widgets without crashing', async () => {
  mode = 'ok';
  const dir = await mkdtemp(join(tmpdir(), 'gitskins-render-'));
  const results = await renderAll(config(dir, { widgets: ['card', 'bogus'] }), dir);

  const bogus = results.find((r) => r.id === 'bogus');
  assert.equal(bogus.ok, false);
  assert.match(bogus.error, /unknown widget/);
  assert.ok(results.find((r) => r.id === 'card').ok);
});

test('renderAll fails (no cache) on first-run outage', async () => {
  mode = 'error';
  const dir = await mkdtemp(join(tmpdir(), 'gitskins-render-'));
  const results = await renderAll(config(dir), dir);

  assert.ok(results.every((r) => !r.ok && !r.cached));
});
