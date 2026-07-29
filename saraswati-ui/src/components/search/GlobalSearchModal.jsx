import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, FileText, FolderOpen, StickyNote, MessageSquare, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { globalSearch, getSearchResultCount } from "../../services/searchService";

const CATEGORY_ICONS = {
  subjects: FolderOpen,
  documents: FileText,
  notes: StickyNote,
  conversations: MessageSquare,
  bookmarks: Bookmark,
};

const CATEGORY_LABELS = {
  subjects: "Subjects",
  documents: "Documents",
  notes: "Notes",
  conversations: "Conversations",
  bookmarks: "Bookmarks",
};

function GlobalSearchModal() {
  const { globalSearchOpen, closeGlobalSearch } = useApp();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => globalSearch(query), [query]);
  const totalCount = useMemo(() => getSearchResultCount(results), [results]);

  useEffect(() => {
    if (globalSearchOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
    }
  }, [globalSearchOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (globalSearchOpen) {
          closeGlobalSearch();
        } else {
          const { openGlobalSearch } = useApp;
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [globalSearchOpen, closeGlobalSearch]);

  if (!globalSearchOpen) return null;

  const handleResultClick = (result) => {
    closeGlobalSearch();
    if (result.resultType === "subject") {
      navigate(`/subjects/${result.id}`);
    } else if (result.resultType === "document") {
      navigate(`/subjects/${result.subjectId}/documents/${result.id}`);
    } else if (result.resultType === "conversation") {
      navigate(`/subjects/${result.subjectId}`);
    }
  };

  const categories = Object.keys(CATEGORY_ICONS).filter(
    (cat) => results[cat] && results[cat].length > 0
  );

  return (
    <div className="modal-overlay fixed inset-0 z-[80] flex items-start justify-center bg-black/50 pt-[12vh]" onClick={closeGlobalSearch}>
      <div
        className="modal-content flex w-full max-w-[560px] flex-col rounded-xl border border-border-default bg-surface-soft shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3.5">
          <Search size={18} className="shrink-0 text-ink-soft" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, documents, notes, conversations…"
            className="w-full bg-transparent text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 text-ink-faint transition-colors hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="shrink-0 rounded border border-border-subtle px-1.5 py-0.5 text-[10.5px] text-ink-faint">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {!query.trim() && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-[13px] text-ink-faint">Start typing to search across everything…</p>
            </div>
          )}

          {query.trim() && totalCount === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-[13px] text-ink-soft">No results for "{query}"</p>
              <p className="mt-1 text-[11.5px] text-ink-faint">Try a different search term</p>
            </div>
          )}

          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const items = results[cat];
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 px-4 py-2">
                  <Icon size={13} className="text-ink-faint" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <span className="text-[10px] text-ink-faint">({items.length})</span>
                </div>
                {items.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleResultClick(item)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] text-ink">
                        {item.title || item.content?.slice(0, 60)}
                      </p>
                      {item.subtitle && (
                        <p className="truncate text-[11px] text-ink-faint">{item.subtitle}</p>
                      )}
                      {item.description && (
                        <p className="truncate text-[11px] text-ink-faint">{item.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearchModal;
