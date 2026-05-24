import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const infoCards = [
  {
    title: 'Overview',
    description: 'What this portal is',
    cta: 'Read more →',
    icon: '🟦',
    bg: 'bg-[#0a1628]',
    border: 'border-[#1a3a5c]'
  },
  {
    title: 'FAQ',
    description: 'Browse all questions',
    cta: 'Browse FAQ →',
    icon: '🟧',
    bg: 'bg-[#1a1000]',
    border: 'border-[#3d2800]'
  },
  {
    title: 'Ask Yaksha',
    description: 'Chat without signing in',
    cta: 'Open chat →',
    icon: '🟩',
    bg: 'bg-[#0a1a0a]',
    border: 'border-[#1a3d1a]'
  }
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const versionTag = useMemo(() => 'v1.0.0 · 25 May 2026 · IST', []);

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim() || !emailPattern.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!form.password || form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form);
      toast.success('Signed in');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] px-4 py-10 text-[#f0f0f0]">
      <p className="mono fixed right-5 top-4 text-[11px] text-[#555]">{versionTag}</p>
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <h1 className="text-center text-[28px] font-semibold text-white">Samagama</h1>
        <p className="mt-2 text-center text-sm text-[#777]">Student access portal for internship workflows</p>

        <section className="mt-8 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          {infoCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => {
                if (card.title === 'FAQ') navigate('/faq');
                if (card.title === 'Ask Yaksha') window.dispatchEvent(new CustomEvent('yaksha-open'));
              }}
              className={`${card.bg} ${card.border} rounded-xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-[#555]`}
            >
              <p className="text-xl">{card.icon}</p>
              <h2 className="mt-3 text-base font-semibold text-[#e8e8e8]">{card.title}</h2>
              <p className="mt-2 text-sm text-[#9a9a9a]">{card.description}</p>
              <p className="mt-4 text-sm text-[#c5c5c5]">{card.cta}</p>
            </button>
          ))}
        </section>

        <div className="mt-7 flex w-full max-w-[420px] items-center gap-3 text-[13px] text-[#555]">
          <span className="h-px flex-1 bg-[#222]" />
          <span>Already applied? Sign in</span>
          <span className="h-px flex-1 bg-[#222]" />
        </div>

        <div className="mt-7 w-full max-w-[420px]">
          <AuthCard uri="appname://candidate-access">
            <h2 className="mb-6 text-[22px] font-semibold text-[#f0f0f0]">Sign in to your account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Email address</label>
                <input
                  value={form.email}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, email: event.target.value }));
                    setErrors((current) => ({ ...current, email: '' }));
                  }}
                  placeholder="you@example.com"
                  className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                />
                {errors.email ? <p className="mt-1 flex items-center gap-1 text-xs text-[#f87171]">⚠ {errors.email}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, password: event.target.value }));
                      setErrors((current) => ({ ...current, password: '' }));
                    }}
                    placeholder="Enter password"
                    className={`auth-input pr-11 ${errors.password ? 'auth-input-error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888]">
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password ? <p className="mt-1 flex items-center gap-1 text-xs text-[#f87171]">⚠ {errors.password}</p> : null}
              </div>

              <button disabled={loading} className="auth-btn">
                {loading ? <span className="inline-flex items-center gap-2"><span className="spinner" /> Signing in...</span> : 'Sign in'}
              </button>
            </form>

            <Link to="/forgot-password" className="mt-4 block text-center text-[13px] text-[#666] underline underline-offset-[3px] hover:text-[#999]">
              Forgot password?
            </Link>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#222]" />
              <span className="text-[13px] text-[#555]">New here?</span>
              <span className="h-px flex-1 bg-[#222]" />
            </div>

            <button onClick={() => navigate('/register')} className="auth-secondary-btn">Create account</button>
          </AuthCard>
        </div>
      </div>
    </main>
  );
}
