# GitSkins - Migration Guide

## Overview

This guide helps you migrate from the old 3-file MVP structure to the new enterprise architecture.

## File Migration Map

### Old Structure → New Structure

| Old Location | New Location | Notes |
|-------------|--------------|-------|
| `lib/themes.ts` | `src/registry/themes/` | Split into modular files |
| `lib/github.ts` | `src/lib/github.ts` | Enhanced with better error handling |
| `app/api/card/route.tsx` | `src/app/api/card/route.tsx` | Completely refactored |

## Step-by-Step Migration

### 1. Install Dependencies

```bash
npm install zod @octokit/core @vercel/og
npm install -D @types/node
```

### 2. Update TypeScript Configuration

Ensure your `tsconfig.json` has path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3. Update Next.js Configuration

Ensure your `next.config.js` supports the `src/` directory (default in Next.js 14).

### 4. Environment Variables

Create or update `.env.local`:

```bash
# Required
GITHUB_TOKEN=ghp_your_token_here

# Optional (for rate limiting)
KV_REST_API_URL=https://your-upstash-url.upstash.io
KV_REST_API_TOKEN=your_token

# Optional
ENABLE_RATE_LIMITING=true
ALLOWED_ORIGINS=https://gitskins.com,https://www.gitskins.com
NEXT_PUBLIC_SITE_URL=https://gitskins.com
```

### 5. Remove Old Files

After verifying the new structure works:

```bash
# Remove old files (backup first!)
rm -rf lib/themes.ts
rm -rf lib/github.ts
rm -rf app/api/card/route.tsx  # Only if you've moved to src/
```

### 6. Update Imports (if any custom code)

If you have any custom code importing from the old structure:

**Old:**
```typescript
import { getTheme } from '@/lib/themes';
```

**New:**
```typescript
import { getTheme } from '@/registry/themes';
```

## Breaking Changes

### 1. Import Paths

- Themes: `@/lib/themes` → `@/registry/themes`
- Types: Now in `@/types`
- Config: Now in `@/config/site`

### 2. Error Responses

**Old:** Could return JSON 500 errors  
**New:** Always returns images (prevents broken image icons)

### 3. Validation

**Old:** Manual validation in route handler  
**New:** Zod schemas with automatic validation

### 4. Theme Structure

**Old:** Single file with all themes  
**New:** Modular files, one per theme

## Testing Checklist

After migration, test:

- [ ] Basic request: `/api/card?username=octocat`
- [ ] With theme: `/api/card?username=octocat&theme=neon`
- [ ] Invalid username: `/api/card?username=invalid-user-12345`
- [ ] Missing username: `/api/card`
- [ ] Invalid theme: `/api/card?username=octocat&theme=invalid`
- [ ] Rate limiting (if enabled)
- [ ] Security headers (check response headers)

## Rollback Plan

If issues occur:

1. Keep old files in a backup directory
2. Revert to old imports
3. Check environment variables
4. Verify TypeScript compilation

## Support

If you encounter issues:

1. Check `ARCHITECTURE.md` for architecture details
2. Verify all environment variables are set
3. Check TypeScript compilation errors
4. Review middleware configuration
