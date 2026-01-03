/**
 * GitSkins - API Validation Schemas
 * 
 * Zod schemas for validating all API inputs.
 * Ensures type safety and prevents invalid data from reaching business logic.
 */

import { z } from 'zod';
import type { ThemeName } from '@/types';
import { getThemeRegistry } from '@/registry/themes';

/**
 * Valid theme names from the registry
 */
const validThemeNames = Object.keys(getThemeRegistry()) as ThemeName[];

/**
 * Username validation schema
 * - Must be a non-empty string
 * - GitHub usernames: 1-39 characters, alphanumeric and hyphens
 * - Case-insensitive
 * - Strips @ symbol if present (e.g., @octocat -> octocat)
 */
export const usernameSchema = z
  .string()
  .min(1, 'Username is required')
  .transform((val) => {
    // Strip @ symbol if present
    const cleaned = val.trim().startsWith('@') ? val.trim().slice(1) : val.trim();
    return cleaned.toLowerCase();
  })
  .pipe(
    z
      .string()
      .max(39, 'Username must be 39 characters or less')
      .regex(
        /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
        'Username must contain only alphanumeric characters and hyphens'
      )
  );

/**
 * Theme name validation schema
 * - Must be a valid theme from the registry
 * - Case-insensitive
 * - Defaults to 'satan' if not provided
 */
export const themeSchema = z
  .string()
  .optional()
  .default('satan')
  .transform((val) => {
    const normalized = val?.toLowerCase() as ThemeName;
    if (validThemeNames.includes(normalized)) {
      return normalized;
    }
    return 'satan' as ThemeName; // Fallback to default
  });

/**
 * Complete card API query parameters schema
 * Username is optional at schema level, but we validate it if provided
 */
export const cardQuerySchema = z.object({
  username: usernameSchema.optional().or(z.literal('')),
  theme: themeSchema,
});

/**
 * Type inference from schema
 */
export type CardQueryParams = z.infer<typeof cardQuerySchema>;

/**
 * Validate and parse query parameters
 *
 * @param params - Raw query parameters from Next.js
 * @returns Validated and parsed parameters
 * @throws ZodError if validation fails
 */
export function validateCardQuery(params: {
  username: string | null;
  theme?: string | null;
}): CardQueryParams {
  // Normalize empty strings to undefined
  const normalizedUsername =
    params.username && params.username.trim() !== ''
      ? params.username.trim()
      : undefined;

  const result = cardQuerySchema.parse({
    username: normalizedUsername,
    theme: params.theme || undefined,
  });

  // Return with username as undefined if empty, so API can handle it
  return {
    ...result,
    username: result.username && result.username !== '' ? result.username : undefined,
  };
}

/**
 * Widget query schema (used by stats, languages, streak widgets)
 * Username is required for widgets
 */
export const widgetQuerySchema = z.object({
  username: usernameSchema,
  theme: themeSchema,
});

export type WidgetQueryParams = z.infer<typeof widgetQuerySchema>;

/**
 * Validate widget query parameters
 *
 * @param params - Raw query parameters
 * @returns Validated parameters
 * @throws ZodError if validation fails
 */
export function validateWidgetQuery(params: {
  username: string | null;
  theme?: string | null;
}): WidgetQueryParams {
  if (!params.username || params.username.trim() === '') {
    throw new Error('Username is required');
  }

  return widgetQuerySchema.parse({
    username: params.username.trim(),
    theme: params.theme || undefined,
  });
}

/**
 * Repo widget query schema
 * Requires both username and repo name
 */
export const repoQuerySchema = z.object({
  username: usernameSchema,
  repo: z
    .string()
    .min(1, 'Repository name is required')
    .max(100, 'Repository name must be 100 characters or less'),
  theme: themeSchema,
});

export type RepoQueryParams = z.infer<typeof repoQuerySchema>;

/**
 * Validate repo widget query parameters
 *
 * @param params - Raw query parameters
 * @returns Validated parameters
 * @throws ZodError if validation fails
 */
export function validateRepoQuery(params: {
  username: string | null;
  repo: string | null;
  theme?: string | null;
}): RepoQueryParams {
  if (!params.username || params.username.trim() === '') {
    throw new Error('Username is required');
  }
  if (!params.repo || params.repo.trim() === '') {
    throw new Error('Repository name is required');
  }

  return repoQuerySchema.parse({
    username: params.username.trim(),
    repo: params.repo.trim(),
    theme: params.theme || undefined,
  });
}
