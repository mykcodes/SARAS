import { Clock } from "lucide-react";
import InsightCard from "./InsightCard";
import { formatRelativeTime } from "../../lib/formatters";

function RecentActivityWidget({ activities }) {
  return (
    <InsightCard title="Recent Activity" icon={Clock}>
      {activities.length === 0 ? (
        <p className="text-[12px] text-ink-faint">No recent activity.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <div className="min-w-0">
                <p className="truncate text-[12px] text-ink">
                  <span className="text-ink-soft">{activity.action}</span>{" "}
                  {activity.target}
                </p>
                <p className="text-[10.5px] text-ink-faint">
                  {formatRelativeTime(activity.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </InsightCard>
  );
}

export default RecentActivityWidget;
