import KnowledgeIllustration from "../shared/KnowledgeIllustration";
import NewFolderButton from "../navbar/NewFolderButton";

function EmptyState({
  onNewFolder,
  title = "Your knowledge, beautifully organized",
  description = "Create a subject folder and upload your study materials. Let SARASWATI assist you with accurate answers from your own notes.",
  showAction = true,
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8">
      <img src="https://i.ibb.co/C5FMW0PV/saras-book-Photoroom.png" alt="saras-book-Photoroom" border="0" className="fade-image"></img>
      <h2 className="mt-6 text-center text-[22px] font-semibold text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-[380px] text-center text-[13.5px] leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      {showAction && (
        <div className="mt-6">
          <NewFolderButton onClick={onNewFolder} />
        </div>
      )}
    </div>
  );
}

export default EmptyState;
