import type { Recipe } from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;

interface ServerPost {
  _id: string;
  title: string;
  description: string;
  sender: string;
  senderUsername?: string;
  senderName?: string;
  senderAvatar?: string;
  category: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  postedAt: string;
}

function resolveImageUrl(raw: string): string {
  if (!raw) return '';
  if (raw.startsWith('/uploads/')) return `${BASE_URL}${raw}`;
  return raw;
}

function toRecipe(post: ServerPost): Recipe {
  return {
    id: post._id,
    authorId: post.sender,
    authorUsername: post.senderUsername ?? post.sender,
    authorName: post.senderName ?? '',
    authorAvatar: resolveImageUrl(post.senderAvatar ?? ''),
    title: post.title,
    description: post.description ?? '',
    imageUrl: resolveImageUrl(post.imageUrl ?? ''),
    category: post.category ?? 'General',
    cookingTime: post.cookingTime ?? 30,
    difficulty: post.difficulty ?? 'Easy',
    likesCount: post.likesCount ?? 0,
    likedBy: post.likedBy ?? [],
    commentsCount: post.commentsCount ?? 0,
    postedAt: post.postedAt ?? new Date().toISOString(),
  };
}

export async function fetchAllPosts(page = 1, limit = 6): Promise<{ recipes: Recipe[]; hasMore: boolean }> {
  const res = await fetch(`${BASE_URL}/post?page=${page}&limit=${limit}`);
  const data = await res.json();
  return { recipes: (data.posts as ServerPost[]).map(toRecipe), hasMore: data.hasMore ?? false };
}

export async function fetchUserPosts(senderId: string, page = 1, limit = 9): Promise<{ recipes: Recipe[]; total: number; hasMore: boolean }> {
  const res = await fetch(`${BASE_URL}/post?sender=${encodeURIComponent(senderId)}&page=${page}&limit=${limit}`);
  const data = await res.json();
  return { recipes: (data.posts as ServerPost[]).map(toRecipe), total: data.total ?? 0, hasMore: data.hasMore ?? false };
}

type PostFields = Pick<Recipe, 'title' | 'description' | 'imageUrl' | 'category' | 'cookingTime' | 'difficulty'>;

export async function createPost(fields: PostFields, senderId: string, imageFile?: File): Promise<Recipe> {
  let res: Response;
  if (imageFile) {
    const form = new FormData();
    form.append('image', imageFile);
    form.append('sender', senderId);
    form.append('title', fields.title);
    form.append('description', fields.description);
    form.append('category', fields.category);
    form.append('cookingTime', String(fields.cookingTime));
    form.append('difficulty', fields.difficulty);
    res = await fetch(`${BASE_URL}/post`, { method: 'POST', body: form });
  } else {
    res = await fetch(`${BASE_URL}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, sender: senderId }),
    });
  }
  const post: ServerPost = await res.json();
  return toRecipe(post);
}

export async function updatePost(id: string, fields: PostFields, senderId: string, imageFile?: File): Promise<void> {
  if (imageFile) {
    const form = new FormData();
    form.append('image', imageFile);
    form.append('sender', senderId);
    form.append('title', fields.title);
    form.append('description', fields.description);
    form.append('category', fields.category);
    form.append('cookingTime', String(fields.cookingTime));
    form.append('difficulty', fields.difficulty);
    form.append('imageUrl', fields.imageUrl);
    await fetch(`${BASE_URL}/post/${id}`, { method: 'PUT', body: form });
  } else {
    await fetch(`${BASE_URL}/post/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, sender: senderId }),
    });
  }
}

export async function deletePost(id: string): Promise<void> {
  await fetch(`${BASE_URL}/post/${id}`, { method: 'DELETE' });
}

export async function fetchLikedPosts(userId: string, page = 1, limit = 9): Promise<{ recipes: Recipe[]; total: number; hasMore: boolean }> {
  const res = await fetch(`${BASE_URL}/post/liked/${encodeURIComponent(userId)}?page=${page}&limit=${limit}`);
  const data = await res.json();
  return { recipes: (data.posts as ServerPost[]).map(toRecipe), total: data.total ?? 0, hasMore: data.hasMore ?? false };
}

export async function likePost(postId: string, userId: string): Promise<void> {
  await fetch(`${BASE_URL}/post/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  await fetch(`${BASE_URL}/post/${postId}/like`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
}
