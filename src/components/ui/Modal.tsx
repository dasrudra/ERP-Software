import { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  maxWidthClassName?: string;
  closeDisabled?: boolean;
};

export function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
  maxWidthClassName = "max-w-2xl",
  closeDisabled = false,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  function handleClose() {
    if (closeDisabled) {
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-4 backdrop-blur-sm">
      <div
        className={`flex max-h-[92vh] w-full ${maxWidthClassName} flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl`}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="pr-6">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>

          <button
            onClick={handleClose}
            disabled={closeDisabled}
            className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
