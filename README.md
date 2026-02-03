# GitSkins

**AI-powered GitHub profile tools — READMEs, widgets, year-in-review, and portfolio — powered by Google Gemini.**

Built for the **Google Hackathon** (Gemini 3). GitSkins turns your GitHub activity into recruiter-ready READMEs, live-streaming agent sessions, GitHub Wrapped narratives, repo architecture diagrams, daily dev cards, and AI-generated portfolio case studies — with Extended Thinking, real-time streaming, and Google Search grounding.

---

## Live Demo

- **Production:** [https://gitskins.com](https://gitskins.com)
- **Demo video (≤3 min):** _[Link to be added]_

**Suggested demo path:** Landing → **Live README Agent** → **AI Features** (Profile Intelligence) → **GitHub Wrapped** → **Portfolio Builder**

---

## Table of Contents

- [Features](#features)
- [Gemini 3 Integration](#gemini-3-integration)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Testing & Demo Flow](#testing--demo-flow)
- [Architecture](#architecture)
- [Credits & License](#credits--license)

---

## Features

### AI-Powered Tools (Gemini 3)

| Feature | Route | Description |
|--------|------|-------------|
| **Live README Agent** | `/readme-agent` | Watch Gemini 3 think and stream your README in real time. Career Mode runs a full agent loop: generate → critique → refine, all streamed. |
| **README Generator** | `/readme-generator` | One-shot or Career Mode README generation with multi-pass agent refinement and Extended Thinking. |
| **Profile Intelligence** | `/ai` (tab) | Industry benchmarks and profile insights with **Google Search grounding** for real-world data. |
| **Portfolio Builder** | `/portfolio/{username}/build` | Generate a full portfolio website from your GitHub. Edit with natural language; download as ZIP. |
| **Portfolio Case Studies** | `/portfolio/{username}` | AI-generated case studies highlighting your most impactful repos (Gemini 3 Pro). |
| **GitHub Wrapped** | `/wrapped`, `/wrapped/{username}` | Year-in-review narrative with Extended Thinking and optional Search grounding. Streamed slide-by-slide. |
| **Repo Visualizer** | `/visualize` | Architecture analysis and Mermaid diagrams for any repo — streamed with thought surfacing. |
| **Daily Dev Card** | `/daily` | Share what you shipped today; AI-generated card text for build-in-public posts. |
| **Profile Analysis** | `/ai` (tab) | Personality and theme recommendations (Gemini Flash). |
| **Chat Assistant** | `/ai` (tab) | Ask questions about your profile and get tailored advice. |

### Widgets & Themes

- **Dynamic GitHub profile widgets:** contribution cards, stats, languages, streaks, repos, animated cards.
- **20 curated themes:** original (Satan, Neon, Zen, GitHub Dark, Dracula), seasonal (Winter, Spring, Summer, Autumn), holiday (Christmas, Halloween), developer (Ocean, Forest, Sunset, Midnight, Aurora), aesthetic (Retro, Minimal, Pastel, Matrix).
- **Showcase** (`/showcase/{username}`): copy markdown snippets for your README.

### Platform

- **Dashboard** — Usage, plan, and quick links (auth required).
- **Getting Started** — Docs and onboarding.
- **Support, Privacy, Terms** — Legal and help pages.
- **Command Palette** (⌘K) — Quick navigation and theme search.

---

## Gemini 3 Integration

GitSkins uses the **`@google/genai`** SDK with Gemini 3 Pro and Flash.

### Capabilities Used

| Capability | Where | Impact |
|------------|-------|--------|
| **Extended Thinking** (`ThinkingLevel.HIGH`) | README gen, portfolio, case studies, profile intel, Wrapped, Visualizer | Deeper reasoning and higher-quality output |
| **Real-time streaming** (`generateContentStream`) | Live README Agent, Wrapped, Repo Visualizer | Token-by-token generation with live thought surfacing |
| **Google Search grounding** | Profile Intelligence, Wrapped | Industry benchmarks and facts backed by real data |
| **Multi-pass agent loop** (streamed) | Career Mode README, Live Agent | Generate → critique → refine, all streamed |
| **Thought surfacing** | Live Agent, Visualizer | Model reasoning visible to the user |

### Model Usage

| Feature | Model | Thinking |
|---------|--------|----------|
| README Generator (Career Mode + refinement) | Gemini 3 Pro | HIGH |
| Live README Agent (streaming + agent loop) | Gemini 3 Pro | HIGH |
| Portfolio Website Generator | Gemini 3 Pro | HIGH |
| Portfolio Case Studies | Gemini 3 Pro | HIGH |
| Profile Intelligence (+ Search grounding) | Gemini 3 Pro | HIGH |
| GitHub Wrapped | Gemini 3 Pro | HIGH |
| Repo Visualizer | Gemini 3 Pro | HIGH |
| Profile Analysis, Theme Recommendations, Chat | Gemini 3 Flash | LOW |
| Daily Dev Card text | Gemini 3 | — |

Models are configurable via environment variables (see [Environment Variables](#environment-variables)).

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **AI:** `@google/genai` (Gemini 3 Pro / Flash)
- **Auth:** NextAuth.js (GitHub OAuth)
- **Data:** GitHub GraphQL API
- **UI:** React, Framer Motion, Tailwind CSS
- **Other:** Mermaid (diagrams), JSZip (portfolio download), Stripe (optional subscriptions), PostHog (optional analytics)

---

## Quick Start

```bash
git clone https://github.com/asamassekou10/GitSkins.git
cd GitSkins
cp .env.example .env.local
# Edit .env.local: add GEMINI_API_KEY and GITHUB_TOKEN (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `.env.local` from `.env.example` and set:

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes (for profile/repos) | GitHub personal access token (GraphQL). |
| `GEMINI_API_KEY` | Yes (for AI features) | Google AI / Gemini API key. |
| `GEMINI_MODEL` | No | Default model (e.g. `gemini-3-flash-preview`). |
| `GEMINI_MODEL_PRO` | No | Pro model (e.g. `gemini-3-pro-preview`). |
| `GEMINI_MODEL_FAST` | No | Fast model for chat/analysis. |

Optional: `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (auth), `NEXT_PUBLIC_POSTHOG_*`, `SENTRY_*`, `WAITLIST_*` (see `.env.example`).

Without `GEMINI_API_KEY` and `GITHUB_TOKEN`, the site still loads; AI and profile-dependent features will show a “not configured” or similar message.

---

## Testing & Demo Flow

Use this flow to showcase the app (e.g. for hackathon judges):

1. **Landing** (`/`) — See widgets and themes for `octocat`.
2. **Live README Agent** (`/readme-agent`) — Enter a GitHub username; watch Gemini 3 think and stream. Enable Career Mode and re-run to see the full agent loop (critique + refine) streamed.
3. **README Generator** (`/readme-generator`) — Generate a README with Career Mode.
4. **AI Features** (`/ai`) — Run **Profile Intelligence** and confirm grounded responses cite real data. Try **Portfolio Builder** and **Theme Recommendations**.
5. **GitHub Wrapped** (`/wrapped`) — Enter username; get a year-in-review narrative (streamed).
6. **Repo Visualizer** (`/visualize`) — Enter `owner/repo`; get architecture analysis and Mermaid diagram (streamed).
7. **Daily Dev Card** (`/daily`) — Generate a “what I shipped today” card.
8. **Portfolio** (`/portfolio/octocat`, `/portfolio/octocat/build`) — View AI case studies; build and download a portfolio site.
9. **Showcase** (`/showcase/octocat`) — Copy widget markdown snippets.

Ensure `GEMINI_API_KEY` and `GITHUB_TOKEN` are set for all AI and GitHub-backed features.

---

## Architecture

- **Single nav config** — `src/config/nav.ts` drives navbar and Command Palette.
- **API routes** — `/api/generate-readme`, `/api/readme-agent`, `/api/ai/*`, `/api/wrapped`, `/api/visualize`, `/api/daily-generate-text`, plus widget image routes (`/api/stats`, `/api/card`, etc.).
- **Gemini** — `src/lib/gemini.ts` centralizes model calls, streaming, thinking config, and Search grounding.

For data flow and agent loop details, see [docs/architecture.md](docs/architecture.md).

---

## Credits & License

- **[Google Gemini 3](https://ai.google.dev/)** — Extended Thinking, streaming, Google Search grounding
- **[@google/genai](https://www.npmjs.com/package/@google/genai)** — Gemini SDK
- **[GitHub API](https://docs.github.com/en/rest)** — Profile and repo data
- **[Next.js](https://nextjs.org/)**, **[Framer Motion](https://motion.dev/)**, **[Vercel](https://vercel.com/)**

**License:** MIT
