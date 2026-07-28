import { FileText, Presentation, FileType, Image } from "lucide-react";

const TYPE_CONFIG = {
  pdf: {
    icon: FileText,
    color: "#E74C3C",
    bg: "rgba(231, 76, 60, 0.12)",
    border: "rgba(231, 76, 60, 0.3)",
    label: "PDF",
  },
  pptx: {
    icon: Presentation,
    color: "#E67E22",
    bg: "rgba(230, 126, 34, 0.12)",
    border: "rgba(230, 126, 34, 0.3)",
    label: "PPT",
  },
  docx: {
    icon: FileType,
    color: "#3498DB",
    bg: "rgba(52, 152, 219, 0.12)",
    border: "rgba(52, 152, 219, 0.3)",
    label: "Word",
  },
  image: {
    icon: Image,
    color: "#2ECC71",
    bg: "rgba(46, 204, 113, 0.12)",
    border: "rgba(46, 204, 113, 0.3)",
    label: "Image",
  },
};

const FALLBACK = {
  icon: FileText,
  color: "var(--color-ink-soft)",
  bg: "var(--color-surface-soft)",
  border: "var(--color-border-subtle)",
  label: "File",
};

function FileTypeIcon({ type, size = 20, className = "" }) {
  const config = TYPE_CONFIG[type] ?? FALLBACK;
  const Icon = config.icon;

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg ${className}`}
      style={{
        width: size + 16,
        height: size + 16,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon size={size} strokeWidth={1.8} style={{ color: config.color }} />
    </span>
  );
}

/** Export config so other components can use the color/label info */
FileTypeIcon.getConfig = (type) => TYPE_CONFIG[type] ?? FALLBACK;

export default FileTypeIcon;
