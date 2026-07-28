import { useParams } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import SubjectHeader from "../components/subject/SubjectHeader";
import SubjectWorkspaceLayout from "../components/subject/SubjectWorkspaceLayout";
import EmptyWorkspace from "../components/subject/EmptyWorkspace";
import SubjectNotFound from "../components/subject/SubjectNotFound";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import DocumentToolbar from "../components/documents/DocumentToolbar";
import DocumentGrid from "../components/documents/DocumentGrid";
import DocumentList from "../components/documents/DocumentList";
import DocumentEmptyState from "../components/documents/DocumentEmptyState";
import UploadModal from "../components/upload/UploadModal";
import useSubject from "../hooks/useSubject";
import useDocuments from "../hooks/useDocuments";
import { WorkspaceProvider, useWorkspace } from "../context/WorkspaceContext";

/**
 * Inner workspace content — must be rendered inside WorkspaceProvider
 * so it can access context.
 */
function WorkspaceContent({ subject }) {
  const { viewMode, searchQuery, activeFilter } = useWorkspace();
  const { documents, isEmpty, totalCount, filteredCount } = useDocuments();

  return (
    <>
      <SubjectHeader subject={subject} />
      <SubjectWorkspaceLayout subjectId={subject.id}>
        {isEmpty ? (
          <EmptyWorkspace subjectTitle={subject.title} />
        ) : (
          <>
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

      {/* Upload modal (rendered globally within workspace scope) */}
      <UploadModal />
    </>
  );
}

function SubjectWorkspacePage() {
  const { subjectId } = useParams();
  const { subject, notFound } = useSubject(subjectId);

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