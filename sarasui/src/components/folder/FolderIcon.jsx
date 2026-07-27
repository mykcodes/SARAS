import { Folder } from "lucide-react";

function FolderIcon({ color }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: `${color}26`, border: `1px solid ${color}55` }}
    >
      <Folder size={20} strokeWidth={1.8} style={{ color }} fill={`${color}33`} />
    </span>
  );
}

export default FolderIcon;
