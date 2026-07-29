import { X, FileText, Calendar, HardDrive, FileStack, Clock, Sparkles, Tag } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatFileSize, formatDate, formatRelativeTime } from "../../lib/formatters";
import { FILE_TYPE_LABELS } from "../../lib/utils";
import FileTypeIcon from "./FileTypeIcon";
import TagInput from "../shared/TagInput";

function DocumentDetailsDrawer() {
  const { detailsDrawer, closeDetailsDrawer } = useApp();

  if (!detailsDrawer) return null;

  const doc = detailsDrawer;

  const metaRows = [
    { icon: FileText, label: "Type", value: FILE_TYPE_LABELS[doc.type] ?? doc.type },
    { icon: HardDrive, label: "Size", value: formatFileSize(doc.size) },
    { icon: FileStack, label: "Pages", value: `${doc.pages} ${doc.pages === 1 ? "page" : "pages"}` },
    { icon: Calendar, label: "Uploaded", value: formatDate(doc.uploadedAt) },
    { icon: Calendar, label: "Modified", value: formatDate(doc.updatedAt) },
    { icon: Clock, label: "Last Opened", value: doc.lastOpened ? formatRelativeTime(doc.lastOpened) : "Never" },
  ];

  const aiStatusLabel = doc.embeddingStatus === "complete"
    ? "Complete"
    : doc.embeddingStatus === "processing"
      ? "Processing…"
      : "Pending";

  const aiStatusColor = doc.embeddingStatus === "complete"
    ? "text-emerald-400"
    : doc.embeddingStatus === "processing"
      ? "text-gold"
      : "text-ink-faint";

  return (
    <div className="modal-overlay fixed inset-0 z-[70] flex justify-end bg-black/40" onClick={closeDetailsDrawer}>
      <aside
        className="slide-in-right flex h-full w-[340px] flex-col border-l border-border-subtle bg-bg-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h3 className="text-[15px] font-semibold text-ink">Document Details</h3>
          <button
            type="button"
            onClick={closeDetailsDrawer}
            className="rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          <div className="flex items-start gap-3">
            <FileTypeIcon type={doc.type} size={22} />
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-ink">{doc.title}</p>
              <p className="mt-0.5 text-[12px] text-ink-soft">{doc.subjectId}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Metadata
            </span>
            {metaRows.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                    <Icon size={13} className="text-ink-faint" />
                    {row.label}
                  </span>
                  <span className="text-[12.5px] text-ink">{row.value}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              AI Status
            </span>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                <Sparkles size={13} className="text-ink-faint" />
                Embedding
              </span>
              <span className={`text-[12.5px] ${aiStatusColor}`}>{aiStatusLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                <Sparkles size={13} className="text-ink-faint" />
                Indexed
              </span>
              <span className={`text-[12.5px] ${doc.indexed ? "text-emerald-400" : "text-ink-faint"}`}>
                {doc.indexed ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface p-4">
            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              <Tag size={11} />
              Tags
            </span>
            <TagInput itemType="document" itemId={doc.id} />
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Summary
            </span>
            <p className="text-[12px] leading-relaxed text-ink-faint">
              AI-generated summary will appear here once the document is fully indexed.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default DocumentDetailsDrawer;
