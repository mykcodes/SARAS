import { UploadCloud } from "lucide-react";
import KnowledgeIllustration from "../shared/KnowledgeIllustration";
import NewFolderButton from "../navbar/NewFolderButton";
import { useWorkspace } from "../../context/WorkspaceContext";

function EmptyWorkspace({ subjectTitle }) {
  const { openUploadModal } = useWorkspace();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-10">
      <KnowledgeIllustration />
      <h3 className="mt-6 text-center text-[19px] font-semibold text-ink">
        No documents in {subjectTitle} yet
      </h3>
      <p className="mt-3 max-w-[380px] text-center text-[13.5px] leading-relaxed text-ink-soft">
        Upload notes and PDFs for this subject and SARASWATI will help you organize and answer
        questions using only your own material.
      </p>
      <div className="mt-6">
        <NewFolderButton
          label="Upload your first document"
          icon={UploadCloud}
          onClick={openUploadModal}
        />
      </div>
      <p className="mt-4 text-center text-[11.5px] text-ink-faint">
        Uploaded notes and PDFs will appear here.
      </p>
    </div>
  );
}

export default EmptyWorkspace;