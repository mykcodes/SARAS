import { CheckSquare, XSquare, Star, Trash2, FolderInput, Download } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useApp } from "../../context/AppContext";

function SelectionToolbar() {
  const { selectedDocIds, selectionCount, documents, selectAll, clearSelection, bulkFavorite, removeDocuments, subjectId } = useWorkspace();
  const { trashDocument, addToast } = useApp();

  const handleBulkDelete = () => {
    const selectedDocs = documents.filter((d) => selectedDocIds.includes(d.id));
    selectedDocs.forEach((doc) => trashDocument({ ...doc, subjectId }));
    removeDocuments(selectedDocIds);
  };

  const handleBulkFavorite = () => {
    bulkFavorite(selectedDocIds);
    addToast(`${selectionCount} document${selectionCount !== 1 ? "s" : ""} favorited`, "success");
  };

  const handleBulkDownload = () => {
    addToast(`Downloading ${selectionCount} document${selectionCount !== 1 ? "s" : ""}…`, "info");
    clearSelection();
  };

  const handleBulkMove = () => {
    addToast(`Move ${selectionCount} document${selectionCount !== 1 ? "s" : ""} — coming soon`, "info");
    clearSelection();
  };

  return (
    <div className="selection-toolbar-enter flex items-center justify-between rounded-lg border border-gold/25 bg-gold/8 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-gold">
          {selectionCount} selected
        </span>
        <button
          type="button"
          onClick={selectAll}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] text-ink-soft transition-colors hover:text-ink"
        >
          <CheckSquare size={13} />
          Select All
        </button>
        <button
          type="button"
          onClick={clearSelection}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] text-ink-soft transition-colors hover:text-ink"
        >
          <XSquare size={13} />
          Clear
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleBulkFavorite}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] text-ink-soft transition-colors hover:bg-surface-hover hover:text-gold"
          title="Favorite selected"
        >
          <Star size={13} />
          Favorite
        </button>
        <button
          type="button"
          onClick={handleBulkDownload}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
          title="Download selected"
        >
          <Download size={13} />
          Download
        </button>
        <button
          type="button"
          onClick={handleBulkMove}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
          title="Move selected"
        >
          <FolderInput size={13} />
          Move
        </button>
        <button
          type="button"
          onClick={handleBulkDelete}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          title="Delete selected"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default SelectionToolbar;
