import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../components/auth/AuthCard.jsx';
import api from '../api/axios.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [counter, setCounter] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!counter) return undefined;
    const timer = setInterval(() => setCounter((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const sendLink = async (event) => {
    event?.preventDefault();
    if (!emailPattern.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      setCounter(60);
      toast.success('Reset link sent');
    } catch {
      toast.error('Could not send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#0d0d0d] px-4 py-8 text-[#f0f0f0]">
      <AuthCard uri="appname://password-reset">
        {!sent ? (
          <>
            <h1 className="text-[22px] font-semibold">Reset your password</h1>
            <p className="mt-2 text-sm text-[#888]">Enter your email and we will send a reset link.</p>
            <form onSubmit={sendLink} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Email address</label>
                <input
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((current) => ({ ...current, email: '' }));
                  }}
                  className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                />
                {errors.email ? <p className="mt-1 flex items-center gap-1 text-xs text-[#f87171]">⚠ {errors.email}</p> : null}
              </div>
              <button disabled={loading} className="auth-btn">
                {loading ? <span className="inline-flex items-center gap-2"><span className="spinner" /> Sending...</span> : 'Send reset link'}
              </button>
            </form>
          </>
        ) : (
          <div>
            <h1 className="text-[22px] font-semibold">Reset link sent</h1>
            <p className="mt-2 text-sm text-[#888]">If that email is registered, you will receive a link shortly.</p>
            <p className="mt-1 text-sm text-[#888]">Link expires in 1 hour.</p>
            <button disabled={counter > 0 || loading} onClick={sendLink} className="mt-5 text-sm text-[#aaa] underline underline-offset-4 disabled:opacity-50">
              {counter > 0 ? `Didn't get it? Resend in ${counter}s` : "Didn't get it? Resend →"}
            </button>
          </div>
        )}
        <div className="mt-5 text-center">
          <Link to="/" className="text-sm text-[#777] underline underline-offset-4 hover:text-[#aaa]">← Back to sign in</Link>
        </div>
      </AuthCard>
    </main>
  );
}
