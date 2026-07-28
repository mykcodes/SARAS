import { Link } from "react-router-dom";
import { Star, Sparkles, FileStack } from "lucide-react";
import FileTypeIcon from "./FileTypeIcon";
import DocumentActionsMenu from "./DocumentActionsMenu";
import { formatFileSize, formatRelativeTime } from "../../lib/formatters";
import { FILE_TYPE_LABELS } from "../../lib/utils";
import { useWorkspace } from "../../context/WorkspaceContext";

function DocumentCard({ document, subjectId }) {
  const { toggleFavorite } = useWorkspace();
  const typeConfig = FileTypeIcon.getConfig(document.type);

  return (
    <Link
      to={`/subjects/${subjectId}/documents/${document.id}`}
      className="card-hover group flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface p-4"
    >
      {/* Top row: icon + actions */}
      <div className="flex items-start justify-between">
        <FileTypeIcon type={document.type} size={20} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(document.id);
            }}
            className={`rounded-md p-1.5 transition-colors ${
              document.favorite
                ? "text-gold"
                : "text-ink-faint hover:text-gold opacity-0 group-hover:opacity-100"
            }`}
            aria-label={document.favorite ? "Unfavorite" : "Favorite"}
          >
            <Star size={14} fill={document.favorite ? "currentColor" : "none"} />
          </button>
          <DocumentActionsMenu documentId={document.id} />
        </div>
      </div>

      {/* Title + type badge */}
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-ink">{document.title}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="rounded-md px-1.5 py-0.5 text-[10.5px] font-medium"
            style={{ backgroundColor: typeConfig.bg, color: typeConfig.color, border: `1px solid ${typeConfig.border}` }}
          >
            {FILE_TYPE_LABELS[document.type] ?? document.type}
          </span>
          <span className="text-[11.5px] text-ink-faint">{formatFileSize(document.size)}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 border-t border-border-subtle pt-3 text-[11px] text-ink-faint">
        <span className="flex items-center gap-1">
          <FileStack size={12} />
          {document.pages} {document.pages === 1 ? "page" : "pages"}
        </span>
        <span className="h-0.5 w-0.5 rounded-full bg-ink-faint" />
        <span>{formatRelativeTime(document.uploadedAt)}</span>
      </div>

      {/* AI index badge */}
      <div className="flex items-center gap-1.5">
        <Sparkles size={11} className={document.indexed ? "text-gold" : "text-ink-faint"} />
        <span className={`text-[10.5px] ${document.indexed ? "text-gold" : "text-ink-faint"}`}>
          {document.indexed ? "AI Indexed" : "Not Indexed"}
        </span>
      </div>
    </Link>
  );
}

export default DocumentCard;
