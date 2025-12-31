# GitSkins - Enterprise Architecture Documentation

## Overview

GitSkins has been refactored from a 3-file MVP into a professional, scalable SaaS architecture following enterprise-grade best practices.

## Architecture Principles

### 1. **Type Safety First**
- Strict TypeScript with shared interfaces in `src/types/`
- All API inputs validated with Zod schemas
- No `any` types in production code

### 2. **Separation of Concerns**
- **API Layer**: HTTP endpoints (`src/app/api/`)
- **Business Logic**: Core functionality (`src/lib/`)
- **Data Layer**: External API integration (`src/lib/github.ts`)
- **Presentation**: Image rendering (`src/lib/image-generator.ts`)
- **Configuration**: Constants (`src/config/`)
- **Registry**: Extensible systems (`src/registry/`)

### 3. **Security & Performance**
- Middleware with security headers (CSP, CORS, XSS protection)
- Rate limiting via Upstash Redis (optional)
- Edge runtime for optimal performance
- 24-hour caching to reduce API calls

### 4. **Error Handling**
- All errors return images (never JSON 500s)
- Graceful degradation prevents broken image icons
- Comprehensive try/catch with typed error handling

### 5. **Extensibility**
- Modular theme system (add themes by creating new files)
- Centralized configuration for easy updates
- Validation schemas prevent invalid data

## File Structure

```
src/
├── app/
│   └── api/
│       └── card/
│           └── route.tsx          # Main API endpoint
│
├── lib/
│   ├── github.ts                  # GitHub GraphQL client
│   ├── image-generator.ts         # Image rendering utilities
│   └── validations.ts             # Zod validation schemas
│
├── registry/
│   └── themes/
│       ├── index.ts               # Public API
│       ├── registry.ts            # Registry logic
│       ├── satan.ts               # Theme definitions
│       ├── neon.ts
│       └── zen.ts
│
├── types/
│   └── index.ts                   # Shared TypeScript interfaces
│
├── config/
│   └── site.ts                    # Configuration & constants
│
└── middleware.ts                   # Security & rate limiting
```

## Key Components

### Type System (`src/types/index.ts`)

Centralized type definitions:
- `Theme`: Color palette structure
- `GitHubData`: Complete user data structure
- `ContributionDay`, `ContributionWeek`: Calendar data
- `ApiError`: Error response structure
- `CardQueryParams`: Validated API parameters

### Validation (`src/lib/validations.ts`)

Zod schemas ensure:
- Username format validation (GitHub rules)
- Theme name validation (must exist in registry)
- Type-safe parameter parsing
- Automatic error messages

### Theme Registry (`src/registry/themes/`)

Modular system for easy expansion:
1. Create new theme file (e.g., `ocean.ts`)
2. Export theme object
3. Import and register in `registry.ts`
4. Automatically available via API

**Example: Adding a new theme**
```typescript
// src/registry/themes/ocean.ts
export const oceanTheme: Theme = {
  bg: '#001f3f',
  borderColor: '#0074d9',
  primaryText: '#39cccc',
  secondaryText: '#7fdbff',
  accentColor: '#39cccc',
  fireColors: ['#001f3f', '#0074d9', '#39cccc'],
};

// src/registry/themes/registry.ts
import { oceanTheme } from './ocean';
const themes = {
  // ... existing themes
  ocean: oceanTheme,
};
```

### GitHub Client (`src/lib/github.ts`)

- Typed GraphQL queries
- Error handling for "User Not Found"
- Data transformation to `GitHubData` interface
- Configurable via `githubConfig`

### Image Generator (`src/lib/image-generator.ts`)

Pure utility functions:
- `getFireColor()`: Map contributions to colors
- `hasGlow()`: Determine glow effect
- `formatLanguages()`: Format language list
- `truncateBio()`: Truncate long bios

### API Route (`src/app/api/card/route.tsx`)

Enterprise-grade endpoint:
1. **Validate** inputs with Zod
2. **Fetch** data from GitHub
3. **Generate** image with error handling
4. **Return** image (never JSON errors)

Error handling strategy:
- Validation errors → Error image
- User not found → "SOUL NOT FOUND" image
- API errors → Error image with message
- Unexpected errors → Generic error image

### Middleware (`src/middleware.ts`)

Security features:
- **Security Headers**: CSP, X-Frame-Options, XSS Protection
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Optional Upstash Redis integration
- **IP Detection**: Supports Vercel/proxy headers

## Configuration

### Environment Variables

```bash
# Required
GITHUB_TOKEN=ghp_...

# Optional (for rate limiting)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Optional (for CORS)
ALLOWED_ORIGINS=https://gitskins.com,https://www.gitskins.com

# Optional (to enable rate limiting)
ENABLE_RATE_LIMITING=true

# Optional (for site URL)
NEXT_PUBLIC_SITE_URL=https://gitskins.com
```

### Site Configuration (`src/config/site.ts`)

Centralized constants:
- `siteConfig`: Branding and URLs
- `apiConfig`: API defaults and cache settings
- `imageConfig`: Image generation constants
- `githubConfig`: GitHub API settings
- `securityConfig`: Security headers
- `rateLimitConfig`: Rate limiting settings

## Usage Examples

### Basic Request
```
GET /api/card?username=octocat&theme=satan
```

### With Validation
The API automatically validates:
- Username format (alphanumeric + hyphens, 1-39 chars)
- Theme name (must exist in registry)
- Returns error image if validation fails

### Error Responses
All errors return images (not JSON):
- Missing username → Prompt image
- Invalid username → Validation error image
- User not found → "SOUL NOT FOUND" image
- API error → Error image with message

## Performance Optimizations

1. **Edge Runtime**: All routes use Edge Runtime
2. **Caching**: 24-hour cache headers
3. **Efficient Queries**: Single GraphQL query for all data
4. **Image Optimization**: Optimized rendering with Satori

## Security Features

1. **Input Validation**: Zod schemas prevent injection
2. **Security Headers**: CSP, XSS protection, frame options
3. **Rate Limiting**: Optional Redis-based rate limiting
4. **CORS**: Configurable origin whitelist
5. **Error Handling**: No sensitive data in error messages

## Scalability

### Horizontal Scaling
- Stateless API design
- Edge runtime for global distribution
- Cache headers reduce origin load

### Vertical Scaling
- Efficient GraphQL queries
- Minimal dependencies
- Optimized image generation

### Theme Expansion
- Add themes without touching core code
- Type-safe theme definitions
- Automatic validation

## Testing Strategy

### Unit Tests (Recommended)
- Validation schemas
- Image generator utilities
- Theme registry functions

### Integration Tests (Recommended)
- API endpoint with mock GitHub data
- Error handling paths
- Cache headers

### E2E Tests (Recommended)
- Full request/response cycle
- Multiple themes
- Error scenarios

## Deployment Checklist

- [ ] Set `GITHUB_TOKEN` environment variable
- [ ] Configure `NEXT_PUBLIC_SITE_URL` (if custom domain)
- [ ] Set up Upstash Redis (optional, for rate limiting)
- [ ] Configure `ALLOWED_ORIGINS` (if needed)
- [ ] Enable rate limiting (set `ENABLE_RATE_LIMITING=true`)
- [ ] Verify TypeScript compilation
- [ ] Test API endpoint with various inputs
- [ ] Monitor error logs

## Migration Notes

### From Old Structure
1. Old `lib/themes.ts` → New `src/registry/themes/`
2. Old `lib/github.ts` → New `src/lib/github.ts` (enhanced)
3. Old `app/api/card/route.tsx` → New `src/app/api/card/route.tsx` (refactored)

### Breaking Changes
- Import paths changed (use `@/` aliases)
- Theme registry structure changed
- Error responses are now always images (not JSON)

## Future Enhancements

1. **Analytics**: Track theme usage, popular users
2. **Custom Themes**: User-generated themes
3. **Caching Layer**: Redis for GitHub data caching
4. **Webhooks**: Real-time updates for user profiles
5. **Admin Dashboard**: Theme management UI
