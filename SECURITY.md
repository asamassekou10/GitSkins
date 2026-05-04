# Security Policy

## Reporting a Vulnerability

Please do not report vulnerabilities in public GitHub issues.

Email gitskinspro@gmail.com with:

- a summary of the issue
- affected route, feature, or package
- reproduction steps
- impact assessment
- any relevant logs or screenshots with secrets removed

We will review reports as quickly as possible and coordinate a fix before public disclosure.

## Sensitive Areas

GitSkins includes several security-sensitive systems:

- NextAuth authentication providers
- Stripe checkout, portal, and webhooks
- Neon Postgres and Prisma models
- AI generation routes
- GitHub token-backed data fetching
- Vercel KV-backed rate limiting and caching
- Chrome extension behavior on GitHub profile pages

## Secret Handling

Never commit:

- `.env.local`
- database URLs
- OAuth secrets
- GitHub tokens
- Gemini API keys
- Stripe secret keys or webhook secrets
- Resend API keys
- Sentry auth tokens
- Vercel KV tokens

If a secret is leaked, rotate it immediately in the provider dashboard and remove it from git history if needed.

## Supported Versions

Security fixes are applied to the default branch, `main`.
