import type { Comment } from '../types';

const BASE_URL = 'http://localhost:8080';

export function isServerPostId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function mapComment(raw: Record<string, unknown>): Comment {
  return {
    id: raw._id as string,
    recipeId: String(raw.postId),
    authorId: raw.sender as string,
    text: raw.content as string,
    postedAt: (raw.postedAt as string) ?? new Date().toISOString(),
  };
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/comment/post/${postId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  const data = await res.json();
  return (data.comments as Record<string, unknown>[]).map(mapComment);
}

export async function createComment(
  postId: string,
  sender: string,
  content: string,
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, sender, content }),
  });
  if (!res.ok) throw new Error('Failed to create comment');
  const raw = await res.json();
  return mapComment(raw as Record<string, unknown>);
}

export async function deleteComment(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/comment/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comment');
}
