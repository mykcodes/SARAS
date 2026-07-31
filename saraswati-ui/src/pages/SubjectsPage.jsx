import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import FolderListContainer from "../components/folder/FolderListContainer";
import CreateSubjectDialog from "../components/folder/CreateSubjectDialog";
import useSubjects from "../hooks/useSubjects";
import ContextMenu from "../components/shared/ContextMenu";
import { FolderInput, Trash2, Edit2, Star } from "lucide-react";

const SUBJECT_MENU_ITEMS = [
  { id: "rename", label: "Rename Subject", icon: Edit2 },
  { id: "favorite", label: "Toggle Favorite", icon: Star },
  { id: "delete", label: "Delete Subject", icon: Trash2, danger: true },
];

function SubjectsPage() {
  const { subjects, deleteSubject, updateSubject, favoriteSubject } = useSubjects();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextAction = async (actionId) => {
    if (!contextMenu) return;
    const { subjectId } = contextMenu;

    switch (actionId) {
      case "favorite":
        favoriteSubject(subjectId);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this subject?")) {
          await deleteSubject(subjectId);
        }
        break;
      case "rename": {
        const newName = window.prompt("New subject name:");
        if (newName && newName.trim()) {
          await updateSubject(subjectId, { title: newName.trim() });
        }
        break;
      }

      default:
        break;
    }
  };

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Subjects" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        <FolderListContainer 
          folders={subjects} 
          onNewSubject={() => setCreateModalOpen(true)} 
          onContextMenu={(subjectId, x, y) => setContextMenu({ subjectId, x, y })}
        />
      </div>
      <CreateSubjectDialog isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={SUBJECT_MENU_ITEMS}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default SubjectsPage;