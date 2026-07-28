import { AlertTriangle } from "lucide-react";
import InsightCard from "./InsightCard";

/**
 * Displays topics where the student's confidence is low.
 * Each topic shows a confidence percentage bar.
 */
function WeakTopicsWidget({ topics }) {
  if (!topics || topics.length === 0) return null;

  return (
    <InsightCard title="Weak Topics" icon={AlertTriangle}>
      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <div key={topic.name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-ink-soft">{topic.name}</span>
              <span className="text-[10.5px] text-ink-faint">{topic.confidence}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${topic.confidence}%`,
                  background:
                    topic.confidence < 25
                      ? "#ef4444"
                      : topic.confidence < 40
                      ? "#f59e0b"
                      : "var(--color-gold)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

export default WeakTopicsWidget;
