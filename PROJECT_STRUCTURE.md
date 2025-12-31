# GitSkins - Professional SaaS Architecture

## Project File Tree

```
gitskins/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── card/
│   │   │       └── route.tsx          # Main API endpoint
│   │   ├── layout.tsx                 # Root layout (if needed)
│   │   └── page.tsx                   # Landing page (if needed)
│   │
│   ├── lib/
│   │   ├── github.ts                  # GitHub GraphQL API client
│   │   ├── image-generator.ts         # Image generation utilities
│   │   └── validations.ts             # Zod validation schemas
│   │
│   ├── registry/
│   │   └── themes/
│   │       ├── index.ts               # Theme registry entry point
│   │       ├── registry.ts            # Theme registry logic
│   │       ├── satan.ts               # Satan theme definition
│   │       ├── neon.ts                # Neon theme definition
│   │       └── zen.ts                 # Zen theme definition
│   │
│   ├── types/
│   │   └── index.ts                   # Shared TypeScript interfaces
│   │
│   ├── config/
│   │   ├── site.ts                    # Site configuration & constants
│   │   └── constants.ts               # App-wide constants
│   │
│   └── middleware.ts                  # Security headers & rate limiting
│
├── public/                             # Static assets
├── .env.local                          # Environment variables
├── .env.example                        # Example env file
├── next.config.js                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies
└── README.md                           # Project documentation
```

## Architecture Overview

### Layer Separation
- **API Layer** (`src/app/api/`): HTTP endpoints
- **Business Logic** (`src/lib/`): Core functionality
- **Data Layer** (`src/lib/github.ts`): External API integration
- **Presentation** (`src/lib/image-generator.ts`): Image rendering
- **Configuration** (`src/config/`): Constants and settings
- **Types** (`src/types/`): Shared TypeScript definitions
- **Registry** (`src/registry/`): Extensible theme system

### Key Design Principles
1. **Type Safety**: Strict TypeScript with shared interfaces
2. **Validation**: Zod schemas for all API inputs
3. **Modularity**: Themes as separate, importable modules
4. **Security**: Middleware for headers and rate limiting
5. **Error Handling**: Graceful degradation with error images
6. **Scalability**: Edge runtime, caching, and efficient data fetching
