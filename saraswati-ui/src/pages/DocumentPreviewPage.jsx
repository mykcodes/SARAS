import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import DocumentPreviewShell from "../components/preview/DocumentPreviewShell";
import { getDocument } from "../api/documentApi";
import { getSubject } from "../api/subjectApi";

function DocumentPreviewPage() {
  const { subjectId, documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [subject, setSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getDocument(subjectId, documentId).catch(() => null),
      getSubject(subjectId).catch(() => null)
    ]).then(([docData, subjData]) => {
      if (docData) {
        setDocument({
          ...docData,
          pages: docData.page_count ?? 1,
          type: "pdf"
        });
      } else {
        setDocument(null);
      }
      setSubject(subjData);
      setIsLoading(false);
    });
  }, [subjectId, documentId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title="Loading..." />
        <Breadcrumb />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[15px] text-ink-soft">Loading document...</p>
        </div>
      </div>
    );
  }

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
