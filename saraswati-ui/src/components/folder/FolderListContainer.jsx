import FolderCard from "./FolderCard";
import NewSubjectCard from "./NewSubjectCard";

function FolderListContainer({ folders, onNewSubject, onContextMenu }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} onContextMenu={onContextMenu} />
      ))}
      <NewSubjectCard onClick={onNewSubject} />
    </div>
  );
}

export default FolderListContainer;