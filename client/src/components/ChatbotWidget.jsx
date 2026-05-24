import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const starterChips = [
  'When does internship start?',
  'How to submit NOC?',
  'What is VIBE phase?',
  'How is team formation done?',
  '#escalate'
];

const commandResponses = [
  {
    test: /^(hi|hello|hey|yo|namaste)\b/i,
    text: 'Hello. I am Yaksha-mini. Ask anything about Samagama FAQ and I will find the nearest section.'
  },
  {
    test: /(thanks|thank you|thx)/i,
    text: 'Happy to help. Ask another one if you need more clarity.'
  }
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    { role: 'bot', text: 'Hi, I am Yaksha-mini. Ask me about FAQs, sections like §3.1, or type #escalate.' }
  ]);

  const bubbleClass = useMemo(() => 'rounded-2xl px-4 py-3 text-sm leading-6', []);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener('yaksha-open', openHandler);
    return () => window.removeEventListener('yaksha-open', openHandler);
  }, []);

  const sendMessage = async (directMessage = '') => {
    const prompt = (directMessage || message).trim();
    if (!prompt) return;

    const nextHistory = [...history, { role: 'user', text: prompt }];
    setHistory(nextHistory);
    setMessage('');
    setLoading(true);

    if (prompt.toLowerCase() === '#escalate') {
      await wait(350);
      setHistory((current) => [
        ...current,
        {
          role: 'bot',
          text: 'Opening escalation path. Please add your issue with details so admins can prioritize it.',
          action: true,
          query: prompt,
          response: 'Escalation flow suggested'
        }
      ]);
      setLoading(false);
      return;
    }

    const quickReply = commandResponses.find((entry) => entry.test.test(prompt));
    if (quickReply) {
      await wait(300);
      setHistory((current) => [
        ...current,
        {
          role: 'bot',
          text: quickReply.text,
          query: prompt,
          response: quickReply.text
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/chatbot/query', { message: prompt });
      await wait(400);

      if (!data.found) {
        setHistory((current) => [
          ...current,
          {
            role: 'bot',
            text: 'I could not find a confident answer. You can escalate this so the team can review it.',
            action: true,
            query: prompt,
            response: 'No confident answer from FAQ'
          }
        ]);
      } else {
        const cards = data.results || [];
        const combined = cards.map((faq) => `${faq.question}\n${faq.answer}`).join('\n\n');
        setHistory((current) => [
          ...current,
          {
            role: 'bot',
            text: `Found ${data.totalMatches} relevant FAQ result${data.totalMatches > 1 ? 's' : ''}.`,
            cards,
            suggestion: data.suggestion,
            query: prompt,
            response: combined
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (item, helpful) => {
    try {
      await api.post('/chatbot/feedback', {
        question: item.query || item.text,
        response: item.response || item.text,
        helpful
      });
      setHistory((current) => current.map((entry) => (entry === item ? { ...entry, feedbackGiven: true } : entry)));
    } catch {
      // ignore feedback errors for now
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
                {item.suggestion ? <p className="mt-2 text-xs text-amber-700">{item.suggestion}</p> : null}
                {item.cards?.length ? (
                  <div className="mt-3 space-y-2">
                    {item.cards.map((card) => (
                      <div key={`${card.subsection}-${card.question}`} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-xs font-semibold text-slate-500">§{card.subsection} · {card.sectionTitle}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{card.question}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{card.answer}</p>
                        <p className="mt-2 text-xs text-cyan-700">{card.referenceNote}</p>
                        <Link to={`/faq#${card.subsection}`} onClick={() => setOpen(false)} className="mt-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          Open in FAQ
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : null}
                {item.action ? (
                  <Link to="/escalations" onClick={() => setOpen(false)} className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                    Go to Escalations
                  </Link>
                ) : null}
                {item.role === 'bot' ? (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <span>Was this helpful?</span>
                    <button type="button" onClick={() => sendFeedback(item, true)} className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">👍</button>
                    <button type="button" onClick={() => sendFeedback(item, false)} className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">👎</button>
                  </div>
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

            {history.length <= 2 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {starterChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => sendMessage(chip)}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {chip}
                  </button>
                ))}
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