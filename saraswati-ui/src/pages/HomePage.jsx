import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import HomeContent from "../components/home/HomeContent";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import { FOLDERS } from "../lib/data";

function HomePage() {
  const [showEmptyState, setShowEmptyState] = useState(false);
  const folders = showEmptyState ? [] : FOLDERS;

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Home" />
      <HomeContent folders={folders} onNewSubject={() => {}} />
      <FloatingActionButton />

      <button
        type="button"
        onClick={() => setShowEmptyState((prev) => !prev)}
        className="absolute bottom-6 left-8 rounded-md border border-border-subtle bg-surface px-2.5 py-1 text-[11px] text-ink-soft hover:text-ink"
      >
        Toggle {showEmptyState ? "folder list" : "empty state"}
      </button>
    </div>
  );
}

export default HomePage;
