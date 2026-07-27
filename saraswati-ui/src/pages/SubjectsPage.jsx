import Navbar from "../components/navbar/Navbar";
import FolderListContainer from "../components/folder/FolderListContainer";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import useSubjects from "../hooks/useSubjects";

function SubjectsPage() {
  const { subjects } = useSubjects();

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Subjects" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        <FolderListContainer folders={subjects} onNewSubject={() => {}} />
      </div>
      <FloatingActionButton />
    </div>
  );
}

export default SubjectsPage;