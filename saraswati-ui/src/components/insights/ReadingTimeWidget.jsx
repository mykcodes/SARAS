import { Clock } from "lucide-react";
import InsightCard from "./InsightCard";

/**
 * Shows reading time statistics: total, average per document, last session.
 */
function ReadingTimeWidget({ readingTime }) {
  if (!readingTime) return null;

  const hours = Math.floor(readingTime.totalMinutes / 60);
  const mins = readingTime.totalMinutes % 60;

  return (
    <InsightCard title="Reading Time" icon={Clock}>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[18px] font-semibold text-ink">
            {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
          </span>
          <span className="text-[10.5px] text-ink-faint">total</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-ink-soft">
          <span>~{readingTime.avgPerDoc}m / doc</span>
          <span className="h-0.5 w-0.5 rounded-full bg-ink-faint" />
          <span>Last: {readingTime.lastSession}m</span>
        </div>
      </div>
    </InsightCard>
  );
}

export default ReadingTimeWidget;
