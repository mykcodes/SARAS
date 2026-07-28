import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderX } from "lucide-react";
import NewFolderButton from "../navbar/NewFolderButton";

function SubjectNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-10">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-border-default bg-surface">
        <FolderX size={32} strokeWidth={1.6} className="text-gold" />
      </span>
      <h3 className="mt-6 text-center text-[19px] font-semibold text-ink">Subject not found</h3>
      <p className="mt-3 max-w-[360px] text-center text-[13.5px] leading-relaxed text-ink-soft">
        The subject you're looking for doesn't exist or may have been removed.
      </p>
      <div className="mt-6">
        <NewFolderButton
          label="Back to Subjects"
          icon={ArrowLeft}
          onClick={() => navigate("/subjects")}
        />
      </div>
    </div>
  );
}

export default SubjectNotFound;