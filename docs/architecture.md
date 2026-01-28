# Architecture Overview

GitSkins uses Next.js (App Router) with Gemini-powered API routes to generate README content, profile intelligence, and portfolio case studies.

```mermaid
flowchart TD
  user[User] --> ui[Next.js UI]
  ui --> apiReadme[API /api/generate-readme]
  ui --> apiAnalyze[API /api/ai/analyze]
  ui --> apiIntel[API /api/ai/profile-intel]
  ui --> apiPortfolio[API /api/ai/portfolio]
  ui --> apiChat[API /api/ai/chat]
  apiReadme --> github[GitHub GraphQL API]
  apiAnalyze --> github
  apiIntel --> github
  apiPortfolio --> github
  apiReadme --> gemini[Gemini API]
  apiAnalyze --> gemini
  apiIntel --> gemini
  apiPortfolio --> gemini
  apiChat --> gemini
  apiReadme --> agentLoop[AgentLoopRefinement]
  agentLoop --> gemini
```

## Agent Loop Refinement

1. Gemini generates a first-pass README.
2. Gemini critiques the README for role alignment.
3. Gemini refines the README using improvement notes.
