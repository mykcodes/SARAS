import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import FolderCard from "../components/folder/FolderCard";
import FileTypeIcon from "../components/documents/FileTypeIcon";
import { formatFileSize, formatRelativeTime } from "../lib/formatters";
import { FILE_TYPE_LABELS } from "../lib/utils";
import { getFavorites } from "../api/favoritesApi";

const TABS = [
  { key: "all", label: "All" },
  { key: "documents", label: "Documents" },
  { key: "subjects", label: "Subjects" },
];

function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [favoriteDocuments, setFavoriteDocuments] = useState([]);
  const [favoriteSubjects, setFavoriteSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then((data) => {
        // Normalize documents
        const docs = (data.documents || []).map((d) => ({
          id: d.id,
          subjectId: d.subject_id,
          title: d.title,
          original_filename: d.original_filename,
          type: "pdf",
          size: d.file_size,
          pages: d.page_count ?? null,
          uploadedAt: d.upload_date,
          processingStatus: d.processing_status,
          favorite: d.is_favorite,
        }));
        setFavoriteDocuments(docs);
        setFavoriteSubjects(data.subjects || []);
      })
      .catch((err) => console.error("Failed to fetch favorites", err))
      .finally(() => setIsLoading(false));
  }, []);

  const showDocs = activeTab === "all" || activeTab === "documents";
  const showSubjects = activeTab === "all" || activeTab === "subjects";

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title="Favorites" />
      <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        <div className="mb-5 flex items-center gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-gold/12 text-gold border border-gold/25"
                  : "text-ink-faint border border-transparent hover:text-ink-soft hover:bg-surface-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-sm text-ink-faint">Loading favorites...</div>
          </div>
        ) : favoriteDocuments.length === 0 && favoriteSubjects.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-surface-soft">
              <Star size={28} strokeWidth={1.4} className="text-ink-faint" />
            </span>
            <h3 className="text-[16px] font-semibold text-ink">No favorites yet</h3>
            <p className="max-w-[320px] text-center text-[13px] text-ink-soft">
              Star documents and subjects to see them here for quick access.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {showSubjects && favoriteSubjects.length > 0 && (
              <div>
                <h3 className="mb-3 text-[13px] font-medium uppercase tracking-wider text-ink-faint">
                  Subjects
                </h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                  {favoriteSubjects.map((s) => (
                    <FolderCard key={s.id} folder={s} />
                  ))}
                </div>
              </div>
            )}

            {showDocs && favoriteDocuments.length > 0 && (
              <div>
                <h3 className="mb-3 text-[13px] font-medium uppercase tracking-wider text-ink-faint">
                  Documents ({favoriteDocuments.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {favoriteDocuments.map((doc) => {
                    const typeConfig = FileTypeIcon.getConfig(doc.type);
                    return (
                      <Link
                        key={doc.id}
                        to={`/subjects/${doc.subjectId}/documents/${doc.id}`}
                        className="card-hover group flex items-center gap-4 rounded-lg border border-border-subtle bg-surface px-4 py-3 transition-colors hover:bg-surface-soft"
                      >
                        <FileTypeIcon type={doc.type} size={16} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-medium text-ink">{doc.title}</p>
                          <p className="text-[11px] text-ink-faint">{doc.subjectId}</p>
                        </div>
                        <span
                          className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: typeConfig.bg, color: typeConfig.color, border: `1px solid ${typeConfig.border}` }}
                        >
                          {FILE_TYPE_LABELS[doc.type] ?? doc.type}
                        </span>
                        <span className="w-[72px] shrink-0 text-right text-[12px] text-ink-faint">
                          {formatFileSize(doc.size)}
                        </span>
                        <span className="shrink-0 text-[12px] text-ink-faint">
                          {formatRelativeTime(doc.uploadedAt)}
                        </span>
                        <Star size={13} className="shrink-0 text-gold" fill="currentColor" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
