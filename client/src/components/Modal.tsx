import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
};

export default function Modal({ open, title, onClose, children, footer, size = "md" }: Props) {
  useEffect(() => {
    function esc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-md" : "max-w-xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative w-full ${maxW} rounded-2xl bg-white shadow-lg`}>
        <header className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm hover:bg-zinc-100">×</button>
        </header>
        <div className="px-6 py-5">{children}</div>
        {footer && <footer className="px-6 py-4 border-t bg-zinc-50">{footer}</footer>}
      </div>
    </div>
  );
}
