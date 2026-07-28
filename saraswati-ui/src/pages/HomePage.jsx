import Navbar from "../components/navbar/Navbar";
import EmptyState from "../components/home/EmptyState";
import FloatingActionButton from "../components/shared/FloatingActionButton";

function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Home" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        <EmptyState onNewFolder={() => {}} />
      </div>
      <FloatingActionButton />
    </div>
  );
}

export default HomePage;