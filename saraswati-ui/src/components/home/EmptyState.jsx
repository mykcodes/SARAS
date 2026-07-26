import KnowledgeIllustration from "../shared/KnowledgeIllustration";
import NewFolderButton from "../navbar/NewFolderButton";

function EmptyState({ onNewFolder }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8">
      <KnowledgeIllustration />
      <h2 className="mt-6 text-center text-[22px] font-semibold text-ink">
        Your knowledge, beautifully organized
      </h2>
      <p className="mt-3 max-w-[380px] text-center text-[13.5px] leading-relaxed text-ink-soft">
        Create a subject folder and upload your study materials. Let SARASWATI assist you with
        accurate answers from your own notes.
      </p>
      <div className="mt-6">
        <NewFolderButton onClick={onNewFolder} />
      </div>
    </div>
  );
}

export default EmptyState;
