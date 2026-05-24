import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import Modal from '../components/Modal.jsx';
import IssueCard from '../components/IssueCard.jsx';

const statusOptions = ['All', 'open', 'in_progress', 'resolved'];
const categoryOptions = ['All', 'Academics', 'Hostel', 'Fees', 'Placements', 'Tech/ERP', 'Events'];

export default function EscalationsPage() {
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', tags: '' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [commentText, setCommentText] = useState('');
  const [resolutionText, setResolutionText] = useState('');

  const loadIssues = async () => {
    const params = {};
    if (statusFilter !== 'All') params.status = statusFilter;
    if (categoryFilter !== 'All') params.category = categoryFilter;

    const { data } = await api.get('/escalations', { params });
    setIssues(data.escalations);
  };

  useEffect(() => {
    loadIssues();
  }, [statusFilter, categoryFilter]);

  const openDetails = async (issue) => {
    const { data } = await api.get(`/escalations/${issue._id}`);
    setSelected(data.escalation);
  };

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

  const handleComment = async () => {
    if (!selected || !commentText.trim()) return;
    await api.post(`/escalations/${selected._id}/comment`, { text: commentText });
    setCommentText('');
    openDetails(selected);
    loadIssues();
  };

  const handleResolve = async () => {
    if (!selected) return;
    await api.put(`/escalations/${selected._id}/resolve`, {
      resolution: resolutionText,
      comment: commentText
    });
    setResolutionText('');
    setCommentText('');
    openDetails(selected);
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

      <div className="mt-6 flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button key={option} onClick={() => setStatusFilter(option)} className={`rounded-full px-4 py-2 text-sm font-medium ${statusFilter === option ? 'bg-flame text-white' : 'bg-white text-slate-600'}`}>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {categoryOptions.map((option) => (
          <button key={option} onClick={() => setCategoryFilter(option)} className={`rounded-full px-4 py-2 text-sm font-medium ${categoryFilter === option ? 'bg-ink text-white' : 'bg-white text-slate-600'}`}>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} onVote={() => handleVote(issue._id)} onOpen={() => openDetails(issue)} />
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
        {selected ? (
          <div className="space-y-5">
            <p className="whitespace-pre-line leading-7 text-slate-600">{selected.description}</p>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Current status: {selected.status}</p>
              {selected.resolution ? <p className="mt-2 whitespace-pre-line">Resolution: {selected.resolution}</p> : null}
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-ink">Comments</h4>
              <div className="max-h-48 space-y-3 overflow-y-auto">
                {selected.comments?.length ? selected.comments.map((comment, index) => <div key={`${comment.createdAt}-${index}`} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{comment.text}</div>) : <p className="text-sm text-slate-500">No comments yet.</p>}
              </div>
              <textarea className="input min-h-24" placeholder="Write a comment or a resolution note" value={commentText} onChange={(event) => setCommentText(event.target.value)} />
              <input className="input" placeholder="Resolution summary" value={resolutionText} onChange={(event) => setResolutionText(event.target.value)} />
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={handleComment} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Add Comment</button>
                <button type="button" onClick={handleResolve} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Mark Resolved</button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  );
}