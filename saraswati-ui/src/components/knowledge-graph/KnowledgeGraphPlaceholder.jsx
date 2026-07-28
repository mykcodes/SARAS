import { Network } from "lucide-react";

/**
 * Placeholder for the future Knowledge Graph visualization.
 * Shows a professional empty state with animated CSS-only nodes
 * and explanatory text. Architecture is reserved for future integration
 * with a graph rendering library.
 */
function KnowledgeGraphPlaceholder() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex items-center gap-2">
        <Network size={14} strokeWidth={1.8} className="text-gold" />
        <h4 className="text-[12.5px] font-semibold text-ink">Knowledge Graph</h4>
        <span className="ml-auto rounded bg-gold/10 px-1.5 py-0.5 text-[9px] font-medium text-gold">
          COMING SOON
        </span>
      </div>

      {/* Animated placeholder visualization */}
      <div className="relative flex h-[120px] items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-bg">
        {/* CSS-only floating nodes */}
        <div className="absolute flex items-center justify-center gap-8">
          <div className="graph-node flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/8">
            <span className="text-[10px] font-medium text-gold">DB</span>
          </div>
          <div className="graph-node flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-surface-soft">
            <span className="text-[9px] text-ink-faint">SQL</span>
          </div>
          <div className="graph-node flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
            <span className="text-[10px] font-medium text-gold">NF</span>
          </div>
          <div className="graph-node flex h-7 w-7 items-center justify-center rounded-full border border-border-default bg-surface-soft">
            <span className="text-[8px] text-ink-faint">ER</span>
          </div>
          <div className="graph-node flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-surface-soft">
            <span className="text-[9px] text-ink-faint">TX</span>
          </div>
        </div>

        {/* Connector lines (decorative) */}
        <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.15 }}>
          <line x1="20%" y1="45%" x2="35%" y2="55%" stroke="var(--color-gold)" strokeWidth="1" />
          <line x1="35%" y1="50%" x2="50%" y2="42%" stroke="var(--color-gold)" strokeWidth="1" />
          <line x1="50%" y1="48%" x2="65%" y2="55%" stroke="var(--color-gold)" strokeWidth="1" />
          <line x1="65%" y1="50%" x2="80%" y2="45%" stroke="var(--color-gold)" strokeWidth="1" />
        </svg>
      </div>

      <p className="text-[11px] leading-relaxed text-ink-faint">
        Visualize how concepts connect across your documents. The knowledge graph
        will map topics, dependencies, and cross-references automatically.
      </p>
    </div>
  );
}

export default KnowledgeGraphPlaceholder;
