import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../components/auth/AuthCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rollPattern = /^[a-zA-Z0-9-_/]+$/;

const initialForm = { name: '', email: '', rollNumber: '', branch: 'CSE', year: '1st' };

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2 || form.name.trim().length > 60) {
      nextErrors.name = 'Please enter your full name';
    }
    if (!emailPattern.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!form.rollNumber.trim() || !rollPattern.test(form.rollNumber.trim())) {
      nextErrors.rollNumber = 'Please enter a valid roll number';
    }
    if (!form.branch) nextErrors.branch = 'Please choose branch';
    if (!form.year) nextErrors.year = 'Please choose year';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await register(form);
      toast.success(response.message || 'Check your email for login credentials');
      setDone(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#0d0d0d] px-4 py-8 text-[#f0f0f0]">
      <AuthCard uri="appname://new-candidate">
        {!done ? (
          <>
            <h1 className="mb-6 text-[22px] font-semibold text-[#f0f0f0]">Create your account</h1>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Full Name</label>
                <input value={form.name} onChange={(event) => { setForm((current) => ({ ...current, name: event.target.value })); setErrors((current) => ({ ...current, name: '' })); }} className={`auth-input ${errors.name ? 'auth-input-error' : ''}`} />
                {errors.name ? <p className="mt-1 flex items-center gap-1 text-xs text-[#f87171]">⚠ {errors.name}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Email Address</label>
                <input value={form.email} onChange={(event) => { setForm((current) => ({ ...current, email: event.target.value })); setErrors((current) => ({ ...current, email: '' })); }} className={`auth-input ${errors.email ? 'auth-input-error' : ''}`} />
                {errors.email ? <p className="mt-1 flex items-center gap-1 text-xs text-[#f87171]">⚠ {errors.email}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Roll Number</label>
                <input value={form.rollNumber} onChange={(event) => { setForm((current) => ({ ...current, rollNumber: event.target.value })); setErrors((current) => ({ ...current, rollNumber: '' })); }} className={`auth-input ${errors.rollNumber ? 'auth-input-error' : ''}`} />
                {errors.rollNumber ? <p className="mt-1 flex items-center gap-1 text-xs text-[#f87171]">⚠ {errors.rollNumber}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Branch</label>
                <select value={form.branch} onChange={(event) => setForm((current) => ({ ...current, branch: event.target.value }))} className={`auth-input ${errors.branch ? 'auth-input-error' : ''}`}>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Year</label>
                <select value={form.year} onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))} className={`auth-input ${errors.year ? 'auth-input-error' : ''}`}>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="PG">PG</option>
                </select>
              </div>

              <button disabled={loading} className="auth-btn">
                {loading ? <span className="inline-flex items-center gap-2"><span className="spinner" /> Creating account...</span> : 'Create account →'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-4xl text-[#22c55e]">✓</p>
            <h2 className="mt-3 text-xl font-semibold">Account created!</h2>
            <p className="mt-2 text-sm text-[#9a9a9a]">We have sent your login credentials to {form.email}</p>
            <p className="text-sm text-[#9a9a9a]">Check your inbox (and spam folder)</p>
            <Link to="/" className="mt-5 inline-block text-sm text-[#bbb] underline underline-offset-4">← Back to sign in</Link>
          </div>
        )}
      </AuthCard>
    </main>
  );
}
