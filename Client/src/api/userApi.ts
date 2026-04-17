import type { AuthUser } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;

export async function updateProfileApi(
  userId: string,
  updates: Partial<Pick<AuthUser, 'name' | 'username' | 'avatarUrl' | 'bio'>>,
  token: string,
  avatarFile?: File,
): Promise<AuthUser> {
  let res: Response;
  if (avatarFile) {
    const form = new FormData();
    form.append('avatar', avatarFile);
    if (updates.name !== undefined) form.append('name', updates.name);
    if (updates.username !== undefined) form.append('username', updates.username);
    if (updates.bio !== undefined) form.append('bio', updates.bio);
    if (updates.avatarUrl !== undefined) form.append('avatarUrl', updates.avatarUrl);
    res = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
  } else {
    res = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Profile update failed');
  return {
    _id: data.user._id,
    username: data.user.username,
    email: data.user.email,
    name: data.user.name ?? '',
    avatarUrl: data.user.avatarUrl?.startsWith('/uploads/') ? `${BASE_URL}${data.user.avatarUrl}` : (data.user.avatarUrl ?? ''),
    bio: data.user.bio ?? '',
  };
}
