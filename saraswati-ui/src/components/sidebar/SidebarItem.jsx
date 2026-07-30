import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

function getClassName(isActive, isCollapsed) {
  return cn(
    "group flex w-full items-center rounded-lg py-2.5 text-[13.5px] transition-colors",
    isCollapsed ? "justify-center px-0" : "justify-between px-3",
    isActive
      ? "bg-gold/10 text-gold border border-border-default"
      : "text-ink-soft border border-transparent hover:bg-surface-hover hover:text-ink"
  );
}

function ItemContent({ icon: Icon, label, badge, isActive, isCollapsed }) {
  return (
    <>
      <span className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "gap-3")}>
        <Icon
          size={17}
          strokeWidth={1.8}
          className={isActive ? "text-gold" : "text-ink-soft group-hover:text-ink"}
        />
        {!isCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
      </span>
      {!isCollapsed && typeof badge === "number" && (
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

function SidebarItem({ icon, label, badge, to, isCollapsed, onClick }) {
  if (!to) {
    return (
      <button type="button" className={getClassName(false, isCollapsed)} title={isCollapsed ? label : undefined} onClick={onClick}>
        <ItemContent icon={icon} label={label} badge={badge} isActive={false} isCollapsed={isCollapsed} />
      </button>
    );
  }

  return (
    <NavLink to={to} end={to === "/"} className={({ isActive }) => getClassName(isActive, isCollapsed)} title={isCollapsed ? label : undefined}>
      {({ isActive }) => (
        <ItemContent icon={icon} label={label} badge={badge} isActive={isActive} isCollapsed={isCollapsed} />
      )}
    </NavLink>
  );
}

export default SidebarItem;