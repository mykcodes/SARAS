import Navbar from "../components/navbar/Navbar";
import EmptyState from "../components/home/EmptyState";
import FolderListContainer from "../components/folder/FolderListContainer";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import useSubjects from "../hooks/useSubjects";
import { useFavorites } from "../lib/FavoritesContext";

function FavoritesPage() {
  const { subjects } = useSubjects();
  const { isFavorite } = useFavorites();
  const favorites = subjects.filter((subject) => isFavorite(subject.id));

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Favorites" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        {favorites.length > 0 ? (
          <FolderListContainer folders={favorites} onNewSubject={() => {}} />
        ) : (
          <EmptyState title="Nothing in favorites !!" description="" showAction={false} />
        )}
      </div>
      <FloatingActionButton />
    </div>
  );
}

export default FavoritesPage;