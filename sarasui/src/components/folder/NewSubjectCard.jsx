import { Plus } from "lucide-react";

function NewSubjectCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full min-h-[104px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-default text-[14px] font-medium text-ink-soft transition-colors hover:border-border-strong hover:text-gold"
    >
      <Plus size={17} strokeWidth={2} />
      New Subject
    </button>
  );
}

export default NewSubjectCard;