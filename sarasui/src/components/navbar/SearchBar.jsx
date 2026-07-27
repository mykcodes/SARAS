import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="glass-surface flex w-full max-w-[420px] items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-ink-soft transition-colors">
      <Search size={16} strokeWidth={1.8} />
      <input
        type="text"
        placeholder="Search your workspace..."
        className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-soft focus:outline-none"
      />
      <kbd className="shrink-0 rounded border border-border-subtle px-1.5 py-0.5 text-[10.5px] text-ink-soft">
        ⌘K
      </kbd>
    </div>
  );
}

export default SearchBar;