"use server";

import { getUserRepos } from "@/lib/github";
import { GitHubRepo } from "@/lib/types";

export async function fetchMoreRepos(username: string, page: number): Promise<{ repos: GitHubRepo[], error?: string }> {
  try {
    // GitHub API pagination starts at 1
    // We already fetched page 1 (100 repos) in the page.tsx
    // So 'page' here should probably start from 2 if we want more than 100.
    const endpoint = `/users/${username}/repos?per_page=100&sort=pushed&page=${page}`;
    
    // We need to re-implement or call the same fetch logic.
    // getUserRepos is optimized for page 1. Let's make it more generic or just use a new function.
    
    // Importing from @/lib/github which uses process.env.GITHUB_PAT
    // This is safe because 'use server' ensures it runs on the server.
    
    // For now, let's call a slightly modified version of getUserRepos or just fetch here.
    const GITHUB_API_BASE = "https://api.github.com";
    const SERVER_TOKEN = process.env.GITHUB_PAT;

    const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
    };
    if (SERVER_TOKEN) {
        headers["Authorization"] = `Bearer ${SERVER_TOKEN}`;
    }

    const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
        headers,
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
            return { repos: [], error: "Rate limit exceeded. Please try again later." };
        }
        return { repos: [], error: `Failed to fetch repos: ${res.statusText}` };
    }

    const repos = await res.json();
    return { repos };
  } catch (err) {
    return { repos: [], error: (err as Error).message };
  }
}
