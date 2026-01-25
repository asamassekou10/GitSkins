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
  ExtendedGitHubData,
  LanguageStat,
  CompactStats,
  RepoData,
} from '@/types';
import { githubConfig } from '@/config/site';
import { calculateStreaks } from './streak-calculator';

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

/**
 * Extended GraphQL query for widget data
 * Includes languages, followers, and pinned repos
 */
const EXTENDED_GRAPHQL_QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      followers {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          stargazers {
            totalCount
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
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
    }
  }
`;

/**
 * Extended GraphQL response type
 */
interface ExtendedGraphQLResponse {
  user: {
    name: string | null;
    bio: string | null;
    avatarUrl: string;
    followers: {
      totalCount: number;
    };
    repositories: {
      totalCount: number;
      nodes: Array<{
        stargazers: {
          totalCount: number;
        };
        languages: {
          edges: Array<{
            size: number;
            node: {
              name: string;
              color: string | null;
            };
          }>;
        };
      }>;
    };
    pinnedItems: {
      nodes: Array<{
        name: string;
        description: string | null;
        stargazerCount: number;
        forkCount: number;
        primaryLanguage: {
          name: string;
          color: string;
        } | null;
      }>;
    };
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
  } | null;
}

/**
 * Repository data type for language aggregation
 */
type RepositoriesData = NonNullable<ExtendedGraphQLResponse['user']>['repositories'];

/**
 * Aggregate language statistics from repositories
 */
function aggregateLanguages(repos: RepositoriesData): LanguageStat[] {
  const totals = new Map<string, { bytes: number; color: string }>();

  for (const repo of repos.nodes) {
    for (const edge of repo.languages.edges) {
      const existing = totals.get(edge.node.name) || {
        bytes: 0,
        color: edge.node.color || '#808080',
      };
      existing.bytes += edge.size;
      totals.set(edge.node.name, existing);
    }
  }

  const totalBytes = Array.from(totals.values()).reduce(
    (sum, lang) => sum + lang.bytes,
    0
  );

  if (totalBytes === 0) {
    return [];
  }

  return Array.from(totals.entries())
    .map(([name, data]) => ({
      name,
      color: data.color,
      bytes: data.bytes,
      percentage: Math.round((data.bytes / totalBytes) * 100),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5);
}

/**
 * Fetch extended GitHub user data for widgets
 *
 * @param username - GitHub username (validated)
 * @returns ExtendedGitHubData object or null if user not found
 */
export async function fetchExtendedGitHubData(
  username: string
): Promise<ExtendedGitHubData | null> {
  try {
    const response = await octokit.graphql<ExtendedGraphQLResponse>(
      EXTENDED_GRAPHQL_QUERY,
      {
        username,
      }
    );

    if (!response.user) {
      return null;
    }

    const { user } = response;
    const weeks = user.contributionsCollection.contributionCalendar.weeks;

    // Calculate total stars
    const totalStars = user.repositories.nodes.reduce(
      (sum, repo) => sum + repo.stargazers.totalCount,
      0
    );

    // Aggregate languages
    const languages = aggregateLanguages(user.repositories);

    // Calculate streaks
    const streak = calculateStreaks(weeks);

    // Build compact stats
    const stats: CompactStats = {
      totalStars,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      totalRepos: user.repositories.totalCount,
      followers: user.followers.totalCount,
    };

    // Transform pinned repos
    const pinnedRepos: RepoData[] = user.pinnedItems.nodes.map((repo) => ({
      name: repo.name,
      description: repo.description,
      stargazerCount: repo.stargazerCount,
      forkCount: repo.forkCount,
      primaryLanguage: repo.primaryLanguage,
    }));

    return {
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      totalStars,
      topLanguages: [],
      contributionCalendar: { weeks },
      streak,
      languages,
      stats,
      pinnedRepos,
    };
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

/**
 * Extended GraphQL query for README generation
 * Includes social links, location, company, etc.
 */
const README_GENERATOR_QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      location
      company
      websiteUrl
      twitterUsername
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          stargazers {
            totalCount
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
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
    }
  }
`;

/**
 * README Generator GraphQL response type
 */
interface ReadmeGeneratorResponse {
  user: {
    name: string | null;
    bio: string | null;
    avatarUrl: string;
    location: string | null;
    company: string | null;
    websiteUrl: string | null;
    twitterUsername: string | null;
    followers: { totalCount: number };
    following: { totalCount: number };
    repositories: {
      totalCount: number;
      nodes: Array<{
        stargazers: { totalCount: number };
        languages: {
          edges: Array<{
            size: number;
            node: { name: string; color: string | null };
          }>;
        };
      }>;
    };
    pinnedItems: {
      nodes: Array<{
        name: string;
        description: string | null;
        url: string;
        stargazerCount: number;
        forkCount: number;
        primaryLanguage: { name: string; color: string } | null;
      }>;
    };
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
  } | null;
}

/**
 * Extended profile data type for README generator
 */
export interface ExtendedProfileData {
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  company: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  followers: number;
  following: number;
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
  languages: Array<{ name: string; color: string; percentage: number }>;
  pinnedRepos: Array<{
    name: string;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    url: string;
  }>;
  streak: { current: number; longest: number; totalDays: number };
}

/**
 * Fetch extended profile data for README generation
 */
export async function fetchProfileForReadme(
  username: string
): Promise<ExtendedProfileData | null> {
  try {
    const response = await octokit.graphql<ReadmeGeneratorResponse>(
      README_GENERATOR_QUERY,
      { username }
    );

    if (!response.user) {
      return null;
    }

    const { user } = response;
    const weeks = user.contributionsCollection.contributionCalendar.weeks;

    // Calculate total stars
    const totalStars = user.repositories.nodes.reduce(
      (sum, repo) => sum + repo.stargazers.totalCount,
      0
    );

    // Aggregate languages
    const langTotals = new Map<string, { bytes: number; color: string }>();
    for (const repo of user.repositories.nodes) {
      for (const edge of repo.languages.edges) {
        const existing = langTotals.get(edge.node.name) || {
          bytes: 0,
          color: edge.node.color || '#808080',
        };
        existing.bytes += edge.size;
        langTotals.set(edge.node.name, existing);
      }
    }

    const totalBytes = Array.from(langTotals.values()).reduce(
      (sum, lang) => sum + lang.bytes,
      0
    );

    const languages = totalBytes > 0
      ? Array.from(langTotals.entries())
          .map(([name, data]) => ({
            name,
            color: data.color,
            percentage: Math.round((data.bytes / totalBytes) * 100),
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 8)
      : [];

    // Calculate streaks
    const streak = calculateStreaks(weeks);

    // Transform pinned repos
    const pinnedRepos = user.pinnedItems.nodes.map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage?.name || null,
      url: repo.url,
    }));

    return {
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      location: user.location,
      company: user.company,
      websiteUrl: user.websiteUrl,
      twitterUsername: user.twitterUsername,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
      totalStars,
      totalRepos: user.repositories.totalCount,
      languages,
      pinnedRepos,
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        totalDays: streak.totalActiveDays,
      },
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'errors' in error &&
      Array.isArray(error.errors)
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

    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.includes('Could not resolve')
    ) {
      return null;
    }

    throw error;
  }
}

/**
 * Fetch a specific repository's data
 *
 * @param username - GitHub username
 * @param repoName - Repository name
 * @returns RepoData object or null if not found
 */
export async function fetchRepoData(
  username: string,
  repoName: string
): Promise<RepoData | null> {
  const REPO_QUERY = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        name
        description
        stargazerCount
        forkCount
        primaryLanguage {
          name
          color
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql<{
      repository: {
        name: string;
        description: string | null;
        stargazerCount: number;
        forkCount: number;
        primaryLanguage: { name: string; color: string } | null;
      } | null;
    }>(REPO_QUERY, {
      owner: username,
      name: repoName,
    });

    if (!response.repository) {
      return null;
    }

    return {
      name: response.repository.name,
      description: response.repository.description,
      stargazerCount: response.repository.stargazerCount,
      forkCount: response.repository.forkCount,
      primaryLanguage: response.repository.primaryLanguage,
    };
  } catch {
    return null;
  }
}
