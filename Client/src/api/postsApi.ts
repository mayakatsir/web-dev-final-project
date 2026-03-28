import type { Recipe } from '../types';

const BASE_URL = 'http://localhost:8080';

interface ServerPost {
  _id: string;
  title: string;
  description: string;
  sender: string;
  category: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  likesCount: number;
  postedAt: string;
}

function toRecipe(post: ServerPost): Recipe {
  return {
    id: post._id,
    authorId: post.sender,
    title: post.title,
    description: post.description ?? '',
    imageUrl: post.imageUrl ?? '',
    category: post.category ?? 'General',
    cookingTime: post.cookingTime ?? 30,
    difficulty: post.difficulty ?? 'Easy',
    likesCount: post.likesCount ?? 0,
    postedAt: post.postedAt ?? new Date().toISOString(),
  };
}

export async function fetchAllPosts(): Promise<Recipe[]> {
  const res = await fetch(`${BASE_URL}/post`);
  const data = await res.json();
  return (data.posts as ServerPost[]).map(toRecipe);
}

export async function fetchUserPosts(senderId: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE_URL}/post?sender=${encodeURIComponent(senderId)}`);
  const data = await res.json();
  return (data.posts as ServerPost[]).map(toRecipe);
}

type PostFields = Pick<Recipe, 'title' | 'description' | 'imageUrl' | 'category' | 'cookingTime' | 'difficulty'>;

export async function createPost(fields: PostFields, senderId: string): Promise<Recipe> {
  const res = await fetch(`${BASE_URL}/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields, sender: senderId }),
  });
  const post: ServerPost = await res.json();
  return toRecipe(post);
}

export async function updatePost(id: string, fields: PostFields, senderId: string): Promise<void> {
  await fetch(`${BASE_URL}/post/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields, sender: senderId }),
  });
}

export async function deletePost(id: string): Promise<void> {
  await fetch(`${BASE_URL}/post/${id}`, { method: 'DELETE' });
}
