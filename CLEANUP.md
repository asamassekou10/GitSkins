# Cleanup Instructions

The old `app/` directory needs to be removed since we're using the `src/` structure.

## Steps:

1. **Stop the dev server** (Ctrl+C in the terminal)

2. **Delete the old app directory:**
   ```powershell
   Remove-Item -Recurse -Force app
   ```

3. **Restart the dev server:**
   ```powershell
   npm run dev
   ```

## Why?

Next.js found the old `app/api/card/route.tsx` file which has outdated imports (`@/lib/themes`). The new structure uses `src/app/api/card/route.tsx` with correct imports (`@/registry/themes`).

Once the old `app/` directory is removed, Next.js will use the `src/` directory structure.
