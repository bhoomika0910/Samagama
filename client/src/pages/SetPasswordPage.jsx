import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SetPasswordPage() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      await changePassword({ password });
      toast.success('Password updated');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update password');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white grid place-items-center">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-[#111] p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">samagama://first-login</p>
        <h1 className="mt-4 text-3xl font-black">Change your password</h1>
        <p className="mt-2 text-sm text-white/60">This is required the first time you sign in.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35" />
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none placeholder:text-white/35" />
          <button className="w-full rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white">Save new password</button>
        </form>
      </div>
    </main>
  );
}