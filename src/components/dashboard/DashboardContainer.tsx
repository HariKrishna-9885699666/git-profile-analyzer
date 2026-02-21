"use client";

import { useState, useMemo } from "react";
import { GitHubUser, GitHubRepo, ContributionsCollection } from "@/lib/types";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { ActivityScore } from "@/components/dashboard/ActivityScore";
import { LanguageChart } from "@/components/dashboard/LanguageChart";
import { RepoStatsChart } from "@/components/dashboard/RepoStatsChart";
import { CommitGraph } from "@/components/dashboard/CommitGraph";
import { Heatmap } from "@/components/dashboard/Heatmap";
import { RepoList } from "@/components/dashboard/RepoList";
import { Github, Download, Share2, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { toPng } from 'html-to-image';
import { cn } from "@/lib/utils";

type TimeFilter = 'all' | '1y' | '6m' | '30d';

export function DashboardContainer({ 
  username,
  initialData 
}: { 
  username: string;
  initialData: {
    profile: GitHubUser;
    repos: GitHubRepo[];
    contributions: ContributionsCollection | null;
  }
}) {
  const [data] = useState(initialData);
  const [exporting, setExporting] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const handleExport = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;
    
    setExporting(true);
    try {
      const dataUrl = await toPng(element, { cacheBust: true, backgroundColor: '#09090b' });
      const link = document.createElement('a');
      link.download = `git-profile-${username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const { profile, repos, contributions } = data;

  const filteredRepos = useMemo(() => {
    if (timeFilter === 'all') return repos;
    const now = Date.now();
    const limits = {
      '1y': 365 * 24 * 60 * 60 * 1000,
      '6m': 180 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    return repos.filter(r => now - new Date(r.pushed_at).getTime() < limits[timeFilter as keyof typeof limits]);
  }, [repos, timeFilter]);

  // Activity Score algorithm (dynamic based on filter)
  const recentThreshold = 365 * 24 * 60 * 60 * 1000;
  const recentReposCount = filteredRepos.filter(r => new Date(r.pushed_at).getTime() > Date.now() - recentThreshold).length;
  const score = Math.min(100, (recentReposCount * 5) + Math.min(80, (profile.followers * 0.1) + filteredRepos.length));
  
  const commitsLastYear = contributions?.contributionCalendar.totalContributions ?? -1;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Github className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Git Profile Analyzer</span>
        </Link>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-card border border-border rounded-xl p-1 items-center">
            {(['all', '1y', '6m', '30d'] as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider",
                  timeFilter === f 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-gray-500 hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:bg-card/80 transition-colors text-sm font-medium"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export
          </button>
        </div>
      </div>

      <div id="dashboard-content" className="space-y-6 sm:space-y-8 bg-background p-1">
        <ProfileHeader profile={profile} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ActivityScore score={score} commitsLastYear={commitsLastYear} />
          </div>
          <div className="md:col-span-2">
            <LanguageChart repos={filteredRepos} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-3xl h-[350px]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Commit Trends
             </h3>
            <CommitGraph contributions={contributions} timeFilter={timeFilter} />
          </div>
          <div className="h-[350px]">
            <RepoStatsChart repos={filteredRepos} />
          </div>
        </div>
        
        <div className="w-full">
          <Heatmap contributions={contributions} />
        </div>

        <div className="border-t border-border/50 pt-8 mt-8">
          <RepoList repos={filteredRepos} username={username} totalRepos={profile.public_repos} />
        </div>
      </div>
    </div>
  );
}
