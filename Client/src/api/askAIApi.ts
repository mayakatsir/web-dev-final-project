const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;

export async function recommendRecipe(ingredients: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/ask-ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients }),
  });
  const data = await res.json();
  return data.answer ?? 'No response received.';
}

export async function recommendFromFavorites(userId: string, mealType: string): Promise<{ answer?: string; error?: string }> {
  const res = await fetch(`${BASE_URL}/ask-ai/recommend-from-favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, mealType }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.message ?? 'Failed to generate.' };
  return { answer: data.answer ?? 'No response received.' };
}
