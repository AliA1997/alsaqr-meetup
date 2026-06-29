import { useState } from "react";

type DangerAlertProps = {
  title?: string;
  message: string;
  onClose?: () => void;
  actions?: React.ReactNode;
  className?: string;
};

export function DangerAlert({
  title = "Error",
  message,
  onClose,
  actions,
  className = ""
}: DangerAlertProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`relative w-full rounded-lg border border-red-200 bg-red-50 text-red-900 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="mt-0.5">
          <svg
            className="h-5 w-5 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 0 1 .894.553l7 14A1 1 0 0 1 17 18H3a1 1 0 0 1-.894-1.447l7-14A1 1 0 0 1 10 2Zm0 5a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          <p className="mt-1 text-sm">{message}</p>

          {actions && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="rounded-md p-1 text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Dismiss alert"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}