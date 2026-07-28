import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-10">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-border-default bg-surface">
        <MapPin size={32} strokeWidth={1.6} className="text-gold" />
      </span>
      <h3 className="mt-6 text-center text-[19px] font-semibold text-ink">Page not found</h3>
      <p className="mt-3 max-w-[360px] text-center text-[13.5px] leading-relaxed text-ink-soft">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="glass-gold mt-6 flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold active:scale-[0.98]"
      >
        <ArrowLeft size={15} />
        Back to Home
      </button>
    </div>
  );
}

export default NotFoundPage;
