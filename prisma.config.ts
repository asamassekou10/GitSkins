// prisma.config.ts — used by Prisma CLI (migrate, studio, etc.)
// On Vercel, DATABASE_URL is injected automatically.
// For local dev, add DATABASE_URL to .env.local.
import { config } from "dotenv";
config({ path: ".env.local", override: false });
config({ path: ".env", override: false });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
