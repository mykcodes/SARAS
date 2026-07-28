import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

function getClassName(isActive) {
  return cn(
    "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] transition-colors",
    isActive
      ? "bg-gold/10 text-gold border border-border-default"
      : "text-ink-soft border border-transparent hover:bg-surface-hover hover:text-ink"
  );
}

function ItemContent({ icon: Icon, label, badge, isActive }) {
  return (
    <>
      <span className="flex items-center gap-3">
        <Icon
          size={17}
          strokeWidth={1.8}
          className={isActive ? "text-gold" : "text-ink-soft group-hover:text-ink"}
        />
        <span className="font-medium">{label}</span>
      </span>
      {typeof badge === "number" && (
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[11px] font-medium",
            isActive ? "bg-gold/15 text-gold" : "bg-surface-soft text-ink-soft"
          )}
        >
          {badge}
        </span>
      )}
    </>
  );
}

function SidebarItem({ icon, label, badge, to }) {
  if (!to) {
    return (
      <button type="button" className={getClassName(false)}>
        <ItemContent icon={icon} label={label} badge={badge} isActive={false} />
      </button>
    );
  }

  return (
    <NavLink to={to} end={to === "/"} className={({ isActive }) => getClassName(isActive)}>
      {({ isActive }) => (
        <ItemContent icon={icon} label={label} badge={badge} isActive={isActive} />
      )}
    </NavLink>
  );
}

export default SidebarItem;