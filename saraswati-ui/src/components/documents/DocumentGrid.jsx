import DocumentCard from "./DocumentCard";

function DocumentGrid({ documents, subjectId }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} subjectId={subjectId} />
      ))}
    </div>
  );
}

export default DocumentGrid;
