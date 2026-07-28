import { useEffect, useRef } from "react";
import { ExternalLink, Star, Bookmark, FolderInput, Download, Trash2, Info } from "lucide-react";

const MENU_ITEMS = [
  { id: "open", label: "Open", icon: ExternalLink },
  { id: "favorite", label: "Toggle Favorite", icon: Star },
  { id: "bookmark", label: "Bookmark", icon: Bookmark },
  { id: "details", label: "Details", icon: Info },
  { id: "download", label: "Download", icon: Download },
  { id: "move", label: "Move to…", icon: FolderInput },
  { id: "delete", label: "Delete", icon: Trash2, danger: true },
];

function ContextMenu({ x, y, onAction, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 180);
  const adjustedY = Math.min(y, window.innerHeight - MENU_ITEMS.length * 36 - 20);

  return (
    <div
      ref={menuRef}
      className="fixed z-[60] min-w-[170px] rounded-lg border border-border-subtle bg-surface-soft py-1 shadow-xl modal-content"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onAction(item.id);
              onClose();
            }}
            className={`flex w-full items-center gap-2.5 px-3 py-2 text-[12.5px] transition-colors hover:bg-surface-hover ${
              item.danger ? "text-red-400 hover:text-red-300" : "text-ink-soft hover:text-ink"
            }`}
          >
            <Icon size={14} strokeWidth={1.8} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default ContextMenu;
