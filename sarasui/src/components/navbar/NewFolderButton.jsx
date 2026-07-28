import { Plus } from "lucide-react";

function NewFolderButton({ label = "New Folder", icon: Icon = Plus, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-gold flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold active:scale-[0.98]"
    >
      <Icon size={16} strokeWidth={2.2} />
      {label}
    </button>
  );
}

export default NewFolderButton;