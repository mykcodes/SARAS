import { Hash } from "lucide-react";
import InsightCard from "./InsightCard";

/**
 * Displays the most frequently encountered concepts.
 * Each concept shows a horizontal bar relative to the max count.
 */
function FrequentConceptsWidget({ concepts }) {
  if (!concepts || concepts.length === 0) return null;

  const maxCount = Math.max(...concepts.map((c) => c.count));

  return (
    <InsightCard title="Frequent Concepts" icon={Hash}>
      <div className="flex flex-col gap-2">
        {concepts.map((concept) => (
          <div key={concept.name} className="flex items-center gap-2">
            <span className="w-[90px] truncate text-[11px] text-ink-soft">{concept.name}</span>
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
                <div
                  className="h-full rounded-full bg-gold/60 transition-all duration-500"
                  style={{ width: `${(concept.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-[22px] text-right text-[10px] text-ink-faint">{concept.count}</span>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

export default FrequentConceptsWidget;
