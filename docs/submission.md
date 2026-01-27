# Gemini 3 Hackathon Submission

## Project Summary

GitSkins is a Gemini-powered toolkit for GitHub profile presentation. It generates dynamic profile widgets (cards, stats, languages, streaks) and uses Gemini to craft personalized README files, analyze developer profiles, and recommend visual themes. The goal is to help developers create polished profile READMEs in minutes with minimal setup.

## Gemini Integration (200-word write-up)

GitSkins uses the Gemini API as the core intelligence layer across multiple user-facing features. First, the README Generator sends structured profile data (bio, contributions, repos, languages, and streaks) into Gemini and receives a complete, well-formatted README.md with widgets embedded in a cohesive layout. Second, Gemini powers a profile analysis flow that transforms raw GitHub activity into a concise developer persona with strengths, collaboration style, and a recommended visual theme. Third, Gemini produces ranked theme recommendations based on each developer's language mix, activity, and bio context. Finally, the AI chat assistant uses Gemini to answer questions and guide users through theme selection and widget placement.

These capabilities are not cosmetic; they define the product's primary value. The application works without AI, but the Gemini-powered flows are what make it uniquely useful: they convert quantitative GitHub data into meaningful narrative content and design guidance. Gemini outputs are surfaced directly in the UI with clear attribution, and the app is configured to target Gemini 3 models via environment variables in production.

## Public Links

- Live demo: https://gitskins.com
- Public repo: (add GitHub URL)
- Demo video (<= 3 min): (add YouTube/Vimeo link)

## Testing Instructions

1. Open the landing page and confirm widget previews load.
2. Go to `/readme-generator`, keep the demo username, and click "Generate README".
3. Go to `/ai`, run Profile Analysis and Theme Recommendations.
4. Visit `/showcase/octocat` and copy the markdown snippet.

## Demo Script (<= 3 minutes)

1. Problem (0:00-0:20): Developers struggle to present GitHub activity clearly.
2. Solution (0:20-0:40): GitSkins generates widgets and README content.
3. Gemini README (0:40-1:40): Run the generator, show AI output.
4. Gemini Analysis (1:40-2:20): Show profile insights and theme match.
5. Showcase (2:20-2:50): Open shareable page, copy markdown.
6. Closing (2:50-3:00): Impact + call to action.
