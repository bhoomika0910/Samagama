import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#0d0d0d] text-[#888]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user?.isFirstLogin) {
    return <Navigate to="/set-password" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
}