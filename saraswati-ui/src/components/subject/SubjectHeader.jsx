import {
  FileText,
  Sparkles,
  UploadCloud,
  HardDrive,
  Users,
  Share2,
  PanelRightOpen,
} from "lucide-react";
import { formatFileCount, formatRelativeTime, formatFileSize } from "../../lib/formatters";
import { useWorkspace } from "../../context/WorkspaceContext";

function SubjectHeader({ subject }) {
  const { openUploadModal, toggleInsights, insightsPanelOpen } = useWorkspace();

  const aiLabel =
    subject.aiMeta?.status === "indexed"
      ? "AI Indexed"
      : subject.aiMeta?.status === "partial"
      ? "Partially Indexed"
      : "Pending Index";

  const aiColor =
    subject.aiMeta?.status === "indexed"
      ? "text-emerald-400"
      : subject.aiMeta?.status === "partial"
      ? "text-gold"
      : "text-ink-faint";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-[18px] font-semibold text-ink">{subject.title}</h2>
          <p className="mt-1.5 max-w-[560px] text-[13px] leading-relaxed text-ink-soft">
            {subject.description}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openUploadModal}
            className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-[12px] text-ink-soft transition-colors hover:border-border-default hover:text-ink"
          >
            <UploadCloud size={14} />
            Upload
          </button>
          <button
            type="button"
            onClick={toggleInsights}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] transition-colors ${
              insightsPanelOpen
                ? "border-gold/25 bg-gold/8 text-gold"
                : "border-border-subtle bg-surface-soft text-ink-soft hover:border-border-default hover:text-ink"
            }`}
          >
            <PanelRightOpen size={14} />
            Insights
          </button>

          {/* Future placeholders */}
          <span className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-soft px-2.5 py-2 text-ink-faint" title="Collaboration — coming soon">
            <Users size={14} />
          </span>
          <span className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-soft px-2.5 py-2 text-ink-faint" title="Share — coming soon">
            <Share2 size={14} />
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-5 border-t border-border-subtle pt-4 text-[12.5px] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <FileText size={14} className="text-gold" />
          {formatFileCount(subject.fileCount)}
        </span>
        <span className="h-1 w-1 rounded-full bg-ink-faint" />
        <span className="flex items-center gap-1.5">
          <HardDrive size={13} className="text-ink-faint" />
          {formatFileSize(subject.storageUsed ?? 0)}
        </span>
        <span className="h-1 w-1 rounded-full bg-ink-faint" />
        <span>Updated {formatRelativeTime(subject.updatedAt)}</span>
        <span className="h-1 w-1 rounded-full bg-ink-faint" />
        <span className={`flex items-center gap-1.5 ${aiColor}`}>
          <Sparkles size={13} />
          {aiLabel}
        </span>
      </div>
    </div>
  );
}

export default SubjectHeader;