import { Flame } from "lucide-react";
import InsightCard from "./InsightCard";

/**
 * Displays study streak information.
 * Shows current streak, longest streak, and visual indicator.
 */
function StudyStreakWidget({ streak }) {
  if (!streak) return null;

  return (
    <InsightCard title="Study Streak" icon={Flame}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-[22px] font-bold text-gold">{streak.currentDays}</span>
          <span className="text-[10px] text-ink-faint">days</span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-ink-soft">Current</span>
            <span className="text-[11px] font-medium text-ink">{streak.currentDays} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-ink-soft">Longest</span>
            <span className="text-[11px] font-medium text-ink">{streak.longestDays} days</span>
          </div>
          <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{
                width: `${Math.min(100, (streak.currentDays / streak.longestDays) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </InsightCard>
  );
}

export default StudyStreakWidget;
