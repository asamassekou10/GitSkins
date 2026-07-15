# gitskins

**Self-updating GitHub profile widgets, committed to your repo.**

Most profile-widget services (including plain GitSkins image URLs) hot-link an
image on every README view. That means a broken image whenever the service is
slow or down, render traffic that scales with *your* popularity, and animations
that GitHub's sanitizer strips out.

This CLI takes the opposite approach — the same one that makes build-time SVG
tools reliable: it **renders your GitSkins widgets to static files and commits
them into your repo**, then a GitHub Action refreshes them on a schedule. Your
README points at local files, so it always loads instantly and never breaks.

## Quick start

```bash
npx gitskins init
```

`init` will:

1. Ask for your GitHub username and theme.
2. Write a `.gitskins.json` config.
3. Add a GitHub Action at `.github/workflows/gitskins.yml`.
4. Render your widgets once into `.gitskins/`.
5. Print a Markdown snippet to paste into your README.

Commit the config, the `.gitskins/` folder, and the workflow, then push. The
Action re-renders your widgets **daily** (and whenever you edit the config) and
commits the updated images automatically.

> On GitHub, enable **Settings → Actions → General → Workflow permissions →
> Read and write** so the Action can commit refreshed widgets.

`init` also scaffolds the workflow pinned to the CLI version that generated it
(reproducible runs) and, if your `.gitignore` would exclude the output folder,
adds a negation rule so the generated widgets stay tracked.

### Using the composite Action instead

If you'd rather not manage the workflow yourself, the package also ships a
composite Action:

```yaml
name: GitSkins
on:
  schedule: [{ cron: "0 6 * * *" }]
  workflow_dispatch:
permissions:
  contents: write
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gitskins/gitskins/cli@v0.1.0
        with:
          version: "0.1.0"   # npm version of the CLI to run
          strict: "false"    # fail the job on any widget error
```

It exposes a `changed` output (`true`/`false`) so you can chain steps.

### Resilience

Widget renders are fetched with retries. If GitSkins is briefly unreachable
during a scheduled run, the CLI **keeps the previously committed image** for
that widget instead of failing — your README never breaks, and the run stays
green. Pass `--strict` (or `strict: "true"` in the Action) to fail loudly
instead. A first run with no cached copy and no successful render exits non-zero.

## Commands

| Command | What it does |
| --- | --- |
| `gitskins init` | Scaffold config + Action and render once |
| `gitskins render` | Re-render the widgets in `.gitskins.json` |
| `gitskins help` | Show help |

### `init` options

| Flag | Default | Description |
| --- | --- | --- |
| `--username <name>` | *(prompted)* | GitHub username |
| `--theme <name>` | `github-dark` | Theme id (e.g. `satan`, `neon`, `dracula`) |
| `--output-dir <dir>` | `.gitskins` | Where widget files are written |
| `--base-url <url>` | `https://gitskins.com` | GitSkins instance to render from |
| `--skip-render` | | Scaffold without rendering |
| `--force` | | Overwrite an existing config |

### `render` options

`--username`, `--theme`, and `--base-url` override the config for a single run
(useful in CI). Add `--snippet` to also print the README Markdown, or `--strict`
to fail the run on any widget error even when a cached copy was kept.

## Configuration

`.gitskins.json`:

```json
{
  "username": "torvalds",
  "theme": "satan",
  "outputDir": ".gitskins",
  "widgets": ["card", "languages", "streak", "stats"]
}
```

Available widgets: `card`, `languages`, `streak`, `stats`.

## How it compares to hot-linking

|  | Hot-linked image URL | Committed via this CLI |
| --- | --- | --- |
| README load when GitSkins is slow/down | Broken image | Loads instantly (local file) |
| Render traffic | Every viewer hits the API | Once per scheduled refresh |
| Freshness | Live, but rate-limited | Refreshed daily by the Action |
| Works offline / in forks | No | Yes |

## Requirements

Node.js 18+. No dependencies.

## License

MIT
