import { Home, FolderOpen, Clock, Star, Trash2, Settings } from "lucide-react";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import StorageCard from "./StorageCard";
import ProfileCard from "./ProfileCard";
import { NAV_ITEMS, USER, STORAGE } from "../../lib/data";

const ICONS = {
  home: Home,
  subjects: FolderOpen,
  recent: Clock,
  favorites: Star,
  trash: Trash2,
};

function Sidebar() {
  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-border-subtle bg-bg-elevated px-4 py-5">
      <Logo />

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            icon={ICONS[item.id]}
            label={item.label}
            badge={item.badge}
            to={item.to}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-4">
        <SidebarItem icon={Settings} label="Settings" />
        <div className="border-t border-border-subtle pt-4">
          <StorageCard used={STORAGE.used} total={STORAGE.total} unit={STORAGE.unit} />
        </div>
        <ProfileCard name={USER.name} role={USER.role} initial={USER.initial} />
      </div>
    </aside>
  );
}

export default Sidebar;