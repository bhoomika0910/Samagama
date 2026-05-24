export default function IssueCard({ issue, onVote, onOpen, subscribed }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{issue.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{issue.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{issue.status}</span>
          {subscribed ? <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold text-sky-700">Subscribed</span> : null}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-sand px-3 py-1 text-ink">{issue.category}</span>
        <span>{issue.votes?.length || 0} votes</span>
        <span>{issue.comments?.length || 0} comments</span>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={onVote} className="rounded-full bg-ink px-4 py-2 text-sm text-white">
          Upvote
        </button>
        <button onClick={onOpen} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">
          View
        </button>
      </div>
    </article>
  );
}