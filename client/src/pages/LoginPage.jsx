import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', rollNumber: '', branch: '', year: '', password: '' });

  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isRegister) {
        await register(formData);
        toast.success('Account created');
      } else {
        await login({ email: formData.email, password: formData.password });
        toast.success('Welcome back');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 py-10">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-soft backdrop-blur md:grid-cols-2">
        <section className="bg-ink p-8 text-white md:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">Samagama.in clone</p>
          <h1 className="mt-4 text-4xl font-black leading-tight">Student help, answers, and escalations in one place.</h1>
          <p className="mt-4 max-w-md text-white/75">Login, register, browse FAQs, use Yaksha-mini, and raise issues without leaving the portal.</p>
        </section>
        <section className="p-8 md:p-12">
          <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium">
            <button onClick={() => setIsRegister(false)} className={`flex-1 rounded-full px-4 py-2 ${!isRegister ? 'bg-white text-ink shadow' : 'text-slate-500'}`}>Login</button>
            <button onClick={() => setIsRegister(true)} className={`flex-1 rounded-full px-4 py-2 ${isRegister ? 'bg-white text-ink shadow' : 'text-slate-500'}`}>Register</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister ? <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input" /> : null}
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" />
            {isRegister ? <input name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Roll Number" className="input" /> : null}
            {isRegister ? <input name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" className="input" /> : null}
            {isRegister ? <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="input" /> : null}
            <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className="input" />
            <button className="w-full rounded-2xl bg-flame px-4 py-3 font-semibold text-white">
              {isRegister ? 'Create account' : 'Login'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}