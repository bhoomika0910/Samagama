import { useEffect, useState } from 'react';
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white/80 p-6 shadow-soft backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-flame">Home / FAQ</p>
        <h1 className="mt-3 text-3xl font-black text-ink">Everything students ask most often</h1>
        <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search by keyword, answer, or tags" className="input mt-6" />
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-sm font-medium ${activeCategory === category ? 'bg-ink text-white' : 'bg-white text-slate-600'}`}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4">
        {faqs.map((faq, index) => (
          <FAQCard key={faq._id || index} faq={faq} open={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? -1 : index)} onFeedback={(helpful) => sendFeedback(faq, helpful)} />
        ))}
      </section>
    </main>
  );
}