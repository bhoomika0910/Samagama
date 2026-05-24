import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        setNeedsPasswordChange(Boolean(data.user?.mustChangePassword));
      } catch {
        setUser(null);
        setNeedsPasswordChange(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    setUser(data.user);
    setNeedsPasswordChange(Boolean(data.needsPasswordChange));
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  };

  const changePassword = async (payload) => {
    const { data } = await api.post('/auth/change-password', payload);
    setUser(data.user);
    setNeedsPasswordChange(false);
    return data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setNeedsPasswordChange(false);
  };

  return <AuthContext.Provider value={{ user, setUser, loading, needsPasswordChange, login, register, logout, changePassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);