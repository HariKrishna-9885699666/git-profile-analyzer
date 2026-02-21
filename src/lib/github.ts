import { GitHubUser, GitHubRepo, ContributionsCollection } from "./types";

const GITHUB_API_BASE = "https://api.github.com";
const SERVER_TOKEN = process.env.GITHUB_PAT;

export class RateLimitError extends Error {
  constructor(message = "GitHub API rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "User not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

async function fetchGitHub<T>(
  endpoint: string,
  token?: string | null,
  options?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    ...((options?.headers as Record<string, string>) || {}),
  };

  const authToken = token || SERVER_TOKEN;

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${GITHUB_API_BASE}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new NotFoundError();
    }
    if (res.status === 403 || res.status === 429) {
      // Check for rate limit
      const remaining = res.headers.get("x-ratelimit-remaining");
      if (remaining === "0") {
        throw new RateLimitError();
      }
    }
    throw new Error(`GitHub API error: ${res.statusText}`);
  }

  return res.json();
}

export async function getUserProfile(username: string, token?: string | null): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${username}`, token, {
    next: { revalidate: 3600 },
  });
}

export async function getUserRepos(username: string, token?: string | null): Promise<GitHubRepo[]> {
  // Fetch up to 100 repos per page to get a good sample for language/repo stats
  return fetchGitHub<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=pushed`, token, {
    next: { revalidate: 3600 },
  });
}

// NextJS data cache handles the caching.
// We also need GraphQL for contributions graph, but REST is often sufficient if we don't have a token.
// GraphQL requires auth. The PRD says "visual replication of GitHub's contribution graph". 
// To get contribution heatmap WITHOUT auth, we have to either scrape or use a third-party open API because GitHub's REST API doesn't expose the contribution graph well, and GraphQL requires a token.
// PRD: "Source: GitHub REST API & GraphQL API."
// For MVP, we can proxy to a public contribution API or just use the events API as a fallback if no token.
// Wait, we can fetch recent events instead, or use the `https://github-contributions-api.jasonbarry.app/` or similar.
// Actually, `https://github-contributions-api.jasonbarry.app/v1/${username}` is a common community endpoint, or we can use GraphQL if token is present.
// Let's implement GraphQL fetch for contributions, which expects a token.
export async function getContributions(username: string, token?: string | null): Promise<ContributionsCollection | null> {
  const authToken = token || SERVER_TOKEN;

  if (!authToken) {
    // Cannot use GraphQL without token.
    return null;
  }

  const query = `
    query {
      user(login: "${username}") {
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

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    if (res.status === 403) throw new RateLimitError();
    throw new Error("Failed to fetch contributions");
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data.user.contributionsCollection;
}
