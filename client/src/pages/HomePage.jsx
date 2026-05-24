import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import FAQCard from '../components/FAQCard.jsx';

const categories = ['All', 'Academics', 'Hostel', 'Fees', 'Placements', 'Tech/ERP', 'Events'];

export default function HomePage() {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const [openAll, setOpenAll] = useState(false);

  const versionTag = useMemo(() => `v1.0.0 · ${new Date().toISOString().slice(0, 10)}`, []);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const loadFaqs = async () => {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search;
      const { data } = await api.get('/faqs', { params });
      setFaqs(data.faqs);
    };

    loadFaqs();
  }, [activeCategory, search]);

  const sendFeedback = async (faq, helpful) => {
    try {
      await api.post('/chatbot/feedback', {
        question: faq.question,
        response: faq.answer,
        helpful
      });
      toast.success('Thanks for the feedback');
    } catch {
      toast.error('Could not save feedback');
    }
  };

  useEffect(() => {
    setOpenAll(false);
    setOpenIndex(0);
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between text-sm text-white/60">
          <div className="font-semibold tracking-[0.35em] text-white/80">SAMAGAMA</div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/80">{versionTag}</div>
        </div>

        <section className="rounded-[2rem] border border-cyan-500/15 bg-gradient-to-b from-[#111827] to-[#0b0b0b] p-4 shadow-[0_0_80px_rgba(20,184,166,0.07)] sm:p-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 sm:p-6">
            <p className="mb-3 text-center text-xs uppercase tracking-[0.35em] text-cyan-300/80">FAQ</p>
            <h1 className="mx-auto max-w-3xl text-center text-3xl font-black leading-tight text-white sm:text-5xl">
              Vicharanashala Internship — FAQ
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-white/70 sm:text-lg">
              Welcome. This page covers the questions we hear most often. If something here is unclear, log in to your dashboard and ask Yaksha.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <button type="button" onClick={() => { setOpenAll(true); setOpenIndex(-1); }} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80">
                Expand all
              </button>
              <button type="button" onClick={() => { setOpenAll(false); setOpenIndex(0); }} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80">
                Collapse all
              </button>
            </div>

            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search by keyword, answer, or tags" className="mt-6 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400" />

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${activeCategory === category ? 'bg-white text-black' : 'bg-white/5 text-white/70'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4">
          {faqs.map((faq, index) => (
            <FAQCard
              key={faq._id || index}
              faq={faq}
              open={openAll || openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              onFeedback={(helpful) => sendFeedback(faq, helpful)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}