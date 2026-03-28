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

    if (alreadyLiked) {
      unlikePost(recipeId, currentUser.id).catch(console.error);
    } else {
      likePost(recipeId, currentUser.id).catch(console.error);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontSize: { xs: 22, sm: 26 } }}
      >
        What's cooking today
      </Typography>

      {pageLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : recipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.disabled" sx={{ mb: 1, fontSize: 40 }}>
            🍳
          </Typography>
          <Typography variant="body2" color="text.disabled">
            No recipes yet. Be the first to share one!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {recipes.slice(0, visibleCount).map((recipe) => (
            <RecipeFeedCard
              key={recipe.id}
              recipe={recipe}
              commentCount={recipe.commentsCount}
              liked={likes.has(recipe.id)}
              onLike={() => toggleLike(recipe.id)}
            />
          ))}
        </Box>
      )}

      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        {loading && <CircularProgress size={26} sx={{ color: 'primary.main' }} />}
        {!hasMore && !loading && !pageLoading && recipes.length > 0 && (
          <Typography variant="caption" color="text.disabled">
            You're all caught up ✓
          </Typography>
        )}
      </Box>
    </Container>
  );
}
