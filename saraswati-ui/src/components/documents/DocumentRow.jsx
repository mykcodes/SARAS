import { Link } from "react-router-dom";
import { Star, Sparkles } from "lucide-react";
import FileTypeIcon from "./FileTypeIcon";
import DocumentActionsMenu from "./DocumentActionsMenu";
import { formatFileSize, formatRelativeTime, formatDate } from "../../lib/formatters";
import { FILE_TYPE_LABELS } from "../../lib/utils";
import { useWorkspace } from "../../context/WorkspaceContext";

function DocumentRow({ document, subjectId }) {
  const { toggleFavorite } = useWorkspace();
  const typeConfig = FileTypeIcon.getConfig(document.type);

  return (
    <Link
      to={`/subjects/${subjectId}/documents/${document.id}`}
      className="card-hover group flex items-center gap-4 rounded-lg border border-border-subtle bg-surface px-4 py-3 transition-colors hover:bg-surface-soft"
    >
      {/* File type icon */}
      <FileTypeIcon type={document.type} size={16} />

      {/* Title + type */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <p className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">
          {document.title}
        </p>
        <span
          className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: typeConfig.bg, color: typeConfig.color, border: `1px solid ${typeConfig.border}` }}
        >
          {FILE_TYPE_LABELS[document.type] ?? document.type}
        </span>
      </div>

      {/* Size */}
      <span className="w-[72px] shrink-0 text-right text-[12px] text-ink-faint">
        {formatFileSize(document.size)}
      </span>

      {/* Pages */}
      <span className="w-[52px] shrink-0 text-right text-[12px] text-ink-faint">
        {document.pages}p
      </span>

      {/* Uploaded */}
      <span className="w-[90px] shrink-0 text-right text-[12px] text-ink-faint">
        {formatDate(document.uploadedAt)}
      </span>

      {/* Last opened */}
      <span className="w-[80px] shrink-0 text-right text-[12px] text-ink-faint">
        {document.lastOpened ? formatRelativeTime(document.lastOpened) : "—"}
      </span>

      {/* AI indexed */}
      <span className="flex w-[24px] shrink-0 items-center justify-center">
        <Sparkles
          size={13}
          className={document.indexed ? "text-gold" : "text-ink-faint"}
        />
      </span>

      {/* Favorite */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(document.id);
        }}
        className={`shrink-0 rounded-md p-1 transition-colors ${
          document.favorite
            ? "text-gold"
            : "text-ink-faint opacity-0 group-hover:opacity-100 hover:text-gold"
        }`}
        aria-label={document.favorite ? "Unfavorite" : "Favorite"}
      >
        <Star size={13} fill={document.favorite ? "currentColor" : "none"} />
      </button>

      {/* Actions */}
      <DocumentActionsMenu documentId={document.id} />
    </Link>
  );
}

export default DocumentRow;
