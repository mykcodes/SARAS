import FolderListContainer from "../folder/FolderListContainer";
import EmptyState from "./EmptyState";

function HomeContent({ folders, onNewSubject }) {
  const hasFolders = folders.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
      {hasFolders ? (
        <FolderListContainer folders={folders} onNewSubject={onNewSubject} />
      ) : (
        <EmptyState onNewFolder={onNewSubject} />
      )}
    </div>
  );
}

export default HomeContent;
