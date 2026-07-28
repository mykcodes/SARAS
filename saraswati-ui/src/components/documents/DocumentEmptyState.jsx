import { SearchX } from "lucide-react";

function DocumentEmptyState({ hasFilter, searchQuery }) {
  if (hasFilter || searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-surface-soft">
          <SearchX size={28} strokeWidth={1.4} className="text-ink-faint" />
        </span>
        <h3 className="mt-5 text-[16px] font-semibold text-ink">No documents found</h3>
        <p className="mt-2 max-w-[320px] text-center text-[13px] leading-relaxed text-ink-soft">
          {searchQuery
            ? `No documents matching "${searchQuery}". Try a different search term.`
            : "No documents match the current filter. Try selecting a different file type."}
        </p>
      </div>
    );
  }

  return null;
}

export default DocumentEmptyState;
