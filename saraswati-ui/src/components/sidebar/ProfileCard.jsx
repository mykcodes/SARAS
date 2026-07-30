import { ChevronDown } from "lucide-react";

function ProfileCard({ name, role, initial, isCollapsed }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center rounded-lg border border-border-subtle bg-surface py-2 text-left transition-colors hover:border-border-default ${isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'}`}
      title={isCollapsed ? name : undefined}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gold-gradient-bg text-[13px] font-semibold text-bg">
        {initial}
      </span>
      {!isCollapsed && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-ink">{name}</span>
            <span className="block truncate text-[11px] text-ink-soft">{role}</span>
          </span>
          <ChevronDown size={15} className="shrink-0 text-ink-soft" />
        </>
      )}
    </button>
  );
}

export default ProfileCard;
