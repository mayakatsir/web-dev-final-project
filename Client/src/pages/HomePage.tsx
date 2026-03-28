import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { Recipe } from '../types';
import { fetchAllPosts, likePost, unlikePost } from '../api/postsApi';
import { currentUser } from '../data/mockData';
import RecipeFeedCard from '../components/RecipeFeedCard';

const PAGE_SIZE = 6;

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < recipes.length;

  useEffect(() => {
    fetchAllPosts()
      .then((posts) => {
        setRecipes(posts);
        setLikes(new Set(posts.filter((p) => p.likedBy.includes(currentUser.id)).map((p) => p.id)));
      })
      .catch(console.error)
      .finally(() => setPageLoading(false));
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, recipes.length));
            setLoading(false);
          }, 600);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, recipes.length]);

  function toggleLike(recipeId: string) {
    const alreadyLiked = likes.has(recipeId);

    // Optimistic update
    setLikes((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(recipeId) : next.add(recipeId);
      return next;
    });
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId ? { ...r, likesCount: r.likesCount + (alreadyLiked ? -1 : 1) } : r,
      ),
    );

    // Fire and forget
    if (alreadyLiked) {
      unlikePost(recipeId, currentUser.id).catch(console.error);
    } else {
      likePost(recipeId, currentUser.id).catch(console.error);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        What's cooking today
      </Typography>

      {pageLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : recipes.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 6 }}>
          No recipes yet. Be the first to post one!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {recipes.slice(0, visibleCount).map((recipe) => (
            <RecipeFeedCard
              key={recipe.id}
              recipe={recipe}
              liked={likes.has(recipe.id)}
              onLike={() => toggleLike(recipe.id)}
            />
          ))}
        </Box>
      )}

      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {loading && <CircularProgress size={28} />}
        {!hasMore && !loading && !pageLoading && recipes.length > 0 && (
          <Typography variant="caption" color="text.disabled">
            You're all caught up
          </Typography>
        )}
      </Box>
    </Container>
  );
}
