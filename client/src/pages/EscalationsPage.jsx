import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import Modal from '../components/Modal.jsx';
import IssueCard from '../components/IssueCard.jsx';

export default function EscalationsPage() {
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', tags: '' });

  const loadIssues = async () => {
    const { data } = await api.get('/escalations');
    setIssues(data.escalations);
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await api.post('/escalations', { ...formData, tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean) });
      toast.success('Issue raised');
      setOpenModal(false);
      setFormData({ title: '', description: '', category: '', tags: '' });
      loadIssues();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create issue');
    }
  };

  const handleVote = async (id) => {
    await api.put(`/escalations/${id}/vote`);
    loadIssues();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-flame">Escalations</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Raise and resolve student issues</h1>
        </div>
        <button onClick={() => setOpenModal(true)} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Raise Issue</button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} onVote={() => handleVote(issue._id)} onOpen={() => setSelected(issue)} />
        ))}
      </div>

      <Modal open={openModal} title="Raise Issue" onClose={() => setOpenModal(false)}>
        <form onSubmit={handleCreate} className="grid gap-4">
          <input className="input" placeholder="Title" value={formData.title} onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))} />
          <textarea className="input min-h-32" placeholder="Description" value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} />
          <input className="input" placeholder="Category" value={formData.category} onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))} />
          <input className="input" placeholder="Tags comma separated" value={formData.tags} onChange={(event) => setFormData((current) => ({ ...current, tags: event.target.value }))} />
          <button className="rounded-2xl bg-flame px-4 py-3 font-semibold text-white">Submit</button>
        </form>
      </Modal>

      <Modal open={Boolean(selected)} title={selected?.title || ''} onClose={() => setSelected(null)}>
        {selected ? <p className="whitespace-pre-line leading-7 text-slate-600">{selected.description}</p> : null}
      </Modal>
    </main>
  );
}