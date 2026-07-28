/**
 * Reusable placeholder panel for reserved areas in the document preview shell.
 * Shows an icon, label, and description indicating future functionality.
 */
function PreviewPlaceholder({ icon: Icon, label, description }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-surface p-6">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-surface-soft">
          <Icon size={22} strokeWidth={1.4} className="text-ink-faint" />
        </span>
      )}
      <p className="text-[13px] font-medium text-ink-soft">{label}</p>
      {description && (
        <p className="max-w-[240px] text-center text-[11.5px] leading-relaxed text-ink-faint">
          {description}
        </p>
      )}
    </div>
  );
}

export default PreviewPlaceholder;
