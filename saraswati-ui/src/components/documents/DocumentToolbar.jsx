import { Search, LayoutGrid, List, ArrowUpDown, UploadCloud } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";

const FILTERS = [
  { key: "all", label: "All Files" },
  { key: "pdf", label: "PDF" },
  { key: "pptx", label: "PPT" },
  { key: "docx", label: "Word" },
  { key: "image", label: "Images" },
];

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "alpha", label: "A – Z" },
  { key: "recent", label: "Recently Opened" },
];

function DocumentToolbar({ totalCount, filteredCount }) {
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setFilter,
    sortMode,
    setSort,
    viewMode,
    setViewMode,
    openUploadModal,
  } = useWorkspace();

  return (
    <div className="flex flex-col gap-3">
      {/* Top row: search + view toggle + upload */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="glass-surface flex flex-1 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-ink-soft">
          <Search size={15} strokeWidth={1.8} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-soft focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="shrink-0 text-[11px] text-ink-faint transition-colors hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortMode}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-lg border border-border-subtle bg-surface-soft py-2.5 pl-8 pr-6 text-[12.5px] text-ink-soft transition-colors hover:border-border-default hover:text-ink focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <ArrowUpDown
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-border-subtle bg-surface-soft">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-l-lg p-2.5 transition-colors ${
              viewMode === "grid"
                ? "bg-gold/10 text-gold"
                : "text-ink-faint hover:text-ink"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-r-lg p-2.5 transition-colors ${
              viewMode === "list"
                ? "bg-gold/10 text-gold"
                : "text-ink-faint hover:text-ink"
            }`}
            aria-label="List view"
          >
            <List size={15} />
          </button>
        </div>

        {/* Upload button */}
        <button
          type="button"
          onClick={openUploadModal}
          className="glass-gold flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold active:scale-[0.98]"
        >
          <UploadCloud size={15} strokeWidth={2.2} />
          Upload
        </button>
      </div>

      {/* Bottom row: count */}
      <div className="flex items-center justify-end">
        <span className="text-[12px] text-ink-faint">
          {filteredCount === totalCount
            ? `${totalCount} ${totalCount === 1 ? "document" : "documents"}`
            : `${filteredCount} of ${totalCount} documents`}
        </span>
      </div>
    </div>
  );
}

export default DocumentToolbar;
