# GitSkins

GitSkins is a Gemini-powered toolkit for building GitHub profile widgets and AI-generated README files. It combines dynamic profile cards, stats widgets, and Gemini-based personalization so developers can showcase their work in minutes.

## Live Demo

- Production: https://gitskins.com
- Demo path: landing → README Generator → AI Features → Showcase

## Key Features

- Dynamic GitHub profile widgets (cards, stats, languages, streaks)
- 20 curated themes with live previews
- AI README Generator with Career Mode and agent refinement
- Profile Intelligence (benchmarks, strengths, gaps, next actions)
- Portfolio Builder with AI-generated case studies
- AI profile analysis, theme recommendations, and chat assistant
- Shareable showcase pages and markdown snippets

## Gemini Integration

GitSkins uses the Gemini API for core experiences:

- README generation with Career Mode + agent refinement loop
- Profile analysis and persona insights
- Theme recommendations based on profile signals
- Portfolio case studies derived from repo context
- Profile intelligence report (benchmarks + recommendations)
- Chat assistant for guidance and customization

The Gemini model is configurable via environment variables so deployments can target Gemini 3 models.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS + inline styles
- Google Gemini API
- GitHub GraphQL API

## Local Development

### Requirements

- Node.js 18+
- GitHub personal access token (for GraphQL)
- Gemini API key

### Environment Variables

Create a `.env.local`:

```
GITHUB_TOKEN=your_github_pat
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3-flash (optional)
GEMINI_MODEL_FAST=gemini-3-flash (optional)
GEMINI_MODEL_PRO=gemini-3-pro (optional)
```

Optional:

```
OPENAI_API_KEY=optional_fallback
```

### Run Locally

```
npm install
npm run dev
```

## Testing Instructions (Demo Flow)

1. Open `/` and verify widgets load for `octocat`.
2. Go to `/readme-generator`, enable Career Mode, and click "Generate README".
3. Go to `/ai` and run Profile Intelligence and Portfolio Builder.
4. Visit `/portfolio/octocat` to review case studies.
5. Visit `/showcase/octocat` and copy the markdown snippet.

## Architecture

See `docs/architecture.md` for the Gemini data flow and agent loop overview.

## Third-Party Services

- GitHub API (profile data)
- Google Gemini API (AI features)
- Stripe (payments, optional)
- PostHog (analytics, optional)
- Vercel (hosting, optional)

## License

MIT
