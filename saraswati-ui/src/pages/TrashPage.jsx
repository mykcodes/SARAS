import { useState } from "react";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import { useApp } from "../context/AppContext";
import { formatRelativeTime } from "../lib/formatters";
import FileTypeIcon from "../components/documents/FileTypeIcon";

function TrashPage() {
  const { getTrashItems, restoreFromTrash, permanentDeleteFromTrash, emptyAllTrash, addToast } = useApp();
  const [, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  const trashItems = getTrashItems();

  const handleRestore = (trashId) => {
    restoreFromTrash(trashId);
    refresh();
  };

  const handlePermanentDelete = (trashId) => {
    permanentDeleteFromTrash(trashId);
    addToast("Item permanently deleted", "info");
    refresh();
  };

  const handleEmptyTrash = () => {
    emptyAllTrash();
    refresh();
  };

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Trash" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        {trashItems.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[13px] text-ink-soft">
              {trashItems.length} item{trashItems.length !== 1 ? "s" : ""} in trash
            </span>
            <button
              type="button"
              onClick={handleEmptyTrash}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/8 px-3 py-1.5 text-[12px] font-medium text-red-400 transition-colors hover:bg-red-500/15"
            >
              <Trash2 size={13} />
              Empty Trash
            </button>
          </div>
        )}

        {trashItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-surface-soft">
              <Trash2 size={28} strokeWidth={1.4} className="text-ink-faint" />
            </span>
            <h3 className="text-[16px] font-semibold text-ink">Trash is empty</h3>
            <p className="max-w-[320px] text-center text-[13px] text-ink-soft">
              Deleted items will appear here. You can restore or permanently delete them.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {trashItems.map((item) => (
              <div
                key={item.trashId}
                className="flex items-center gap-4 rounded-lg border border-border-subtle bg-surface px-4 py-3"
              >
                {item.type && <FileTypeIcon type={item.type} size={16} />}
                {!item.type && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-soft">
                    <Trash2 size={14} className="text-ink-faint" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-ink">{item.title}</p>
                  <p className="text-[11px] text-ink-faint">
                    Deleted {formatRelativeTime(item.deletedAt)}
                    {item.originalLocation?.subjectId && ` • from ${item.originalLocation.subjectId}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePermanentDelete(item.trashId)}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  title="Permanently delete"
                >
                  <AlertTriangle size={13} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrashPage;
