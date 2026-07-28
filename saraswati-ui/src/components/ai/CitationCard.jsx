import { FileText, ExternalLink } from "lucide-react";

/**
 * Reusable citation card displayed within AI responses.
 * Shows document name, page number, section title, and an open action.
 */
function CitationCard({ documentName, pageNumber, sectionTitle, onOpen }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2.5 transition-colors hover:border-border-default hover:bg-surface-hover">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-surface">
        <FileText size={14} className="text-gold" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-ink">{documentName}</p>
        <p className="truncate text-[11px] text-ink-faint">
          Page {pageNumber} • {sectionTitle}
        </p>
      </div>
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="rounded-md p-1.5 text-ink-faint opacity-0 transition-all hover:text-gold group-hover:opacity-100"
          aria-label={`Open ${documentName}`}
        >
          <ExternalLink size={13} />
        </button>
      )}
    </div>
  );
}

export default CitationCard;
