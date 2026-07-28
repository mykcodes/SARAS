/**
 * Reusable card shell for each insight widget.
 * Provides consistent styling so individual widgets focus on content.
 */
function InsightCard({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4">
      {title && (
        <div className="mb-3 flex items-center gap-2">
          {Icon && <Icon size={14} strokeWidth={1.8} className="text-gold" />}
          <h4 className="text-[12.5px] font-semibold text-ink">{title}</h4>
        </div>
      )}
      {children}
    </div>
  );
}

export default InsightCard;
