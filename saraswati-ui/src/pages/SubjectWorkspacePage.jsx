import { useParams } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import SubjectHeader from "../components/subject/SubjectHeader";
import SubjectWorkspaceLayout from "../components/subject/SubjectWorkspaceLayout";
import EmptyWorkspace from "../components/subject/EmptyWorkspace";
import SubjectNotFound from "../components/subject/SubjectNotFound";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import DocumentToolbar from "../components/documents/DocumentToolbar";
import SelectionToolbar from "../components/documents/SelectionToolbar";
import DocumentGrid from "../components/documents/DocumentGrid";
import DocumentList from "../components/documents/DocumentList";
import DocumentEmptyState from "../components/documents/DocumentEmptyState";
import UploadModal from "../components/upload/UploadModal";
import ContextMenu from "../components/shared/ContextMenu";
import useSubject from "../hooks/useSubject";
import useDocuments from "../hooks/useDocuments";
import useSelection from "../hooks/useSelection";
import { WorkspaceProvider, useWorkspace } from "../context/WorkspaceContext";
import { useApp } from "../context/AppContext";

function WorkspaceContent({ subject }) {
  const { viewMode, searchQuery, activeFilter, hasSelection, contextMenu, closeContextMenu, toggleFavorite, removeDocument, subjectId } = useWorkspace();
  const { trashDocument, openDetailsDrawer, addToast, trackActivity } = useApp();
  const { documents, isEmpty, totalCount, filteredCount } = useDocuments();
  const { clearSelection } = useWorkspace();

  useSelection(clearSelection);

  const handleContextAction = (actionId) => {
    if (!contextMenu) return;
    const doc = documents.find((d) => d.id === contextMenu.docId);
    if (!doc) return;

    switch (actionId) {
      case "open":
        trackActivity("opened", doc.title, { targetType: "document", subjectId, documentId: doc.id });
        window.location.href = `/subjects/${subjectId}/documents/${doc.id}`;
        break;
      case "favorite":
        toggleFavorite(doc.id);
        trackActivity(doc.favorite ? "unfavorited" : "favorited", doc.title, { targetType: "document", subjectId, documentId: doc.id });
        break;
      case "details":
        openDetailsDrawer({ ...doc, subjectId });
        break;
      case "delete":
        trashDocument({ ...doc, subjectId });
        removeDocument(doc.id);
        break;
      case "download":
        addToast(`Downloading "${doc.title}"…`, "info");
        break;
      case "move":
        addToast(`Move "${doc.title}" — coming soon`, "info");
        break;
      case "bookmark":
        {
          import("../services/bookmarkService").then(({ toggleBookmark }) => {
            const isNowBookmarked = toggleBookmark({ documentId: doc.id, subjectId, type: "document", title: doc.title });
            addToast(`"${doc.title}" ${isNowBookmarked ? "added to bookmarks" : "removed from bookmarks"}`, "success");
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <SubjectHeader subject={subject} />
      <SubjectWorkspaceLayout subjectId={subject.id}>
        {isEmpty ? (
          <EmptyWorkspace subjectTitle={subject.title} />
        ) : (
          <>
            {hasSelection && <SelectionToolbar />}
            <DocumentToolbar totalCount={totalCount} filteredCount={filteredCount} />
            {filteredCount === 0 ? (
              <DocumentEmptyState
                hasFilter={activeFilter !== "all"}
                searchQuery={searchQuery}
              />
            ) : viewMode === "grid" ? (
              <DocumentGrid documents={documents} subjectId={subject.id} />
            ) : (
              <DocumentList documents={documents} subjectId={subject.id} />
            )}
          </>
        )}
      </SubjectWorkspaceLayout>

      <UploadModal />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextAction}
          onClose={closeContextMenu}
        />
      )}
    </>
  );
}

function SubjectWorkspacePage() {
  const { subjectId } = useParams();
  const { subject, isLoading, notFound } = useSubject(subjectId);

  if (isLoading) {
    return (
      <div className="relative flex flex-1 flex-col">
        <Navbar title="Loading..." />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-ink-faint">Loading subject...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <Navbar title={notFound ? "Subject" : subject.title} />
      <Breadcrumb />

      {notFound ? (
        <SubjectNotFound />
      ) : (
        <WorkspaceProvider subjectId={subjectId}>
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-6">
            <WorkspaceContent subject={subject} />
          </div>
        </WorkspaceProvider>
      )}

      {!notFound && <FloatingActionButton />}
    </div>
  );
}

export default SubjectWorkspacePage;