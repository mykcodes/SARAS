import { useState } from "react";
import { Clock, FileText, FolderOpen, Star, Trash2, Upload, StickyNote } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import { useApp } from "../context/AppContext";
import { formatRelativeTime } from "../lib/formatters";

const ACTION_ICONS = {
  opened: FileText,
  uploaded: Upload,
  created: FolderOpen,
  favorited: Star,
  unfavorited: Star,
  deleted: Trash2,
  pinned_note: StickyNote,
  restored: FileText,
};

const ACTION_LABELS = {
  opened: "Opened",
  uploaded: "Uploaded",
  created: "Created",
  favorited: "Favorited",
  unfavorited: "Unfavorited",
  deleted: "Deleted",
  pinned_note: "Pinned note",
  restored: "Restored",
};

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "opened", label: "Opened" },
  { key: "uploaded", label: "Uploaded" },
  { key: "favorited", label: "Favorited" },
  { key: "created", label: "Created" },
  { key: "deleted", label: "Deleted" },
];

function RecentPage() {
  const { getRecentActivities } = useApp();
  const [filter, setFilter] = useState("all");

  const activities = getRecentActivities(50);
  const filtered = filter === "all"
    ? activities
    : activities.filter((a) => a.action === filter);

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Recent Activity" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        <div className="mb-5 flex items-center gap-1.5">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                filter === f.key
                  ? "bg-gold/12 text-gold border border-gold/25"
                  : "text-ink-faint border border-transparent hover:text-ink-soft hover:bg-surface-hover"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-surface-soft">
              <Clock size={28} strokeWidth={1.4} className="text-ink-faint" />
            </span>
            <h3 className="text-[16px] font-semibold text-ink">No recent activity</h3>
            <p className="max-w-[320px] text-center text-[13px] text-ink-soft">
              Your recent actions will appear here as you use SARASWATI.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((activity) => {
              const Icon = ACTION_ICONS[activity.action] || FileText;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-lg border border-border-subtle bg-surface px-4 py-3 transition-colors hover:bg-surface-soft"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft">
                    <Icon size={16} strokeWidth={1.6} className="text-ink-soft" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-ink">
                      <span className="text-ink-soft">{ACTION_LABELS[activity.action] || activity.action}</span>{" "}
                      {activity.target}
                    </p>
                    {activity.subjectId && (
                      <p className="text-[11px] text-ink-faint">{activity.subjectId}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-[11.5px] text-ink-faint">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentPage;
