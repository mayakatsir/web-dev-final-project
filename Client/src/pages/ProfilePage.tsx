import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Recipe } from '../types';
import type { AuthUser } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../api/userApi';
import { createPost, deletePost, fetchLikedPosts, fetchUserPosts, updatePost } from '../api/postsApi';
import EditProfileModal from '../components/EditProfileModal';
import EditRecipeModal from '../components/EditRecipeModal';
import RecipeCard from '../components/RecipeCard';
import ProfileHero from '../components/ProfileHero';
import ProfileStats from '../components/ProfileStats';
import ProfileTabs from '../components/ProfileTabs';
import RecipeViewDialog from '../components/RecipeViewDialog';
import MealPickerDialog from '../components/MealPickerDialog';
import AIResultDialog from '../components/AIResultDialog';

const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;

const BLANK_RECIPE: Recipe = {
  id: '',
  authorId: '',
  authorUsername: '',
  authorName: '',
  authorAvatar: '',
  title: '',
  description: '',
  category: '',
  cookingTime: 30,
  difficulty: 'Easy',
  imageUrl: '',
  likesCount: 0,
  likedBy: [],
  commentsCount: 0,
  postedAt: '',
};

const styles = {
  loadingBox: { display: 'flex', justifyContent: 'center', py: 10 },
  emptyBox: { textAlign: 'center', py: 8, border: '2px dashed', borderColor: 'divider', borderRadius: 3 },
  emptyText: { mb: 2 },
  recipeGrid: { px: { xs: 2, sm: 0 } },
  sentinel: { display: 'flex', justifyContent: 'center', py: 4 },
  dialogTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 },
  dialogActions: { px: 3, pb: 2, gap: 1 },
} satisfies Record<string, SxProps<Theme>>;

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [tab, setTab] = useState<'mine' | 'favorites'>('mine');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [myTotal, setMyTotal] = useState(0);
  const [favTotal, setFavTotal] = useState(0);
  const [myPage, setMyPage] = useState(1);
  const [favPage, setFavPage] = useState(1);
  const [myHasMore, setMyHasMore] = useState(false);
  const [favHasMore, setFavHasMore] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiResultOpen, setAiResultOpen] = useState(false);
  const [aiError, setAiError] = useState('');

  const hasMore = tab === 'mine' ? myHasMore : favHasMore;

  useEffect(() => {
    if (!user) return;
    setPageLoading(true);
    setMyPage(1);
    setFavPage(1);
    setRecipes([]);
    setFavorites([]);
  }, [user?._id]);

  useEffect(() => {
    if (!user) return;
    const uid = user._id;
    let cancelled = false;
    setLoading(true);
    fetchUserPosts(uid, myPage)
      .then(({ recipes: posts, total, hasMore: more }) => {
        if (cancelled) return;
        setRecipes((prev) => myPage === 1 ? posts : [...prev, ...posts]);
        setMyTotal(total);
        setMyHasMore(more);
        if (myPage === 1) setPageLoading(false);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [myPage, user?._id]);

  useEffect(() => {
    if (!user) return;
    const uid = user._id;
    let cancelled = false;
    fetchLikedPosts(uid, favPage)
      .then(({ recipes: posts, total, hasMore: more }) => {
        if (cancelled) return;
        setFavorites((prev) => favPage === 1 ? posts : [...prev, ...posts]);
        setFavTotal(total);
        setFavHasMore(more);
      })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [favPage, user?._id]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          if (tab === 'mine') setMyPage((p) => p + 1);
          else setFavPage((p) => p + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, tab]);

  if (!user) return null;

  async function handleGenerateFromFavorites() {
    if (!selectedMeal) return;
    setAiLoading(true);
    setAiError('');
    setMealDialogOpen(false);
    try {
      const res = await fetch(`${BASE_URL}/ask-ai/recommend-from-favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user!._id, mealType: selectedMeal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.message ?? 'Failed to generate.');
      } else {
        setAiAnswer(data.answer ?? 'No response received.');
      }
      setAiResultOpen(true);
    } catch {
      setAiError('Something went wrong. Please try again.');
      setAiResultOpen(true);
    } finally {
      setAiLoading(false);
      setSelectedMeal('');
    }
  }

  async function handleSaveRecipe(
    id: string,
    updated: Pick<Recipe, 'title' | 'description' | 'imageUrl' | 'category' | 'cookingTime' | 'difficulty'>,
    imageFile?: File,
  ) {
    if (id === '') {
      const newRecipe = await createPost(updated, user._id, imageFile);
      setRecipes((prev) => [newRecipe, ...prev]);
      setMyTotal((prev) => prev + 1);
    } else {
      await updatePost(id, updated, user._id, imageFile);
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    }
  }

  async function handleSaveProfile(
    updates: Pick<AuthUser, 'name' | 'username' | 'bio' | 'avatarUrl'>,
    avatarFile?: File,
  ) {
    if (!token) return;
    const updated = await updateProfileApi(user._id, updates, token, avatarFile);
    updateUser(updated);
  }

  async function handleDeleteRecipe() {
    if (!deletingRecipe) return;
    await deletePost(deletingRecipe.id);
    setRecipes((prev) => prev.filter((r) => r.id !== deletingRecipe.id));
    setMyTotal((prev) => prev - 1);
    setDeletingRecipe(null);
  }

  const activeList = tab === 'mine' ? recipes : favorites;

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      <ProfileHero user={user} onEditClick={() => setEditOpen(true)} />

      <ProfileStats myTotal={myTotal} favTotal={favTotal} />

      <ProfileTabs
        tab={tab}
        onTabChange={setTab}
        aiLoading={aiLoading}
        favTotal={favTotal}
        onNewRecipe={() => setEditingRecipe(BLANK_RECIPE)}
        onInspireMe={() => setMealDialogOpen(true)}
      />

      {pageLoading ? (
        <Box sx={styles.loadingBox}><CircularProgress sx={{ color: 'primary.main' }} /></Box>
      ) : activeList.length === 0 ? (
        <Box sx={styles.emptyBox}>
          <Typography sx={{ fontSize: 36, mb: 1 }}>{tab === 'mine' ? '👨‍🍳' : '🤍'}</Typography>
          <Typography variant="body2" color="text.disabled" sx={styles.emptyText}>
            {tab === 'mine' ? 'No recipes yet. Share your first dish!' : 'No favorites yet. Like some recipes!'}
          </Typography>
          {tab === 'mine' && (
            <Button variant="outlined" size="small" startIcon={<AddRoundedIcon />} onClick={() => setEditingRecipe(BLANK_RECIPE)}>
              Add Recipe
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2} sx={styles.recipeGrid}>
          {activeList.map((recipe, i) => (
            <Grid key={`${recipe.id}-${i}`} size={{ xs: 12, sm: 6, md: 4 }}>
              <RecipeCard
                recipe={recipe}
                onClick={() => setViewingRecipe(recipe)}
                onEdit={tab === 'mine' ? () => setEditingRecipe(recipe) : undefined}
                onDelete={tab === 'mine' ? () => setDeletingRecipe(recipe) : undefined}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Box ref={sentinelRef} sx={styles.sentinel}>
        {loading && <CircularProgress size={26} sx={{ color: 'primary.main' }} />}
        {!hasMore && !loading && !pageLoading && activeList.length > 0 && (
          <Typography variant="caption" color="text.disabled">All loaded ✓</Typography>
        )}
      </Box>

      <RecipeViewDialog recipe={viewingRecipe} onClose={() => setViewingRecipe(null)} />

      <MealPickerDialog
        open={mealDialogOpen}
        selectedMeal={selectedMeal}
        onSelectMeal={setSelectedMeal}
        onClose={() => { setMealDialogOpen(false); setSelectedMeal(''); }}
        onGenerate={handleGenerateFromFavorites}
      />

      <AIResultDialog
        open={aiResultOpen}
        answer={aiAnswer}
        error={aiError}
        onClose={() => { setAiResultOpen(false); setAiError(''); setAiAnswer(''); }}
      />

      <EditProfileModal open={editOpen} user={user} onClose={() => setEditOpen(false)} onSave={handleSaveProfile} />
      <EditRecipeModal open={editingRecipe !== null} recipe={editingRecipe} onClose={() => setEditingRecipe(null)} onSave={handleSaveRecipe} />

      <Dialog open={deletingRecipe !== null} onClose={() => setDeletingRecipe(null)}>
        <DialogTitle sx={styles.dialogTitle}>Delete recipe?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{deletingRecipe?.title}</strong> will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button onClick={() => setDeletingRecipe(null)} variant="outlined" color="inherit" sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteRecipe}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
