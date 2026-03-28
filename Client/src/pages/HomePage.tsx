import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Recipe } from '../types';
import { fetchAllPosts, likePost, unlikePost } from '../api/postsApi';
import { useAuth } from '../context/AuthContext';
import RecipeFeedCard from '../components/RecipeFeedCard';

const PAGE_SIZE = 6;

const styles = {
  heading: { mb: 3, fontSize: { xs: 22, sm: 26 } },
  loadingBox: { display: 'flex', justifyContent: 'center', py: 10 },
  emptyBox: { textAlign: 'center', py: 10 },
  feedList: { display: 'flex', flexDirection: 'column', gap: 2.5 },
  sentinel: { display: 'flex', justifyContent: 'center', py: 5 },
} satisfies Record<string, SxProps<Theme>>;

export default function HomePage() {
  const { user } = useAuth();
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
        setRecipes(posts.slice().sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));
        const uid = user?._id ?? '';
        setLikes(new Set(posts.filter((p) => uid && p.likedBy.includes(uid)).map((p) => p.id)));
      })
      .catch(console.error)
      .finally(() => setPageLoading(false));
  }, [user?._id]);

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

    const uid = user?._id ?? '';
    if (alreadyLiked) {
      unlikePost(recipeId, uid).catch(console.error);
    } else {
      likePost(recipeId, uid).catch(console.error);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={styles.heading}>
        What's cooking today
      </Typography>

      {pageLoading ? (
        <Box sx={styles.loadingBox}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : recipes.length === 0 ? (
        <Box sx={styles.emptyBox}>
          <Typography variant="h6" color="text.disabled" sx={{ mb: 1, fontSize: 40 }}>
            🍳
          </Typography>
          <Typography variant="body2" color="text.disabled">
            No recipes yet. Be the first to share one!
          </Typography>
        </Box>
      ) : (
        <Box sx={styles.feedList}>
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

      <Box ref={sentinelRef} sx={styles.sentinel}>
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
