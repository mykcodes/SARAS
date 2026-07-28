import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import FileTypeIcon from "../documents/FileTypeIcon";

const STATUS_CONFIG = {
  queued: { icon: Loader2, color: "text-ink-faint", label: "Queued" },
  uploading: { icon: Loader2, color: "text-gold", label: "Uploading" },
  success: { icon: CheckCircle2, color: "text-emerald-400", label: "Complete" },
  error: { icon: AlertCircle, color: "text-red-400", label: "Failed" },
};

function UploadProgressItem({ item, onCancel }) {
  const config = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.queued;


  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface px-3 py-2.5">
      {/* File type icon */}
      {item.fileType ? (
        <FileTypeIcon type={item.fileType} size={14} />
      ) : (
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle size={14} className="text-red-400" />
        </span>
      )}

      {/* Name + progress */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="truncate text-[12.5px] font-medium text-ink">
            {item.fileName}
          </span>
          <span className={`shrink-0 text-[10.5px] ${config.color}`}>
            {item.status === "uploading"
              ? `${Math.round(item.progress)}%`
              : config.label}
          </span>
        </div>

        {/* Progress bar (only for uploading) */}
        {item.status === "uploading" && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
            <div
              className="progress-bar-animated h-full rounded-full bg-gold transition-all duration-100"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}

        {/* Error message */}
        {item.status === "error" && item.error && (
          <p className="text-[11px] text-red-400">{item.error}</p>
        )}
      </div>

      {/* Cancel / dismiss */}
      {(item.status === "uploading" || item.status === "queued") && (
        <button
          type="button"
          onClick={() => onCancel(item.id)}
          className="shrink-0 rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
          aria-label="Cancel upload"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default UploadProgressItem;
