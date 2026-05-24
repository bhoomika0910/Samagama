import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const infoCards = [
  { title: 'Overview', description: 'What the portal is, who it is for, and how the flow works.', accent: 'from-sky-500/30 to-cyan-500/10', cta: 'Read the overview →', icon: '▣' },
  { title: 'FAQ', description: 'The questions people keep asking are already answered here.', accent: 'from-amber-500/30 to-orange-500/10', cta: 'Browse the FAQ →', icon: '?' },
  { title: 'Ask Yaksha-mini', description: 'Type a question and get an answer from the FAQ before signing in.', accent: 'from-emerald-500/30 to-teal-500/10', cta: 'Open the chat →', icon: '⌘' }
];

const initialRegisterForm = { name: '', email: '', rollNumber: '', branch: '', year: '' };

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);

  const versionTag = useMemo(() => `v1.0.0 · ${new Date().toISOString().slice(0, 10)}`, []);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const openChat = () => window.dispatchEvent(new CustomEvent('yaksha-open'));

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await login(loginForm);
      toast.success('Welcome back');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!registerForm.name || !registerForm.email || !registerForm.rollNumber || !registerForm.branch || !registerForm.year) {
      toast.error('Fill in all registration fields');
      return;
    }

    if (!emailPattern.test(registerForm.email)) {
      toast.error('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await register(registerForm);
      toast.success(response.message || 'Check your email for the temporary password');
      setRegisterForm(initialRegisterForm);
      setMode('login');
      setLoginForm((current) => ({ ...current, email: registerForm.email }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between text-sm text-white/60">
          <div className="font-semibold tracking-[0.35em] text-white/80">SAMAGAMA</div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/80">{versionTag}</div>
        </div>

        <section className="mx-auto max-w-5xl rounded-[2rem] border border-cyan-500/15 bg-gradient-to-b from-[#111827] to-[#0b0b0b] p-4 shadow-[0_0_80px_rgba(20,184,166,0.07)] sm:p-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 sm:p-6">
            <p className="mb-3 text-center text-xs uppercase tracking-[0.35em] text-cyan-300/80">Start Here</p>
            <h1 className="mx-auto max-w-3xl text-center text-3xl font-black leading-tight text-white sm:text-5xl">New to Samagama? Don&apos;t bother signing in yet.</h1>
            <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-white/70 sm:text-lg">Almost every question has been asked before. Check the FAQ first. Yaksha would appreciate the breather.</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {infoCards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => {
                    if (card.title === 'Ask Yaksha-mini') {
                      openChat();
                      return;
                    }
                    if (card.title === 'FAQ') {
                      navigate('/faq');
                    }
                  }}
                  className={`group rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${card.accent} p-5 text-left transition hover:-translate-y-1 hover:border-white/20`}
                >
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-2xl font-black text-slate-900 shadow-lg shadow-black/20">{card.icon}</div>
                  <h2 className="text-2xl font-black text-white">{card.title}</h2>
                  <p className="mt-4 min-h-24 text-sm leading-6 text-white/75">{card.description}</p>
                  <div className="mt-6 text-sm font-semibold text-white/90 group-hover:text-white">{card.cta}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-cyan-500/15 bg-[#111111] p-6 shadow-[0_0_60px_rgba(59,130,246,0.04)]">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-white/40">
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="ml-2 font-mono tracking-[0.18em] text-cyan-200">samagama://candidate-access</span>
            </div>

            <div className="mt-6 flex gap-2 rounded-full bg-white/5 p-1 text-sm">
              <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2 font-semibold ${mode === 'login' ? 'bg-white text-black' : 'text-white/60'}`}>Sign in</button>
              <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-full px-4 py-2 font-semibold ${mode === 'register' ? 'bg-white text-black' : 'text-white/60'}`}>Sign up</button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Email address</label>
                  <input value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none ring-0 placeholder:text-white/35 focus:border-cyan-400" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} placeholder="Enter your password" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 pr-12 text-white outline-none placeholder:text-white/35 focus:border-cyan-400" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 text-white/45">{showPassword ? '👁' : '◔'}</button>
                  </div>
                </div>
                <button disabled={loading} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15 disabled:opacity-60">Sign in</button>
                <div className="text-center">
                  <Link to="/reset-password" className="text-sm text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white">Forgot password?</Link>
                </div>
                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-white/30">
                  <span className="h-px flex-1 bg-white/10" />
                  <span>New here?</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <button type="button" onClick={() => setMode('register')} className="w-full rounded-2xl border border-white/20 bg-transparent px-4 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-200">Sign up with your email</button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={registerForm.name} onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400" />
                  <input value={registerForm.email} onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email address" className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400" />
                  <input value={registerForm.rollNumber} onChange={(event) => setRegisterForm((current) => ({ ...current, rollNumber: event.target.value }))} placeholder="Roll number" className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400" />
                  <input value={registerForm.branch} onChange={(event) => setRegisterForm((current) => ({ ...current, branch: event.target.value }))} placeholder="Branch" className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400" />
                </div>
                <input value={registerForm.year} onChange={(event) => setRegisterForm((current) => ({ ...current, year: event.target.value }))} placeholder="Year" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400" />
                <button disabled={loading} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15 disabled:opacity-60">Create account</button>
                <p className="text-xs leading-6 text-white/50">We&apos;ll email you a temporary password so you can sign in and change it on first login.</p>
              </form>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6 text-sm text-white/70">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-200/80">Status</p>
            <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p>• Email-only sign up</p>
              <p>• Temporary password sent by email</p>
              <p>• First login forces password change</p>
              <p>• Yaksha-mini available on this page</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}