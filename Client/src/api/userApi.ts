import type { AuthUser } from '../context/AuthContext';

const BASE_URL = 'http://localhost:8080';

export async function updateProfileApi(
  userId: string,
  updates: Partial<Pick<AuthUser, 'name' | 'username' | 'avatarUrl' | 'bio'>>,
  token: string,
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Profile update failed');
  return {
    _id: data.user._id,
    username: data.user.username,
    email: data.user.email,
    name: data.user.name ?? '',
    avatarUrl: data.user.avatarUrl ?? '',
    bio: data.user.bio ?? '',
  };
}
