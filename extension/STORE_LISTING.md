# Chrome Web Store Listing Draft

## Name

GitSkins

## Short Description

Create GitHub profile cards, avatars, README blocks, and profile skins directly from GitHub.

## Full Description

GitSkins brings profile-building tools into GitHub so developers can create better README assets without manually copying usernames between tabs.

When you open a GitHub profile, the extension adds a compact GitSkins action bar with quick links for profile skins, README generation, avatars, and copy-ready card markdown. The popup also detects the current GitHub username and lets you choose a default theme and profile skin.

What you can do:

- Open a GitSkins profile skin for the current GitHub user.
- Generate a profile README from a detected username.
- Create a theme-matched avatar.
- Copy premium GitSkins card markdown.
- Copy a linked profile skin README block.
- Save your preferred default theme and skin.
- Optionally preview GitHub profile skins locally in your own browser.

GitSkins does not permanently modify GitHub profiles. It helps you create and publish profile assets through GitSkins.

The optional GitHub profile skin preview is visible only to the user who installed the extension.

## Category

Developer Tools

## Language

English

## Permission Justification

### activeTab

Used by the popup to detect the current GitHub profile username from the active browser tab.

### clipboardWrite

Used only when the user clicks a copy button to copy GitSkins markdown snippets.

### storage

Used to save the user's default theme, profile skin preference, and optional local GitHub skin preview setting.

### Host permission: https://github.com/*

Required to inject the GitSkins action bar into GitHub profile pages.

### Host permission: https://gitskins.com/*

Used for opening GitSkins pages and generating GitSkins asset URLs.

## Privacy Disclosure

The extension reads the current GitHub profile username from the active tab URL. It does not collect browsing history, passwords, private repository content, or GitHub tokens.

If enabled by the user, the extension applies local CSS styling to GitHub profile pages in that user's browser only.

GitSkins links and generated assets are handled by `https://gitskins.com`.

Privacy policy: https://gitskins.com/privacy

Support: https://gitskins.com/support

## Screenshot Checklist

- Popup detecting a GitHub username.
- GitSkins action bar on a GitHub profile page.
- Profile skin page opened from the extension.
- README/card markdown copy flow.

## Store Notes

Avoid claiming that GitSkins changes how a GitHub profile appears to all visitors. Use language like:

> Bring GitSkins tools into GitHub and publish profile assets through GitSkins.
