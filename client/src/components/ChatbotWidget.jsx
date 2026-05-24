import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    { role: 'bot', text: 'Hi, I am Yaksha-mini. Ask me about FAQs or student help.' }
  ]);

  const bubbleClass = useMemo(() => 'rounded-2xl px-4 py-3 text-sm leading-6', []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const nextHistory = [...history, { role: 'user', text: message }];
    setHistory(nextHistory);
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/chatbot/query', { message });
      if (!data.found) {
        setHistory((current) => [
          ...current,
          {
            role: 'bot',
            text: 'No answer found — want to raise an escalation?',
            action: true
          }
        ]);
      } else {
        setHistory((current) => [
          ...current,
          {
            role: 'bot',
            text: data.faqs
              .map((faq) => `${faq.question}\n${faq.answer}`)
              .join('\n\n')
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open ? (
        <div className="mb-3 w-[92vw] max-w-sm overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-soft">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Yaksha-mini</p>
              <p className="text-xs text-white/70">Keyword help bot</p>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {history.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`whitespace-pre-line ${bubbleClass} ${item.role === 'user' ? 'ml-auto max-w-[85%] bg-flame text-white' : 'mr-auto max-w-[90%] bg-slate-100 text-slate-700'}`}>
                <p>{item.text}</p>
                {item.action ? (
                  <Link to="/escalations" onClick={() => setOpen(false)} className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                    Go to Escalations
                  </Link>
                ) : null}
              </div>
            ))}
            {loading ? (
              <div className="mr-auto flex w-fit items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
              </div>
            ) : null}
          </div>
          <div className="border-t p-3">
            <div className="flex gap-2">
              <input value={message} onChange={(event) => setMessage(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" placeholder="Ask your question..." />
              <button onClick={sendMessage} className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white">Send</button>
            </div>
          </div>
        </div>
      ) : null}
      <button onClick={() => setOpen((value) => !value)} className="rounded-full bg-ink px-5 py-4 text-sm font-semibold text-white shadow-soft">
        Ask Yaksha-mini
      </button>
    </div>
  );
}