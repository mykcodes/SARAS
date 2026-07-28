import { FileText, Upload, Star, Trash2, StickyNote } from "lucide-react";
import InsightCard from "./InsightCard";
import { formatRelativeTime } from "../../lib/formatters";
import { getActivitiesBySubject } from "../../services/activityService";

const ACTION_ICONS = {
  opened: FileText,
  uploaded: Upload,
  favorited: Star,
  deleted: Trash2,
  pinned_note: StickyNote,
};

function RecentActivityWidget({ activities: staticActivities, subjectId }) {
  const liveActivities = subjectId
    ? getActivitiesBySubject(subjectId, 5)
    : [];

  const displayActivities = liveActivities.length > 0
    ? liveActivities
    : (staticActivities || []);

  if (!displayActivities || displayActivities.length === 0) return null;

  return (
    <InsightCard title="Recent Activity" icon={FileText}>
      <div className="flex flex-col gap-2">
        {displayActivities.slice(0, 5).map((activity, idx) => {
          const action = activity.action || activity.action;
          const Icon = ACTION_ICONS[action] || FileText;
          const target = activity.target;
          const time = activity.timestamp || activity.time;
          return (
            <div key={activity.id || idx} className="flex items-start gap-2">
              <Icon size={12} className="mt-0.5 shrink-0 text-ink-faint" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] text-ink-soft">
                  {target}
                </p>
                <p className="text-[10px] text-ink-faint">
                  {formatRelativeTime(time)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </InsightCard>
  );
}

export default RecentActivityWidget;
