export default function AuthCard({ uri, children }) {
  return (
    <div className="w-full max-w-[420px] rounded-xl border border-[#222] bg-[#111111]">
      <div className="mono flex items-center gap-2 border-b border-[#222] bg-[#1a1a1a] px-4 py-[10px] text-xs text-[#666]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2">{uri}</span>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}
