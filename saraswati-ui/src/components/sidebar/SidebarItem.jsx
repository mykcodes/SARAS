import { cn } from "../../lib/utils";

function SidebarItem({ icon: Icon, label, badge, active = false }) {
  return (
    <button
      type="button"
      className={cn(
        "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] transition-colors",
        active
          ? "bg-gold/10 text-gold border border-border-default"
          : "text-ink-soft border border-transparent hover:bg-surface-hover hover:text-ink"
      )}
    >
      <span className="flex items-center gap-3">
        <Icon
          size={17}
          strokeWidth={1.8}
          className={active ? "text-gold" : "text-ink-soft group-hover:text-ink"}
        />
        <span className="font-medium">{label}</span>
      </span>
      {typeof badge === "number" && (
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[11px] font-medium",
            active ? "bg-gold/15 text-gold" : "bg-surface-soft text-ink-soft"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default SidebarItem;
