import { Search } from "lucide-react";
import { useApp } from "../../context/AppContext";

function SearchBar() {
  const { openGlobalSearch } = useApp();

  return (
    <button
      type="button"
      onClick={openGlobalSearch}
      className="glass-surface flex w-full max-w-[420px] items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-ink-soft transition-colors"
    >
      <Search size={16} strokeWidth={1.8} />
      <span className="flex-1 text-left text-[13px] text-ink-soft">
        Search your workspace...
      </span>
      <kbd className="shrink-0 rounded border border-border-subtle px-1.5 py-0.5 text-[10.5px] text-ink-soft">
        ⌘K
      </kbd>
    </button>
  );
}

export default SearchBar;