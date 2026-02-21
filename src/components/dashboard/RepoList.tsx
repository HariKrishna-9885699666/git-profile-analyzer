"use client";

import { useState, useEffect } from "react";
import { GitHubRepo } from "@/lib/types";
import { Star, GitFork, Book, ExternalLink, Calendar, Plus, Loader2, AlertCircle, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { fetchMoreRepos } from "@/app/actions";

export function RepoList({ 
  repos: initialRepos, 
  username, 
  totalRepos 
}: { 
  repos: GitHubRepo[]; 
  username: string;
  totalRepos: number;
}) {
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>(initialRepos);
  const [displayCount, setDisplayCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(2); // Page 1 fetched on server
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAllRepos(initialRepos);
    setDisplayCount(20);
    setPage(2);
    setError(null);
  }, [initialRepos]);

  const sortedRepos = [...allRepos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
  
  const displayedRepos = sortedRepos.slice(0, displayCount);

  const handleShowMore = async () => {
    if (displayCount < allRepos.length) {
      setDisplayCount(prev => Math.min(prev + 20, allRepos.length));
      return;
    }

    if (allRepos.length < totalRepos) {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMoreRepos(username, page);
        if (result.error) {
          setError(result.error);
        } else if (result.repos.length > 0) {
          setAllRepos(prev => [...prev, ...result.repos]);
          setPage(prev => prev + 1);
          setDisplayCount(prev => prev + 20);
        } else {
          setDisplayCount(allRepos.length);
        }
      } catch (err) {
        setError("Failed to load more repositories.");
      } finally {
        setLoading(false);
      }
    }
  };

  const hasMore = displayCount < totalRepos || displayCount < allRepos.length;

  if (displayedRepos.length === 0 && !loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Book className="w-5 h-5 text-primary" />
          Repositories ({totalRepos})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedRepos.map((repo) => (
          <div
            key={repo.id}
            className="group glass p-5 rounded-2xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full border border-border/50 relative"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 truncate">
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-lg hover:text-primary transition-colors truncate flex items-center gap-2"
                >
                  <span className="truncate">{repo.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors shrink-0" />
                </a>
                {repo.fork && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-border/50 text-gray-400 font-bold uppercase tracking-wider">
                    Fork
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
              {repo.description || "No description provided."}
            </p>

            {repo.homepage && (
              <div className="mb-4">
                <a
                  href={repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </a>
              </div>
            )}

            <div className="flex items-center flex-wrap gap-4 text-xs font-semibold text-gray-400">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>{repo.language}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5" />
                <span>{repo.forks_count.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1 ml-auto text-[10px] uppercase tracking-tighter opacity-70">
                <Calendar className="w-3 h-3" />
                <span>
                  Updated {mounted ? formatDistanceToNow(new Date(repo.pushed_at), { addSuffix: true }) : "recently"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleShowMore}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all text-sm font-bold shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
