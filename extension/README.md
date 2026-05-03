# GitSkins Browser Extension

Manifest V3 extension that brings GitSkins actions into GitHub profile pages.

## MVP Features

- Detects the current GitHub profile username.
- Injects a compact GitSkins action bar into GitHub profile pages.
- Opens profile skins, README generator, and avatar generator for the detected user.
- Copies premium card markdown.
- Provides a popup with username/theme controls and quick copy/open actions.
- Optional local GitHub profile skin preview with subtle/full intensity modes.

## Local Install

1. Open Chrome or Edge.
2. Go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this `extension` folder.
6. Open a GitHub profile, such as `https://github.com/octocat`.

## Local GitHub Skinning

The popup includes an optional **Skin GitHub profiles** toggle. When enabled, the extension applies a local visual theme to GitHub profile pages in the installed browser only.

This does not change the public GitHub profile for other visitors. To publish something publicly, use GitSkins README markdown or share a hosted profile skin link.

## Store Notes

Before publishing:

- Replace the SVG-only icon with PNG icons if the store requires them.
- Add extension screenshots.
- Add a privacy policy URL.
- Confirm Chrome Web Store copy does not imply GitSkins changes GitHub for everyone.

Recommended positioning:

> Bring GitSkins profile cards, avatars, README tools, and hosted profile skins into GitHub.
