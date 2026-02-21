"use client";

import { GitHubRepo } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function RepoStatsChart({ repos }: { repos: GitHubRepo[] }) {
  const topRepos = [...repos]
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(r => ({
      name: r.name,
      Stars: r.stargazers_count,
      Forks: r.forks_count,
    }));

  if (topRepos.length === 0) {
    return (
      <div className="glass rounded-3xl p-6 h-full flex items-center justify-center flex-col text-gray-400">
        <p>No public repos available</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-foreground/90">Top Repositories</h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topRepos} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Stars" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Forks" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
