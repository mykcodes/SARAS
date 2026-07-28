import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import DocumentPreviewShell from "../components/preview/DocumentPreviewShell";
import { getDocumentById, getSubjectById } from "../lib/data";

function DocumentPreviewPage() {
  const { subjectId, documentId } = useParams();
  const navigate = useNavigate();
  const document = getDocumentById(subjectId, documentId);
  const subject = getSubjectById(subjectId);

  if (!document || !subject) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-[15px] text-ink-soft">Document not found.</p>
        <button
          type="button"
          onClick={() => navigate(`/subjects/${subjectId}`)}
          className="mt-4 text-[13px] text-gold underline underline-offset-2"
        >
          Back to workspace
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Navbar title={document.title} />
      <Breadcrumb />
      <DocumentPreviewShell document={document} subjectId={subjectId} />
    </div>
  );
}

export default DocumentPreviewPage;
