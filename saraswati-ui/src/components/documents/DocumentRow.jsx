import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Sparkles, Check } from "lucide-react";
import FileTypeIcon from "./FileTypeIcon";
import DocumentActionsMenu from "./DocumentActionsMenu";
import { formatFileSize, formatRelativeTime, formatDate } from "../../lib/formatters";
import { FILE_TYPE_LABELS } from "../../lib/utils";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useApp } from "../../context/AppContext";

const DocumentRow = memo(function DocumentRow({ document, subjectId }) {
  const { toggleFavorite, toggleSelection, selectedDocIds, hasSelection, removeDocument, openContextMenu } = useWorkspace();
  const { trashDocument, openDetailsDrawer, addToast, trackActivity } = useApp();
  const navigate = useNavigate();
  const typeConfig = FileTypeIcon.getConfig(document.type);
  const isSelected = selectedDocIds.includes(document.id);

  const handleAction = (actionId) => {
    // Actions are now handled by the global context menu logic in SubjectWorkspacePage
    openContextMenu(document.id, 0, 0); // fallback if ever called directly
  };

  const handleClick = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      toggleSelection(document.id);
      return;
    }
    if (hasSelection) {
      e.preventDefault();
      toggleSelection(document.id);
      return;
    }
    trackActivity("opened", document.title, { targetType: "document", subjectId, documentId: document.id });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(document.id, e.clientX, e.clientY);
  };

  return (
    <Link
      to={`/subjects/${subjectId}/documents/${document.id}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`card-hover group flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors ${
        isSelected
          ? "border-gold/40 bg-gold/5"
          : "border-border-subtle bg-surface hover:bg-surface-soft"
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSelection(document.id);
        }}
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded transition-all ${
          isSelected
            ? "bg-gold text-bg"
            : hasSelection
              ? "border border-border-default bg-surface-soft text-transparent hover:border-gold/50"
              : "border border-transparent bg-transparent text-transparent opacity-0 group-hover:border-border-default group-hover:bg-surface-soft group-hover:opacity-100"
        }`}
      >
        <Check size={11} strokeWidth={2.5} />
      </button>

      <FileTypeIcon type={document.type} size={16} />

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

      <span className="w-[72px] shrink-0 text-right text-[12px] text-ink-faint">
        {formatFileSize(document.size)}
      </span>

      <span className="w-[52px] shrink-0 text-right text-[12px] text-ink-faint">
        {document.pages}p
      </span>

      <span className="w-[90px] shrink-0 text-right text-[12px] text-ink-faint">
        {formatDate(document.uploadedAt)}
      </span>

      <span className="w-[80px] shrink-0 text-right text-[12px] text-ink-faint">
        {document.lastOpened ? formatRelativeTime(document.lastOpened) : "—"}
      </span>



      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(document.id);
          trackActivity(document.favorite ? "unfavorited" : "favorited", document.title, { targetType: "document", subjectId, documentId: document.id });
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

      <DocumentActionsMenu documentId={document.id} onAction={handleAction} />
    </Link>
  );
});

export default DocumentRow;
