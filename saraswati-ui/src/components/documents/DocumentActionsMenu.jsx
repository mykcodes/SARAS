import { MoreHorizontal } from "lucide-react";
import { useWorkspace } from "../../../src/context/WorkspaceContext";

function DocumentActionsMenu({ documentId }) {
  const { openContextMenu } = useWorkspace();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        openContextMenu(documentId, rect.right - 160, rect.bottom + 8);
      }}
      className="relative rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink z-[5]"
      aria-label="Document actions"
    >
      <MoreHorizontal size={16} />
    </button>
  );
}

export default DocumentActionsMenu;
