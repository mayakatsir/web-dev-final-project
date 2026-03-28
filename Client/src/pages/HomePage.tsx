import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { Comment } from '../types';
import { feedRecipes, otherUsers, seedComments } from '../data/mockData';
import RecipeFeedCard from '../components/RecipeFeedCard';

const userMap = Object.fromEntries(otherUsers.map((u) => [u.id, u]));

const PAGE_SIZE = 6;

export default function HomePage() {
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Comment[]>(seedComments);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < feedRecipes.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, feedRecipes.length));
            setLoading(false);
          }, 600);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  function toggleLike(recipeId: string) {
    setLikes((prev) => {
      const next = new Set(prev);
      next.has(recipeId) ? next.delete(recipeId) : next.add(recipeId);
      return next;
    });
  }

  function addComment(recipeId: string, text: string) {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      recipeId,
      authorId: 'u1',
      text,
      postedAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        What's cooking today
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {feedRecipes.slice(0, visibleCount).map((recipe) => (
          <RecipeFeedCard
            key={recipe.id}
            recipe={recipe}
            author={userMap[recipe.authorId]}
            comments={comments.filter((c) => c.recipeId === recipe.id)}
            liked={likes.has(recipe.id)}
            onLike={() => toggleLike(recipe.id)}
            onAddComment={(text) => addComment(recipe.id, text)}
          />
        ))}
      </Box>

      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {loading && <CircularProgress size={28} />}
        {!hasMore && !loading && (
          <Typography variant="caption" color="text.disabled">
            You're all caught up
          </Typography>
        )}
      </Box>
    </Container>
  );
}
