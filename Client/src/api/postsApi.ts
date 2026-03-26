import type { Recipe } from '../types';

const BASE_URL = 'http://localhost:8080';

interface ServerPost {
  _id: string;
  title: string;
  content: string;
  sender: string;
}

// Store description + imageUrl together in the content field as JSON
function encodeContent(description: string, imageUrl: string): string {
  return JSON.stringify({ description, imageUrl });
}

function decodeContent(raw: string): { description: string; imageUrl: string } {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { description: parsed.description ?? raw, imageUrl: parsed.imageUrl ?? '' };
    }
  } catch {
    // plain string — treat as description
  }
  return { description: raw, imageUrl: '' };
}

function toRecipe(post: ServerPost): Recipe {
  const { description, imageUrl } = decodeContent(post.content);
  return {
    id: post._id,
    authorId: post.sender,
    title: post.title,
    description,
    imageUrl,
    category: 'General',
    cookingTime: 30,
    difficulty: 'Easy',
    likesCount: 0,
    postedAt: new Date().toISOString(),
  };
}

export async function fetchUserPosts(senderId: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE_URL}/post?sender=${encodeURIComponent(senderId)}`);
  const data = await res.json();
  return (data.posts as ServerPost[]).map(toRecipe);
}

export async function createPost(
  title: string,
  description: string,
  imageUrl: string,
  senderId: string,
): Promise<Recipe> {
  const res = await fetch(`${BASE_URL}/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content: encodeContent(description, imageUrl), sender: senderId }),
  });
  const post: ServerPost = await res.json();
  return toRecipe(post);
}

export async function updatePost(
  id: string,
  title: string,
  description: string,
  imageUrl: string,
  senderId: string,
): Promise<void> {
  await fetch(`${BASE_URL}/post/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content: encodeContent(description, imageUrl), sender: senderId }),
  });
}

export async function deletePost(id: string): Promise<void> {
  await fetch(`${BASE_URL}/post/${id}`, { method: 'DELETE' });
}
