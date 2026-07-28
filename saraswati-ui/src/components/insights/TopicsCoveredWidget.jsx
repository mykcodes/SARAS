import { BookOpen, Check, Circle } from "lucide-react";
import InsightCard from "./InsightCard";

function TopicsCoveredWidget({ topics }) {
  const coveredCount = topics.filter((t) => t.covered).length;

  return (
    <InsightCard title="Topics Covered" icon={BookOpen}>
      <p className="mb-3 text-[11.5px] text-ink-faint">
        {coveredCount} of {topics.length} topics
      </p>
      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <div key={topic.name} className="flex items-center gap-2">
            {topic.covered ? (
              <Check size={13} className="shrink-0 text-emerald-400" />
            ) : (
              <Circle size={13} className="shrink-0 text-ink-faint" />
            )}
            <span
              className={`text-[12px] ${
                topic.covered ? "text-ink" : "text-ink-faint"
              }`}
            >
              {topic.name}
            </span>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

export default TopicsCoveredWidget;
