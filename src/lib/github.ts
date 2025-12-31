/**
 * GitSkins - GitHub API Client
 * 
 * GraphQL API integration for fetching user contribution data.
 * Handles errors gracefully and returns typed data structures.
 */

import { Octokit } from '@octokit/core';
import type {
  GitHubData,
  ContributionDay,
  ContributionWeek,
  Language,
} from '@/types';
import { githubConfig } from '@/config/site';

/**
 * Initialize Octokit client
 */
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN environment variable is required');
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

/**
 * GitHub GraphQL query for user contribution data
 * 
 * Uses the exact query structure as specified:
 * - stargazers { totalCount } instead of stargazerCount
 * - Simplified structure for star calculation
 */
const GITHUB_GRAPHQL_QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes { 
          stargazers { 
            totalCount 
          } 
        }
      }
    }
  }
`;

/**
 * GraphQL response type
 * Matches the exact query structure provided
 */
interface GitHubGraphQLResponse {
  user: {
    name: string | null;
    bio: string | null;
    avatarUrl: string;
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            contributionCount: number;
            date: string;
          }>;
        }>;
      };
    };
    repositories: {
      nodes: Array<{
        stargazers: {
          totalCount: number;
        };
      }>;
    };
  } | null;
}

/**
 * Calculate total stars from repository data
 * Sums up stargazers.totalCount from all repository nodes
 */
function calculateTotalStars(
  repositories: NonNullable<GitHubGraphQLResponse['user']>['repositories']
): number {
  return repositories.nodes.reduce(
    (sum, repo) => sum + repo.stargazers.totalCount,
    0
  );
}

/**
 * Transform GraphQL response to GitHubData
 */
function transformResponse(
  response: GitHubGraphQLResponse
): GitHubData | null {
  if (!response.user) {
    return null;
  }

  const { user } = response;

  return {
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    totalContributions:
      user.contributionsCollection.contributionCalendar.totalContributions,
    totalStars: calculateTotalStars(user.repositories),
    topLanguages: [], // Not included in the specified query
    contributionCalendar: {
      weeks: user.contributionsCollection.contributionCalendar.weeks,
    },
  };
}

/**
 * Fetch GitHub user data via GraphQL API
 * 
 * @param username - GitHub username (validated)
 * @returns GitHubData object or null if user not found
 * @throws Error for API failures (rate limits, network errors, etc.)
 */
export async function fetchGitHubData(
  username: string
): Promise<GitHubData | null> {
  try {
    const response = await octokit.graphql<GitHubGraphQLResponse>(
      GITHUB_GRAPHQL_QUERY,
      {
        username,
      }
    );

    return transformResponse(response);
  } catch (error: unknown) {
    // Handle "User Not Found" errors
    if (
      error &&
      typeof error === 'object' &&
      'errors' in error &&
      Array.isArray(error.errors) &&
      error.errors.length > 0
    ) {
      const firstError = error.errors[0];
      if (
        typeof firstError === 'object' &&
        firstError !== null &&
        'type' in firstError &&
        firstError.type === 'NOT_FOUND'
      ) {
        return null;
      }
    }

    // Handle other GraphQL errors
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.includes('Could not resolve')
    ) {
      return null;
    }

    // Re-throw unexpected errors
    throw error;
  }
}
