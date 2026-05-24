import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const loadNotifications = async (filterUnread = unreadOnly) => {
    try {
      const { data } = await api.get('/notifications', {
        params: filterUnread ? { unread: true } : undefined
      });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [unreadOnly]);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const openNotification = async (notification) => {
    await api.put(`/notifications/${notification._id}/read`);
    setShowDropdown(false);
    if (notification.link) {
      navigate(notification.link);
    }
    loadNotifications();
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    loadNotifications();
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
          <div className="relative">
            <button onClick={() => setShowDropdown((value) => !value)} className="relative rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700">
              🔔
              {unreadCount ? <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span> : null}
            </button>
            {showDropdown ? (
              <div className="absolute right-0 top-12 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-soft">
                <div className="flex items-center justify-between px-2 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <span>Notifications</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUnreadOnly((value) => !value)} className="text-slate-500">{unreadOnly ? 'All' : 'Unread'}</button>
                    <button onClick={markAllRead} className="text-flame">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {notifications.length ? notifications.map((notification) => (
                    <button key={notification._id} onClick={() => openNotification(notification)} className={`w-full rounded-2xl border p-3 text-left text-sm ${notification.read ? 'border-slate-100 bg-slate-50 text-slate-600' : 'border-cyan-100 bg-cyan-50 text-slate-800'}`}>
                      <p className="font-medium">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</p>
                    </button>
                  )) : <p className="px-2 py-4 text-sm text-slate-500">No notifications yet.</p>}
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfile((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
            >
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </button>
            {showProfile ? (
              <div className="absolute right-0 top-12 w-64 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-soft">
                <p className="font-semibold text-slate-800">Signed in as {user?.name}</p>
                <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
                <div className="my-3 h-px bg-slate-200" />
                <button onClick={handleLogout} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50">
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}