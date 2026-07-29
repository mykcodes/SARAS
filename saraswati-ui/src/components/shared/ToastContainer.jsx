import { useApp } from "../../context/AppContext";

function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter flex items-center gap-3 rounded-lg border border-border-default bg-surface-soft px-4 py-3 shadow-xl"
        >
          <span className="text-[13px] text-ink">{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-[11px] text-ink-faint transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
