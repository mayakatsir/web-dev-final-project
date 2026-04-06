import type { AuthUser } from '../context/AuthContext';

const BASE_URL = 'http://localhost:8080';

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
  return data;
}

export async function registerApi(
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Registration failed');
  return data;
}

export async function googleLoginApi(credential: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Google login failed');
  return data;
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Token refresh failed');
  return data;
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
}
