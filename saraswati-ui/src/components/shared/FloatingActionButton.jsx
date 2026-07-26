import { Sparkles } from "lucide-react";

function FloatingActionButton({ label = "Ask SARASWATI" }) {
  return (
    <div className="pointer-events-none absolute bottom-6 right-8">
      <button
        type="button"
        className="glass-gold pointer-events-auto flex items-center gap-2.5 rounded-full px-5 py-3 text-[13.5px] font-semibold active:scale-[0.98]"
      >
        <Sparkles size={16} strokeWidth={2.2} />
        {label}
      </button>
    </div>
  );
}

export default FloatingActionButton;