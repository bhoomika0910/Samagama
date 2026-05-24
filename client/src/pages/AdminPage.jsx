import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
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

    load();
  }, []);

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
    </main>
  );
}