# Contributing to GitSkins

Thanks for helping improve GitSkins. This project is a public developer tool, so contributions should favor maintainability, clear UX, and production safety.

## Code of Conduct

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before You Start

1. Search existing issues and pull requests.
2. For small fixes, open a pull request directly.
3. For larger features, open an issue first with the problem, proposed solution, and rough scope.
4. Do not include secrets, private data, generated credentials, or user tokens in issues, commits, screenshots, or logs.

## Development Setup

```bash
git clone https://github.com/asamassekou10/GitSkins.git
cd GitSkins
cp .env.example .env.local
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Most product surfaces can be worked on with only `DATABASE_URL`, `GITHUB_TOKEN`, and optional auth credentials. AI, payment, email, monitoring, and KV-backed features need their own service keys.

## Branches

Use short, descriptive branch names:

```txt
feat/theme-gallery-filter
fix/card-alignment-mobile
docs/readme-setup
```

## Commit Style

Use clear imperative messages:

```txt
Add theme preview cards
Fix avatar download filename
Document Stripe webhook setup
```

Keep unrelated changes in separate commits.

## Pull Request Checklist

Before opening a PR:

- [ ] The change is scoped to one clear problem.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes when the change affects routing, API routes, Prisma, auth, payments, or shared config.
- [ ] UI changes were checked on mobile and desktop.
- [ ] New copy matches the current public product positioning.
- [ ] New assets have clear licensing and are documented when needed.
- [ ] New environment variables are added to `.env.example`.
- [ ] Security-sensitive changes include notes about abuse cases, auth checks, and rate limits.

## UI and Design Guidelines

- Prefer existing visual language, tokens, and components before introducing new patterns.
- Keep product pages focused on the actual tool, not generic marketing blocks.
- Use animation to clarify hierarchy or state. Avoid motion that hides content, delays workflows, or harms readability.
- Check card and widget alignment with real generated image URLs.
- Keep text concise and specific.

## API and Security Guidelines

- Validate request bodies with structured schemas where possible.
- Do not trust client-side plan, usage, or auth state.
- Put paid-feature checks on the server, not only in the UI.
- Use rate limiting for expensive routes.
- Avoid logging secrets, tokens, raw request bodies, or personal data.
- Stripe webhooks must verify signatures from the raw body.

## Avatar and Asset Guidelines

GitSkins should not ship copyrighted characters from shows, games, movies, or brands unless the project has explicit permission. Use original characters, public-domain concepts, or open-source avatar systems with clear licenses. Update [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md) when adding a new asset source.

## Reporting Bugs

Include:

- the page or API route
- expected behavior
- actual behavior
- browser/device if UI-related
- screenshots or screen recordings when useful
- console/server logs with secrets removed

## Feature Requests

Good feature requests explain:

- who the feature helps
- what workflow it improves
- what a minimal version could look like
- whether it affects Free/Pro gating, billing, privacy, or security
