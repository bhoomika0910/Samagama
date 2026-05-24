import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import EscalationsPage from './pages/EscalationsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-slate-600">Loading Samagama...</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#eff6ff_40%,_#f8fafc_80%)] text-slate-900">
      {user ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/escalations"
          element={
            <ProtectedRoute>
              <EscalationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? '/home' : '/'} replace />} />
      </Routes>
      {user ? <ChatbotWidget /> : null}
    </div>
  );
}