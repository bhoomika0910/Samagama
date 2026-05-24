import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/home" className="text-lg font-black tracking-tight text-ink">
          Samagama
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <NavLink to="/home" className={({ isActive }) => (isActive ? 'text-flame' : 'text-slate-600')}>
            FAQ
          </NavLink>
          <NavLink to="/escalations" className={({ isActive }) => (isActive ? 'text-flame' : 'text-slate-600')}>
            Escalations
          </NavLink>
          {user?.role === 'admin' ? <NavLink to="/admin" className={({ isActive }) => (isActive ? 'text-flame' : 'text-slate-600')}>Admin</NavLink> : null}
          <button onClick={handleLogout} className="rounded-full bg-ink px-4 py-2 text-white">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}