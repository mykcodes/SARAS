import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import FolderListContainer from "../components/folder/FolderListContainer";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import CreateSubjectDialog from "../components/folder/CreateSubjectDialog";
import useSubjects from "../hooks/useSubjects";

function SubjectsPage() {
  const { subjects } = useSubjects();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Subjects" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        <FolderListContainer folders={subjects} onNewSubject={() => setCreateModalOpen(true)} />
      </div>
      <FloatingActionButton />
      <CreateSubjectDialog isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
}

export default SubjectsPage;