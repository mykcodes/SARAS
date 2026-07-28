import { useState, useCallback } from "react";
import { FileText, Sparkles, StickyNote, X } from "lucide-react";
import BookmarkItem from "./BookmarkItem";
import { getAllBookmarks, removeBookmark } from "../../services/bookmarkService";

const TYPE_TABS = [
  { id: "all", label: "All" },
  { id: "document", label: "Documents", icon: FileText },
  { id: "ai-response", label: "AI Responses", icon: Sparkles },
  { id: "note", label: "Notes", icon: StickyNote },
];

/**
 * Bookmarks panel showing bookmarked documents, AI responses, and notes.
 * Filterable by type with tab navigation.
 */
function BookmarksPanel() {
  const [activeType, setActiveType] = useState("all");
  const [, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const allBookmarks = getAllBookmarks();
  const filtered = activeType === "all"
    ? allBookmarks
    : allBookmarks.filter((b) => b.type === activeType);

  const handleRemove = (id) => {
    removeBookmark(id);
    refresh();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Type filter tabs */}
      <div className="flex border-b border-border-subtle">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveType(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1 px-2 py-2 text-[10.5px] transition-colors ${
              activeType === tab.id
                ? "tab-active font-medium text-gold"
                : "text-ink-faint hover:text-ink-soft"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookmark list */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
        {filtered.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onRemove={() => handleRemove(bookmark.id)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
            <span className="text-[11px] text-ink-faint">No bookmarks yet.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookmarksPanel;
