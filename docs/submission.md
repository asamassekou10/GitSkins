# Gemini 3 Hackathon Submission

**Demo video:** [Record per Demo Script below and add YouTube/Vimeo link] — watch first for judges.

## Project Summary

GitSkins is a Gemini-powered toolkit for GitHub profile presentation. It generates dynamic profile widgets (cards, stats, languages, streaks) and uses Gemini to craft role-specific README files, analyze developer profiles, produce portfolio case studies, and recommend visual themes. The goal is to help developers build recruiter-ready profiles with minimal setup.

## Gemini Integration (200-word write-up)

GitSkins uses the Gemini API as the core intelligence layer across multiple user-facing features. First, the README Generator sends structured profile data (bio, contributions, repos, languages, and streaks) into Gemini and returns a complete, role-specific README.md. An agent refinement loop then critiques and improves the README for alignment with a target role (e.g., frontend, backend, data). Second, Gemini powers a profile analysis flow that transforms raw GitHub activity into a concise developer persona with strengths, collaboration style, and a recommended visual theme. Third, Gemini produces ranked theme recommendations based on each developer's language mix, activity, and bio context. Fourth, Gemini generates portfolio case studies from pinned repositories (problem, approach, impact, and tech stack). Finally, the AI chat assistant uses Gemini to answer questions and guide users through theme selection and widget placement.

These capabilities are not cosmetic; they define the product's primary value. The application works without AI, but the Gemini-powered flows are what make it uniquely useful: they convert quantitative GitHub data into meaningful narrative content, actionable profile intelligence, and portfolio-ready case studies. Gemini outputs are surfaced directly in the UI with clear attribution, and the app is configured to target Gemini 3 models via environment variables in production.

## Public Links

- Live demo: https://gitskins.com
- Public repo: https://github.com/asamassekou10/GitSkins
- Demo video (<= 3 min): Record per Demo Script below and add YouTube/Vimeo link.

## Testing Instructions

1. Open the landing page and confirm widget previews load.
2. Go to `/readme-generator`, enable Career Mode, and click "Generate README".
3. Go to `/ai`, run Profile Intelligence and Portfolio Builder.
4. Visit `/portfolio/octocat` to view case studies.
5. Visit `/showcase/octocat` and copy the markdown snippet.

For AI features, ensure `GEMINI_API_KEY` and `GITHUB_TOKEN` are set (e.g. in Vercel env vars or `.env.local`).

## Demo Script (<= 3 minutes)

1. Problem (0:00-0:20): Developers struggle to present GitHub activity clearly.
2. Solution (0:20-0:40): GitSkins generates widgets and README content.
3. Gemini Career Mode (0:40-1:30): Generate role-tailored README with agent refinement.
4. Profile Intelligence (1:30-2:00): Show benchmarks, strengths, action plan.
5. Portfolio Builder (2:00-2:30): Show case studies generated from repos.
6. Showcase (2:30-2:50): Open shareable page, copy markdown.
7. Closing (2:50-3:00): Impact + call to action.
