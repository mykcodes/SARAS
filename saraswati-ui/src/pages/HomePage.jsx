import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import EmptyState from "../components/home/EmptyState";
import CreateSubjectDialog from "../components/folder/CreateSubjectDialog";

function HomePage() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Home" />
      <div className="flex flex-1 flex-col px-8 py-6">
        <EmptyState onNewFolder={() => setCreateModalOpen(true)} />
      </div>
      <CreateSubjectDialog isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
}

export default HomePage;