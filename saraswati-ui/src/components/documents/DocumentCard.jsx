import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Sparkles, FileStack, Check } from "lucide-react";
import FileTypeIcon from "./FileTypeIcon";
import DocumentActionsMenu from "./DocumentActionsMenu";
import { formatFileSize, formatRelativeTime } from "../../lib/formatters";
import { FILE_TYPE_LABELS } from "../../lib/utils";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useApp } from "../../context/AppContext";
import TagBadge from "../shared/TagBadge";
import { getTagsForItem } from "../../services/tagService";

const DocumentCard = memo(function DocumentCard({ document, subjectId }) {
  const { toggleFavorite, toggleSelection, selectedDocIds, hasSelection, removeDocument, openContextMenu } = useWorkspace();
  const { trashDocument, openDetailsDrawer, addToast, trackActivity } = useApp();
  const navigate = useNavigate();
  const typeConfig = FileTypeIcon.getConfig(document.type);
  const isSelected = selectedDocIds.includes(document.id);
  const tags = getTagsForItem("document", document.id);

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
      className={`card-hover group relative flex flex-col gap-3 rounded-xl border p-4 ${
        isSelected
          ? "border-gold/40 bg-gold/5 shadow-[0_0_0_1px_rgba(201,162,78,0.25)]"
          : "border-border-subtle bg-surface"
      }`}
    >
      {(hasSelection || isSelected) && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSelection(document.id);
          }}
          className={`absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded transition-all ${
            isSelected
              ? "bg-gold text-bg"
              : "border border-border-default bg-surface-soft text-transparent hover:border-gold/50"
          }`}
        >
          <Check size={12} strokeWidth={2.5} />
        </button>
      )}

      <div className="flex items-start justify-between">
        <FileTypeIcon type={document.type} size={20} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(document.id);
              trackActivity(document.favorite ? "unfavorited" : "favorited", document.title, { targetType: "document", subjectId, documentId: document.id });
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
          <DocumentActionsMenu documentId={document.id} onAction={handleAction} />
        </div>
      </div>

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

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] text-ink-faint">+{tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-border-subtle pt-3 text-[11px] text-ink-faint">
        <span className="flex items-center gap-1">
          <FileStack size={12} />
          {document.pages} {document.pages === 1 ? "page" : "pages"}
        </span>
        <span className="h-0.5 w-0.5 rounded-full bg-ink-faint" />
        <span>{formatRelativeTime(document.uploadedAt)}</span>
      </div>

    </Link>
  );
});

export default DocumentCard;
