import { ChevronDown } from "lucide-react";

function ProfileCard({ name, role, initial }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-lg border border-border-subtle bg-surface px-2.5 py-2 text-left transition-colors hover:border-border-default"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gold-gradient-bg text-[13px] font-semibold text-bg">
        {initial}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink">{name}</span>
        <span className="block truncate text-[11px] text-ink-soft">{role}</span>
      </span>
      <ChevronDown size={15} className="shrink-0 text-ink-soft" />
    </button>
  );
}

export default ProfileCard;
