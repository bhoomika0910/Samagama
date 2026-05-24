const highlightText = (text, query) => {
  if (!query?.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'));
  return parts.map((part, index) => (
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={`${part}-${index}`} className="rounded bg-amber-300/80 px-1 text-black">{part}</mark>
      : <span key={`${part}-${index}`}>{part}</span>
  ));
};

export default function FAQCard({ faq, open, onToggle, onFeedback, highlighted = false, searchTerm = '' }) {
  return (
    <div className={`w-full rounded-3xl border bg-[#111111] p-5 text-left shadow-soft transition hover:-translate-y-0.5 ${highlighted ? 'border-cyan-400/80 shadow-[0_0_0_1px_rgba(34,211,238,0.45)]' : 'border-cyan-500/15'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">{faq.category}</p>
          <p className="mt-1 text-xs text-white/45">§{faq.subsection} · {faq.sectionTitle}</p>
          <h3 className="mt-2 text-lg font-bold text-white">{highlightText(faq.question, searchTerm)}</h3>
        </div>
        <button onClick={onToggle} className="text-white/45">{open ? '−' : '+'}</button>
      </div>
      {open ? <p className="mt-4 leading-7 text-white/72">{highlightText(faq.answer, searchTerm)}</p> : null}
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