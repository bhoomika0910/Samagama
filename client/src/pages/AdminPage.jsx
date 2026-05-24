import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [issues, setIssues] = useState([]);
  const [statusDrafts, setStatusDrafts] = useState({});

  const load = async () => {
    const [usersRes, faqsRes, issuesRes] = await Promise.all([
      api.get('/admin/users'),
      api.get('/faqs'),
      api.get('/escalations')
    ]);
    setUsers(usersRes.data.users);
    setFaqs(faqsRes.data.faqs);
    setIssues(issuesRes.data.escalations);
  };

  useEffect(() => {
    load();
  }, []);

  const updateIssueStatus = async (issueId) => {
    const status = statusDrafts[issueId];
    if (!status) return;

    await api.put(`/admin/escalations/${issueId}/status`, { status });
    toast.success('Issue status updated');
    load();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-ink">Admin Panel</h1>
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-soft"><h2 className="font-bold text-ink">Users</h2><p className="mt-2 text-3xl font-black">{users.length}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-soft"><h2 className="font-bold text-ink">FAQs</h2><p className="mt-2 text-3xl font-black">{faqs.length}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-soft"><h2 className="font-bold text-ink">Escalations</h2><p className="mt-2 text-3xl font-black">{issues.length}</p></div>
      </section>
      <section className="mt-8 rounded-3xl bg-white p-5 shadow-soft">
        <h2 className="font-bold text-ink">Registered users</h2>
        <div className="mt-4 overflow-x-auto text-sm">
          <table className="min-w-full">
            <thead className="text-left text-slate-500"><tr><th className="py-2">Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {users.map((user) => <tr key={user._id} className="border-t"><td className="py-2">{user.name}</td><td>{user.email}</td><td>{user.role}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-5 shadow-soft">
        <h2 className="font-bold text-ink">FAQs</h2>
        <div className="mt-4 overflow-x-auto text-sm">
          <table className="min-w-full">
            <thead className="text-left text-slate-500"><tr><th className="py-2">Question</th><th>Category</th><th>Tags</th></tr></thead>
            <tbody>
              {faqs.map((faq) => <tr key={faq._id} className="border-t"><td className="py-2 pr-4">{faq.question}</td><td>{faq.category}</td><td>{faq.tags?.join(', ')}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-5 shadow-soft">
        <h2 className="font-bold text-ink">Escalations</h2>
        <div className="mt-4 overflow-x-auto text-sm">
          <table className="min-w-full">
            <thead className="text-left text-slate-500"><tr><th className="py-2">Title</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id} className="border-t">
                  <td className="py-2 pr-4">{issue.title}</td>
                  <td>{issue.category}</td>
                  <td>{issue.status}</td>
                  <td>
                    <div className="flex flex-wrap gap-2 py-2">
                      <select className="rounded-full border border-slate-200 px-3 py-1 text-sm" value={statusDrafts[issue._id] || issue.status} onChange={(event) => setStatusDrafts((current) => ({ ...current, [issue._id]: event.target.value }))}>
                        <option value="open">open</option>
                        <option value="in_progress">in_progress</option>
                        <option value="resolved">resolved</option>
                      </select>
                      <button onClick={() => updateIssueStatus(issue._id)} className="rounded-full bg-ink px-3 py-1 text-sm font-semibold text-white">Update</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}