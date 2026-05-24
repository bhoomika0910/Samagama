export default function FAQCard({ faq, open, onToggle, onFeedback }) {
  return (
    <div className="w-full rounded-3xl border border-cyan-500/15 bg-[#111111] p-5 text-left shadow-soft transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">{faq.category}</p>
          <h3 className="mt-2 text-lg font-bold text-white">{faq.question}</h3>
        </div>
        <button onClick={onToggle} className="text-white/45">{open ? '−' : '+'}</button>
      </div>
      {open ? <p className="mt-4 leading-7 text-white/72">{faq.answer}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {faq.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
            {tag}
          </span>
        ))}
      </div>
      {open ? (
        <div className="mt-4 flex items-center gap-3 text-sm text-white/65">
          <span>Was this helpful?</span>
          <button type="button" onClick={() => onFeedback(true)} className="rounded-full bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-300">👍</button>
          <button type="button" onClick={() => onFeedback(false)} className="rounded-full bg-rose-500/15 px-3 py-1 font-semibold text-rose-300">👎</button>
        </div>
      ) : null}
    </div>
  );
}