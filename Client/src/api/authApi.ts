import type { AuthUser } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function resolveAvatarUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return `${BASE_URL}${url}`;
  return url;
}

function normalizeUser(user: AuthUser): AuthUser {
  return { ...user, avatarUrl: resolveAvatarUrl(user.avatarUrl) };
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export async function loginApi(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Login failed');
  return { ...data, user: normalizeUser(data.user) };
}

export async function registerApi(
  username: string,
  email: string,
  password: string,
  avatarFile?: File,
): Promise<AuthResponse> {
  let res: Response;
  if (avatarFile) {
    const form = new FormData();
    form.append('username', username);
    form.append('email', email);
    form.append('password', password);
    form.append('avatar', avatarFile);
    res = await fetch(`${BASE_URL}/auth/register`, { method: 'POST', body: form });
  } else {
    res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Registration failed');
  return { ...data, user: normalizeUser(data.user) };
}

export async function googleLoginApi(credential: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Google login failed');
  return { ...data, user: normalizeUser(data.user) };
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Token refresh failed');
  return { ...data, user: normalizeUser(data.user) };
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
}
