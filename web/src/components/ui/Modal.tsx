import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose(): void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
};

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidthClassName,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={[
            "w-full",
            maxWidthClassName ?? "max-w-md",
            "rounded-xl bg-white shadow-lg",
          ].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <p className="m-0 text-sm font-semibold text-[#111827]">{title}</p>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5"
              onClick={onClose}
              aria-label="Fechar"
              type="button"
            >
              ×
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
          {footer ? (
            <div className="flex items-center justify-end gap-2 border-t border-black/5 px-5 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
