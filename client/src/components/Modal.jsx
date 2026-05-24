export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}