import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loginApi, registerApi, googleLoginApi, refreshTokenApi, logoutApi } from '../api/authApi';

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl: string;
  bio: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, avatarFile?: File) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updated: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const REFRESH_TOKEN_KEY = 'refreshToken';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (stored) {
      refreshTokenApi(stored)
        .then(({ token: t, refreshToken: rt, user: u }) => {
          setToken(t);
          setUser(u);
          localStorage.setItem(REFRESH_TOKEN_KEY, rt);
        })
        .catch(() => {
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        });
    }
  }, []);

  function persist(t: string, rt: string, u: AuthUser) {
    setToken(t);
    setUser(u);
    localStorage.setItem(REFRESH_TOKEN_KEY, rt);
  }

  async function login(username: string, password: string) {
    const { token: t, refreshToken: rt, user: u } = await loginApi(username, password);
    persist(t, rt, u);
  }

  async function register(username: string, email: string, password: string, avatarFile?: File) {
    const { token: t, refreshToken: rt, user: u } = await registerApi(username, email, password, avatarFile);
    persist(t, rt, u);
  }

  async function googleLogin(credential: string) {
    const { token: t, refreshToken: rt, user: u } = await googleLoginApi(credential);
    persist(t, rt, u);
  }

  async function logout() {
    const rt = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (rt) {
      await logoutApi(rt).catch(() => {});
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
  }

  function updateUser(updated: AuthUser) {
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
