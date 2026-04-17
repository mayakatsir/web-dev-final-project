import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Recipe } from '../types';
import { fetchAllPosts, likePost, unlikePost } from '../api/postsApi';
import { useAuth } from '../context/AuthContext';
import RecipeFeedCard from '../components/RecipeFeedCard';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PAGE_SIZE = 6;

const styles = {
  heading: { mb: 3, fontSize: { xs: 22, sm: 26 } },
  loadingBox: { display: 'flex', justifyContent: 'center', py: 10 },
  emptyBox: { textAlign: 'center', py: 10 },
  feedList: { display: 'flex', flexDirection: 'column', gap: 2.5 },
  sentinel: { display: 'flex', justifyContent: 'center', py: 5 },
  groceryBox: {
    mt: 4,
    p: 3,
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  },
  groceryHeading: {
    mb: 0.5,
    fontSize: 19,
    fontWeight: 700,
    fontFamily: "'Playfair Display', Georgia, serif",
    color: 'primary.main',
  },
  grocerySubtext: { mb: 2, fontSize: 13 },
  answer: {
    mt: 2,
    p: 2,
    borderRadius: 2,
    bgcolor: 'rgba(232,99,26,0.06)',
    whiteSpace: 'pre-wrap',
    fontSize: 14,
    lineHeight: 1.7,
  },
} satisfies Record<string, SxProps<Theme>>;

export default function HomePage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [ingredients, setIngredients] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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

  async function handleRecommend() {
    if (!ingredients.trim()) return;
    setAiLoading(true);
    setAiAnswer('');
    try {
      const res = await fetch(`${BASE_URL}/ask-ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredients.trim() }),
      });
      const data = await res.json();
      setAiAnswer(data.answer ?? 'No response received.');
    } catch {
      setAiAnswer('Failed to get a recommendation. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
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

      </Box>{/* end feed column */}

      {/* Sticky grocery → recipe recommendation panel */}
      <Box sx={{ width: 320, flexShrink: 0, position: 'sticky', top: 80, display: { xs: 'none', md: 'block' } }}>
        <Box sx={styles.groceryBox}>
          <Typography sx={styles.groceryHeading}>
            What's in your fridge?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={styles.grocerySubtext}>
            Enter your ingredients and get a recipe recommendation from AI.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="e.g. eggs, tomatoes, cheese, onion..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            startIcon={aiLoading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeRoundedIcon />}
            onClick={handleRecommend}
            disabled={aiLoading || !ingredients.trim()}
            sx={{ mt: 1.5, borderRadius: 50, fontWeight: 600 }}
            fullWidth
          >
            {aiLoading ? 'Thinking...' : 'Recommend a Recipe'}
          </Button>
          {aiAnswer && (
          <Box sx={styles.answer}>
            {aiAnswer.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <Box key={i} sx={{ height: 6 }} />;

              // ## or # headings
              if (/^#{1,3} /.test(trimmed)) {
                const text = trimmed.replace(/^#{1,3}\s+/, '');
                return (
                  <Typography key={i} sx={{
                    fontFamily: "'Fredoka One', cursive",
                    fontWeight: 400,
                    fontSize: 18,
                    color: 'primary.main',
                    mt: 1.5,
                    mb: 0.5,
                    letterSpacing: 0.5,
                  }}>
                    {text}
                  </Typography>
                );
              }

              // **bold** inline — strip and render bold
              const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
              const rendered = parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <Box key={j} component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{part.slice(2, -2)}</Box>
                  : part
              );

              // Numbered steps
              if (/^\d+\./.test(trimmed)) {
                return (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'flex-start' }}>
                    <Box sx={{
                      minWidth: 22, height: 22, borderRadius: '50%',
                      bgcolor: 'primary.main', color: '#fff',
                      fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mt: '2px', flexShrink: 0,
                    }}>
                      {trimmed.match(/^(\d+)/)?.[1]}
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {rendered.map((p) => typeof p === 'string' ? p.replace(/^\d+\.\s*/, '') : p).filter((_, idx) => idx > 0 || typeof rendered[0] === 'object' || (rendered[0] as string).replace(/^\d+\.\s*/, ''))}
                    </Typography>
                  </Box>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                    <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, mt: '1px' }}>•</Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{rendered}</Typography>
                  </Box>
                );
              }

              return (
                <Typography key={i} variant="body2" sx={{ lineHeight: 1.7, mb: 0.25 }}>
                  {rendered}
                </Typography>
              );
            })}
          </Box>
          )}
        </Box>
      </Box>

      </Box>{/* end flex row */}
    </Container>
  );
}
