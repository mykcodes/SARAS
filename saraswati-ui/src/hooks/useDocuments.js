import { useMemo } from "react";
import { useWorkspace } from "../context/WorkspaceContext";

/**
 * Returns filtered + sorted documents for the current workspace.
 *
 * All filtering / sorting is derived from workspace context state so
 * components never need to do this logic themselves.
 */
function useDocuments() {
  const { documents, searchQuery, activeFilter, sortMode } = useWorkspace();

  const filtered = useMemo(() => {
    let result = documents;

    // --- Filter by type ---
    if (activeFilter !== "all") {
      result = result.filter((doc) => doc.type === activeFilter);
    }

    // --- Search by title (case-insensitive) ---
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((doc) => doc.title.toLowerCase().includes(q));
    }

    // --- Sort ---
    const sorted = [...result];
    switch (sortMode) {
      case "newest":
        sorted.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
        break;
      case "alpha":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
        sorted.sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened));
        break;
      default:
        break;
    }

    return sorted;
  }, [documents, searchQuery, activeFilter, sortMode]);

  return {
    documents: filtered,
    isEmpty: documents.length === 0,
    totalCount: documents.length,
    filteredCount: filtered.length,
  };
}

export default useDocuments;
