import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard.jsx';
import PasswordStrengthPanel, { getPasswordStrength } from '../components/auth/PasswordStrengthPanel.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SetPasswordPage() {
  const { setPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const strength = getPasswordStrength(password);

    if (password.length < 8 || strength.label === 'Weak') {
      toast.error('Please choose a stronger password');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await setPassword({ password });
      toast.success('Password updated');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#0d0d0d] px-4 py-8 text-[#f0f0f0]">
      <AuthCard uri="appname://set-password">
        <h1 className="text-[22px] font-semibold">Set your password</h1>
        <p className="mt-2 text-sm text-[#888]">Choose a strong password to secure your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">New Password</label>
            <input type="password" value={password} onChange={(event) => setPasswordInput(event.target.value)} className="auth-input" />
            <PasswordStrengthPanel password={password} />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="auth-input" />
          </div>

          <button disabled={loading} className="auth-btn">
            {loading ? <span className="inline-flex items-center gap-2"><span className="spinner" /> Saving...</span> : 'Set password & continue →'}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
