# Analytics & Monitoring Setup

GitSkins uses multiple analytics and monitoring solutions to track usage, performance, and errors.

## Services Integrated

### 1. Vercel Analytics
**Status**: ✅ Enabled by default

Tracks:
- Page views
- User sessions
- Geographic data
- Referrers

**Setup**: No configuration needed. Automatically enabled when deployed to Vercel.

### 2. Vercel Speed Insights
**Status**: ✅ Enabled by default

Tracks:
- Core Web Vitals (LCP, FID, CLS)
- Performance metrics
- User experience scores

**Setup**: No configuration needed. Automatically enabled when deployed to Vercel.

### 3. PostHog
**Status**: ⚙️ Optional (requires API key)

Tracks:
- Custom events (card generation, theme usage)
- User behavior
- Feature usage
- Error rates

**Setup**:
1. Create account at [posthog.com](https://posthog.com)
2. Get your project API key
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

**Events Tracked**:
- `card_generated` - Every time a card is generated
  - Properties: `card_type`, `theme`, `username`, `success`, `duration_ms`
- `api_error` - When API routes encounter errors
  - Properties: `route`, `error_message`, `error_stack`

### 4. Sentry
**Status**: ⚙️ Optional (requires DSN)

Tracks:
- Runtime errors
- Unhandled exceptions
- Performance issues
- Error stack traces

**Setup**:
1. Create account at [sentry.io](https://sentry.io)
2. Create a new Next.js project
3. Get your DSN
4. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   SENTRY_AUTH_TOKEN=your_auth_token_here
   ```

## Event Tracking Implementation

### Client-Side Tracking

PostHog automatically tracks:
- Page views
- Page exits
- Session duration

### Server-Side Tracking

Card generation endpoints track:
```typescript
{
  cardType: 'premium' | 'stats' | 'languages' | 'streak',
  theme: string,
  username: string,
  success: boolean,
  errorType?: string,
  duration: number
}
```

## Privacy Considerations

- No personally identifiable information (PII) is tracked
- GitHub usernames are tracked for analytics purposes only
- All tracking can be disabled by not setting API keys
- GDPR compliant when used with proper privacy policies

## Disabling Analytics

To disable optional analytics:
1. Remove or don't set `NEXT_PUBLIC_POSTHOG_KEY`
2. Remove or don't set `NEXT_PUBLIC_SENTRY_DSN`
3. Vercel Analytics/Speed Insights can be disabled in Vercel dashboard

## Development

In development mode:
- PostHog runs in debug mode
- Sentry doesn't send events by default
- Console logs show tracking events

## Production

In production:
- All analytics are optimized for performance
- Sample rates configured to balance cost and coverage
- Error tracking captures critical issues only
