"use client";

import { GitHubRepo } from "@/lib/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#6b7280'];

export function LanguageChart({ repos }: { repos: GitHubRepo[] }) {
  // Calculate language distribution
  const langMap: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language && !repo.fork) {
      if (!langMap[repo.language]) {
        langMap[repo.language] = 0;
      }
      // approximation: weight by repo size
      langMap[repo.language] += repo.size;
    }
  });

  const rawData = Object.entries(langMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Take top 5, group rest as "Other"
  let data = rawData.slice(0, 5);
  if (rawData.length > 5) {
    const otherValue = rawData.slice(5).reduce((acc, curr) => acc + curr.value, 0);
    data.push({ name: "Other", value: otherValue });
  }

  if (data.length === 0) {
    return (
      <div className="glass rounded-3xl p-6 h-full flex items-center justify-center flex-col text-gray-400">
        <p>No language data available</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-foreground/90">Top Languages</h3>
      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${(value / 1024).toFixed(1)} MB`, "Approx Size"]}
              contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm font-medium">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
