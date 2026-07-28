import DocumentRow from "./DocumentRow";

function DocumentList({ documents, subjectId }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Column headers */}
      <div className="flex items-center gap-4 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
        <span className="w-[36px] shrink-0" /> {/* icon */}
        <span className="flex-1">Name</span>
        <span className="w-[72px] shrink-0 text-right">Size</span>
        <span className="w-[52px] shrink-0 text-right">Pages</span>
        <span className="w-[90px] shrink-0 text-right">Uploaded</span>
        <span className="w-[80px] shrink-0 text-right">Opened</span>
        <span className="w-[24px] shrink-0 text-center">AI</span>
        <span className="w-[28px] shrink-0" /> {/* fav */}
        <span className="w-[28px] shrink-0" /> {/* actions */}
      </div>

      {/* Rows */}
      {documents.map((doc) => (
        <DocumentRow key={doc.id} document={doc} subjectId={subjectId} />
      ))}
    </div>
  );
}

export default DocumentList;
