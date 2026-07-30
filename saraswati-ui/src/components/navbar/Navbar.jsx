import { useState } from "react";
import SearchBar from "./SearchBar";
import NewFolderButton from "./NewFolderButton";
import CreateSubjectDialog from "../folder/CreateSubjectDialog";

function Navbar({ title = "Home", onNewFolder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewFolder = () => {
    if (onNewFolder) {
      onNewFolder();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <header className="flex items-center justify-between gap-6 border-b border-border-subtle px-8 py-5">
      <h1 className="shrink-0 text-[22px] font-semibold text-ink">{title}</h1>
      <div className="flex flex-1 justify-center">
        <SearchBar />
      </div>
      <NewFolderButton onClick={handleNewFolder} />
      <CreateSubjectDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}

export default Navbar;
