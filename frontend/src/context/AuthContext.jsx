import { createContext, useContext, useState, useCallback } from 'react';
import { AuthAPI } from '../api/endpoints';

const AuthContext = createContext(null);

function loadStoredUser() {
  const raw = localStorage.getItem('furni_user');
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  const persist = (authResponse) => {
    localStorage.setItem('furni_token', authResponse.token);
    localStorage.setItem(
      'furni_user',
      JSON.stringify({ userId: authResponse.userId, email: authResponse.email, roles: authResponse.roles })
    );
    setUser({ userId: authResponse.userId, email: authResponse.email, roles: authResponse.roles });
  };

  const login = useCallback(async (email, password) => {
    const res = await AuthAPI.login(email, password);
    persist(res);
    return res;
  }, []);

  const register = useCallback(async (email, password, code) => {
    const res = await AuthAPI.register(email, password, code);
    persist(res);
    return res;
  }, []);

  const googleLogin = useCallback(async (idToken) => {
    const res = await AuthAPI.google(idToken);
    persist(res);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('furni_token');
    localStorage.removeItem('furni_user');
    setUser(null);
  }, []);

  const isAdmin = !!user?.roles?.includes('Admin');

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
