import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [requestEmail, setRequestEmail] = useState(email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequest = async (event) => {
    event.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email: requestEmail });
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send reset link');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await api.post('/auth/reset-password', { email, token, password });
      toast.success('Password updated');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reset password');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white grid place-items-center">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-[#111] p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">samagama://password-reset</p>
        <h1 className="mt-4 text-3xl font-black">Reset your password</h1>

        {token && email ? (
          <>
            <p className="mt-2 text-sm text-white/60">Set a new password for {email}.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35" />
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35" />
              <button className="w-full rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white">Update password</button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-white/60">Enter your email and we&apos;ll send a reset link.</p>
            <form onSubmit={handleRequest} className="mt-6 space-y-4">
              <input value={requestEmail} onChange={(event) => setRequestEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35" />
              <button className="w-full rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white">Send reset link</button>
            </form>
          </>
        )}

        <div className="mt-4 text-center text-sm text-white/60">
          <Link to="/" className="underline decoration-white/20 underline-offset-4 hover:text-white">Back to login</Link>
        </div>
      </div>
    </main>
  );
}