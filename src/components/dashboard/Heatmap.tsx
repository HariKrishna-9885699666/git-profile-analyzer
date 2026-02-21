"use client";

import { ContributionsCollection } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Info } from "lucide-react";

export function Heatmap({ contributions }: { contributions: ContributionsCollection | null }) {
  if (!contributions) {
    return (
      <div className="glass rounded-3xl p-6 h-full flex items-center justify-center flex-col text-gray-500 text-center min-h-[200px]">
        <p className="mb-2">Contribution graph requires a Personal Access Token.</p>
        <p className="text-sm">Provide a token to see full visual heatmap.</p>
      </div>
    );
  }

  const { weeks } = contributions.contributionCalendar;

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-800/20 dark:bg-zinc-800/40";
    if (count < 5) return "bg-[#39d353]/30";
    if (count < 10) return "bg-[#39d353]/50";
    if (count < 20) return "bg-[#39d353]/80";
    return "bg-[#39d353]";
  };

  return (
    <div className="glass rounded-3xl p-6 w-full flex flex-col items-center xl:items-start overflow-x-auto">
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
          Contribution Activity 
          <Info className="w-4 h-4 text-gray-500" />
        </h3>
        <span className="text-sm font-medium text-gray-400">
          Last 12 months
        </span>
      </div>

      <div className="flex gap-1 xl:gap-1.5 p-2 overflow-x-auto no-scrollbar w-full min-w-max pb-4">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1 xl:gap-1.5">
            {week.contributionDays.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                title={`${day.contributionCount} contributions on ${day.date ? format(parseISO(day.date), "MMM d, yyyy") : ""}`}
                className={`w-3 h-3 xl:w-4 xl:h-4 rounded-[3px] transition-transform hover:scale-125 hover:z-10 cursor-pointer ${getColor(day.contributionCount)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
