import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../components/auth/AuthCard.jsx';
import PasswordStrengthPanel, { getPasswordStrength } from '../components/auth/PasswordStrengthPanel.jsx';
import api from '../api/axios.js';

export default function ResetPasswordTokenPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        await api.get(`/auth/validate-reset-token/${token}`);
        setValid(true);
      } catch {
        setValid(false);
      } finally {
        setValidating(false);
      }
    };

    validate();
  }, [token]);

  const submit = async (event) => {
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
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password updated! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#0d0d0d] px-4 py-8 text-[#f0f0f0]">
      <AuthCard uri="appname://password-reset">
        {validating ? (
          <p className="text-sm text-[#999]">Validating reset link...</p>
        ) : !valid ? (
          <div>
            <h1 className="text-[22px] font-semibold">This link has expired or is invalid.</h1>
            <Link to="/forgot-password" className="mt-4 inline-block text-sm text-[#aaa] underline underline-offset-4">Request a new one →</Link>
          </div>
        ) : (
          <>
            <h1 className="text-[22px] font-semibold">Choose a new password</h1>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">New Password</label>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input" />
                <PasswordStrengthPanel password={password} />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.05em] text-[#888]">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="auth-input" />
              </div>
              <button disabled={loading} className="auth-btn">
                {loading ? <span className="inline-flex items-center gap-2"><span className="spinner" /> Resetting...</span> : 'Reset password →'}
              </button>
            </form>
          </>
        )}
      </AuthCard>
    </main>
  );
}
