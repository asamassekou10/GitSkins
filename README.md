# GitSkins

GitSkins is an open-source toolkit for making GitHub profiles feel more like polished developer portfolios. It includes profile cards, README generation, themed avatars, profile skins, GitHub Wrapped pages, a Chrome extension, and AI-assisted profile tools.

[Live site](https://gitskins.com) · [Chrome extension](https://chromewebstore.google.com/detail/gitskins/mioohaiefojpnpjlfloobapajemmgmcn) · [Theme catalog](https://gitskins.com/themes) · [Support](https://gitskins.com/support)

## What You Can Build

- **README Studio**: generate structured GitHub profile READMEs with themed visuals and copy-ready Markdown.
- **Profile Cards**: create profile, stats, language, streak, and premium card images for GitHub READMEs.
- **Theme Systems**: apply one visual system across cards, avatars, README assets, hosted profile skins, and the browser extension.
- **Avatar Studio**: generate theme-matched profile pictures, characters, and project personas.
- **Hosted Profile Skins**: create shareable profile pages for GitHub users.
- **GitHub Wrapped**: generate a year-in-code story for public GitHub profiles.
- **Chrome Extension**: use GitSkins actions directly on GitHub profile pages.
- **AI Toolkit**: profile analysis, theme recommendations, portfolio case studies, chat, and README assistance.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **Language**: TypeScript
- **UI**: React, Framer Motion, Tailwind CSS 4
- **Auth**: NextAuth.js v5 with GitHub, Google, and Resend magic links
- **Database**: Neon Postgres with Prisma 7 and `@prisma/adapter-neon`
- **Payments**: Stripe Checkout, Billing Portal, and webhooks
- **AI**: Google Gemini via `@google/genai`
- **Email**: Resend
- **Monitoring**: Sentry, Vercel Analytics, Vercel Speed Insights
- **Caching / rate limits**: optional Vercel KV with in-memory fallback

## Repository Structure

```txt
src/app/                 Next.js routes, pages, API routes, and metadata
src/components/          Shared UI, landing, SEO, auth, and product components
src/config/              Site, nav, subscription, and external link config
src/lib/                 GitHub, AI, database, Stripe, email, cache, SEO helpers
src/hooks/               Client hooks
prisma/                  Prisma schema and migrations
extension/               Chrome extension source
docs/                    Architecture notes, asset licensing, and project docs
examples/                Example generated READMEs
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Neon Postgres database
- A GitHub token for profile/repository data
- Optional service accounts for Gemini, Stripe, Resend, Google OAuth, Sentry, and Vercel KV

### Local Setup

```bash
git clone https://github.com/asamassekou10/GitSkins.git
cd GitSkins
cp .env.example .env.local
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Setup

Set `DATABASE_URL` in `.env.local`, then run:

```bash
npx prisma migrate deploy
```

For local development, the app is designed to fail gracefully when some optional services are not configured. Database-backed auth, usage tracking, and payments require a valid database connection.

## Environment Variables

Start from `.env.example`. The most important variables are:

| Variable | Required for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | auth, usage, subscriptions | Neon Postgres connection string. |
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | auth | Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | auth callbacks | `http://localhost:3000` locally. |
| `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` | GitHub sign-in | Create a GitHub OAuth app. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in | Configure callback URL in Google Cloud. |
| `RESEND_API_KEY` | email magic links and transactional email | Optional in local development. |
| `GITHUB_TOKEN` | GitHub data | Used for profile, repo, stats, and README context. |
| `GEMINI_API_KEY` | AI features | Required for AI generation routes. |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | payments | Required for checkout and webhook handling. |
| `STRIPE_PRICE_*` | pricing plans | Stripe price IDs for subscriptions, lifetime plans, and credits. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | shared rate limiting/cache | Optional; app falls back in development. |
| `NEXT_PUBLIC_SENTRY_DSN` | client error monitoring | Optional. |

Do not commit `.env.local`, API keys, OAuth secrets, tokens, database URLs, Stripe keys, or service credentials.

## Scripts

```bash
npm run dev       # Start the local Next.js dev server
npm run build     # Generate Prisma client, deploy migrations, and build production app
npm run start     # Start the production server after build
npx tsc --noEmit  # Type-check the project
```

`next lint` is not currently used in CI because the Next.js 16 lint command behavior changed. CI runs TypeScript checks after installing dependencies and generating Prisma Client.

## Contributing

Contributions are welcome. Good first areas include:

- theme polish and new original theme systems
- README templates and example profiles
- card layout improvements
- avatar styles with clear licensing
- accessibility fixes
- docs, onboarding, and SEO content
- test coverage around shared helpers and API behavior

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Please do not open public issues for vulnerabilities or leaked credentials. Follow [SECURITY.md](SECURITY.md).

## Asset and Character Licensing

GitSkins uses original renderers and open-source avatar systems. Do not add copyrighted characters, franchise mascots, or branded assets unless there is an explicit license allowing distribution in this repository. See [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md).

## Architecture

For a deeper project overview, see [docs/architecture.md](docs/architecture.md).

## License

MIT. See [LICENSE](LICENSE).
