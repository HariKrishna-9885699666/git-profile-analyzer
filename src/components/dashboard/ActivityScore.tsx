import { Activity } from "lucide-react";

interface ActivityScoreProps {
  score: number; // 0-100
  commitsLastYear: number;
}

export function ActivityScore({ score, commitsLastYear }: ActivityScoreProps) {
  // Determine color based on score
  let colorClass = "text-red-500";
  let ringClass = "stroke-red-500";
  if (score > 40) {
    colorClass = "text-yellow-500";
    ringClass = "stroke-yellow-500";
  }
  if (score > 70) {
    colorClass = "text-accent"; // green variant
    ringClass = "stroke-accent";
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = Math.max(0, circumference - (score / 100) * circumference);

  return (
    <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[220px]">
      <div className="flex items-center gap-2 mb-4 w-full justify-start text-foreground/80 font-medium whitespace-nowrap">
        <Activity className="w-5 h-5 text-primary" />
        Activity Score
      </div>
      
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="stroke-card-foreground/5"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${ringClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tracking-tighter ${colorClass}`}>
            {Math.round(score)}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">
            Out of 100
          </span>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm font-medium text-gray-400">
        {commitsLastYear > 0 ? (
          <><span className="text-foreground">{commitsLastYear.toLocaleString()}</span> commits in the last year</>
        ) : (
          <span className="text-foreground/50 italic">Total commits hidden without token</span>
        )}
      </div>
    </div>
  );
}
