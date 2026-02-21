"use client";

import { ContributionsCollection } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

export function CommitGraph({ 
  contributions, 
  timeFilter = 'all' 
}: { 
  contributions: ContributionsCollection | null;
  timeFilter?: 'all' | '1y' | '6m' | '30d';
}) {
  if (!contributions) {
    return (
      <div className="h-full flex items-center justify-center flex-col text-gray-500 text-center">
        <p className="mb-2 font-medium">Commit history hidden without token.</p>
        <p className="text-xs opacity-60">Add a GitHub PAT to see trends.</p>
      </div>
    );
  }

  // Flatten the weeks to weeks total
  let data = contributions.contributionCalendar.weeks.map(week => {
    const total = week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0);
    const date = week.contributionDays[0]?.date;
    return {
      week: date ? format(parseISO(date), "MMM d") : "Unknown",
      commits: total
    };
  });

  // Filter based on timeRange
  if (timeFilter === '6m') data = data.slice(-26);
  if (timeFilter === '30d') data = data.slice(-5); // Roughly 5 weeks

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              labelStyle={{ color: '#888' }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#18181b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
