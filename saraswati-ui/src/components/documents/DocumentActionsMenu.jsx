import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, ExternalLink, Pencil, Download, FolderInput, Trash2, Info } from "lucide-react";

const ACTIONS = [
  { id: "open", label: "Open", icon: ExternalLink },
  { id: "rename", label: "Rename", icon: Pencil },
  { id: "details", label: "Details", icon: Info },
  { id: "download", label: "Download", icon: Download },
  { id: "move", label: "Move to…", icon: FolderInput },
  { id: "delete", label: "Delete", icon: Trash2, danger: true },
];

function DocumentActionsMenu({ documentId, onAction }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
        aria-label="Document actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-border-subtle bg-surface-soft py-1 shadow-xl modal-content">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAction?.(action.id, documentId);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-[12.5px] transition-colors hover:bg-surface-hover ${
                  action.danger ? "text-red-400 hover:text-red-300" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon size={14} strokeWidth={1.8} />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DocumentActionsMenu;
