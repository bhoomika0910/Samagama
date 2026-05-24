export default function FAQCard({ faq, open, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full rounded-3xl border border-white/80 bg-white p-5 text-left shadow-soft transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame">{faq.category}</p>
          <h3 className="mt-2 text-lg font-bold text-ink">{faq.question}</h3>
        </div>
        <span className="text-slate-400">{open ? '−' : '+'}</span>
      </div>
      {open ? <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {faq.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}