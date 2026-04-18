import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';
const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
import { updateProfileApi } from '../api/userApi';
import { createPost, deletePost, fetchLikedPosts, fetchUserPosts, updatePost } from '../api/postsApi';
import { RECIPE_CATEGORIES } from '../data/categories';
import EditProfileModal from '../components/EditProfileModal';
import EditRecipeModal from '../components/EditRecipeModal';
import RecipeCard from '../components/RecipeCard';

const PAGE_SIZE = 9;

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
  heroSection: {
    mx: { xs: -3, sm: -3 },
    background: 'linear-gradient(180deg, #D94F1A 0%, #E8631A 28%, #F0703A 52%, #fdf0e8 80%, #ffffff 100%)',
    pt: { xs: 5, sm: 7 },
    pb: { xs: 2, sm: 3 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: { position: 'absolute', top: -20, right: 70, width: 150, height: 150, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' },
  decorCircle2: { position: 'absolute', bottom: 20, right: -20, width: 180, height: 180, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' },
  decorCircle3: { position: 'absolute', top: 15, left: 40, width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' },
  heroAvatar: { width: 110, height: 110, border: '4px solid #ffffff', boxShadow: '0 6px 24px rgba(28,24,20,0.22)', zIndex: 1 },
  heroInfo: { textAlign: 'center', mt: 2, mb: 0, px: 2 },
  nameHeading: { lineHeight: 1.2, mb: 0.3 },
  username: { mb: 0.75 },
  bio: { maxWidth: 420, mx: 'auto', mb: 0.75 },
  statsBox: { display: 'flex', width: 'fit-content', border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden', mb: 3, mx: 'auto' },
  statCell: { px: { xs: 2.5, sm: 3.5 }, py: 1.5, textAlign: 'center' },
  statValue: { lineHeight: 1.2, fontSize: { xs: 18, sm: 20 } },
  statLabel: { textTransform: 'uppercase', letterSpacing: 0.6 },
  tabsRow: { display: 'flex', gap: 1, mb: 3, borderBottom: '2px solid', borderColor: 'divider' },
  recipeCount: { ml: 1, fontSize: 14, color: 'text.disabled', fontFamily: 'inherit' },
  loadingBox: { display: 'flex', justifyContent: 'center', py: 10 },
  emptyBox: { textAlign: 'center', py: 8, border: '2px dashed', borderColor: 'divider', borderRadius: 3 },
  emptyText: { mb: 2 },
  recipeGrid: { px: { xs: 2, sm: 0 } },
  sentinel: { display: 'flex', justifyContent: 'center', py: 4 },
  dialogTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 },
  dialogActions: { px: 3, pb: 2, gap: 1 },
} satisfies Record<string, SxProps<Theme>>;

function TabButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        px: 2.5,
        py: 1.2,
        mb: '-2px',
        cursor: 'pointer',
        borderBottom: '2px solid',
        borderColor: active ? 'primary.main' : 'transparent',
        color: active ? 'primary.main' : 'text.secondary',
        fontWeight: active ? 700 : 400,
        fontSize: 14,
        fontFamily: active ? "'Fredoka One', cursive" : 'inherit',
        letterSpacing: active ? 0.5 : 0,
        transition: 'all 0.15s',
        '&:hover': { color: 'primary.main' },
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [tab, setTab] = useState<'mine' | 'favorites'>('mine');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiResultOpen, setAiResultOpen] = useState(false);
  const [aiError, setAiError] = useState('');

  const activeList = tab === 'mine' ? recipes : favorites;
  const hasMore = visibleCount < activeList.length;

  useEffect(() => {
    if (!user) return;
    setPageLoading(true);
    Promise.all([fetchUserPosts(user._id), fetchLikedPosts(user._id)]).then(([posts, liked]) => {
      setRecipes(posts);
      setFavorites(liked);
      setPageLoading(false);
    });
  }, [user?._id]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [tab]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, activeList.length));
            setLoading(false);
          }, 600);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, activeList.length]);

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
        setAiResultOpen(true);
      } else {
        setAiAnswer(data.answer ?? 'No response received.');
        setAiResultOpen(true);
      }
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
      const newRecipe = await createPost(updated, user!._id, imageFile);
      setRecipes((prev) => [newRecipe, ...prev]);
    } else {
      await updatePost(id, updated, user!._id, imageFile);
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    }
  }

  async function handleSaveProfile(
    updates: Pick<import('../context/AuthContext').AuthUser, 'name' | 'username' | 'bio' | 'avatarUrl'>,
    avatarFile?: File,
  ) {
    if (!token) return;
    const updated = await updateProfileApi(user!._id, updates, token, avatarFile);
    updateUser(updated);
  }

  async function handleDeleteRecipe() {
    if (!deletingRecipe) return;
    await deletePost(deletingRecipe.id);
    setRecipes((prev) => prev.filter((r) => r.id !== deletingRecipe.id));
    setDeletingRecipe(null);
  }

  const visibleRecipes = activeList.slice(0, visibleCount);

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      {/* Hero header: orange → white gradient with centered avatar */}
      <Box sx={styles.heroSection}>
        <Box sx={styles.decorCircle1} />
        <Box sx={styles.decorCircle2} />
        <Box sx={styles.decorCircle3} />

        {/* Edit Profile button — top right corner */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => setEditOpen(true)}
          sx={{
            position: 'absolute', top: 14, right: 16,
            color: 'white', borderColor: 'rgba(255,255,255,0.65)',
            '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.15)' },
          }}
        >
          Edit Profile
        </Button>

        {/* Centered avatar */}
        <Avatar src={user.avatarUrl} alt={user.name} sx={styles.heroAvatar} />

        {/* Name, username, bio — inside the gradient so it fades down to here */}
        <Box sx={styles.heroInfo}>
          <Typography variant="h5" sx={{ ...styles.nameHeading, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight={600} sx={styles.username}>
            @{user.username}
          </Typography>
          {user.bio && (
            <Typography variant="body2" color="text.secondary" sx={styles.bio}>{user.bio}</Typography>
          )}
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={styles.statsBox}>
        {[
          { value: recipes.length, label: 'Recipes' },
          { value: favorites.length, label: 'Favorites' },
        ].map((stat, i) => (
          <Box key={stat.label} sx={{ display: 'flex' }}>
            {i > 0 && <Box sx={{ width: '1px', bgcolor: 'divider' }} />}
            <Box sx={styles.statCell}>
              <Typography variant="h6" sx={styles.statValue}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={styles.statLabel}>{stat.label}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Box sx={styles.tabsRow}>
        <TabButton
          active={tab === 'mine'}
          icon={<MenuBookRoundedIcon sx={{ fontSize: 17 }} />}
          label="My Recipes"
          onClick={() => setTab('mine')}
        />
        <TabButton
          active={tab === 'favorites'}
          icon={<FavoriteRoundedIcon sx={{ fontSize: 17 }} />}
          label="Favorites"
          onClick={() => setTab('favorites')}
        />
        {tab === 'mine' && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pb: 1 }}>
            <Button variant="contained" size="small" startIcon={<AddRoundedIcon />} onClick={() => setEditingRecipe(BLANK_RECIPE)} sx={{ px: 2 }}>
              New Recipe
            </Button>
          </Box>
        )}
        {tab === 'favorites' && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pb: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={aiLoading ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeRoundedIcon />}
              onClick={() => setMealDialogOpen(true)}
              disabled={aiLoading || favorites.length === 0}
              sx={{ px: 2, borderRadius: 50, fontFamily: "'Fredoka One', cursive", letterSpacing: 0.5, fontWeight: 400 }}
            >
              {aiLoading ? 'Generating...' : 'Inspire Me!'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Content */}
      {pageLoading ? (
        <Box sx={styles.loadingBox}><CircularProgress sx={{ color: 'primary.main' }} /></Box>
      ) : visibleRecipes.length === 0 ? (
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
          {visibleRecipes.map((recipe, i) => (
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

      {/* Sentinel */}
      <Box ref={sentinelRef} sx={styles.sentinel}>
        {loading && <CircularProgress size={26} sx={{ color: 'primary.main' }} />}
        {!hasMore && !loading && !pageLoading && visibleRecipes.length > 0 && (
          <Typography variant="caption" color="text.disabled">All loaded ✓</Typography>
        )}
      </Box>

      {/* Recipe description dialog */}
      <Dialog open={viewingRecipe !== null} onClose={() => setViewingRecipe(null)} maxWidth="sm" fullWidth>
        {viewingRecipe && (
          <>
            {viewingRecipe.imageUrl && (
              <Box
                component="img"
                src={viewingRecipe.imageUrl}
                alt={viewingRecipe.title}
                sx={{ width: '100%', maxHeight: 260, objectFit: 'cover' }}
              />
            )}
            <DialogTitle sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: 22,
              pb: 0.5,
            }}>
              {viewingRecipe.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={viewingRecipe.category} size="small" color="primary" variant="outlined" sx={{ borderRadius: 50 }} />
                <Chip label={viewingRecipe.difficulty} size="small" color={viewingRecipe.difficulty === 'Easy' ? 'success' : viewingRecipe.difficulty === 'Medium' ? 'warning' : 'error'} variant="outlined" sx={{ borderRadius: 50 }} />
                <Chip label={`⏱ ${viewingRecipe.cookingTime} min`} size="small" variant="outlined" sx={{ borderRadius: 50 }} />
                <Chip label={`♥ ${viewingRecipe.likesCount}`} size="small" variant="outlined" sx={{ borderRadius: 50 }} />
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                {viewingRecipe.description}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setViewingRecipe(null)} variant="contained" sx={{ borderRadius: 50 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Meal type picker dialog */}
      <Dialog open={mealDialogOpen} onClose={() => { setMealDialogOpen(false); setSelectedMeal(''); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Fredoka One', cursive", color: 'primary.main', fontSize: 22 }}>
          What are you in the mood for?
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 1 }}>
            {RECIPE_CATEGORIES.map((meal) => (
              <Chip
                key={meal}
                label={meal}
                onClick={() => setSelectedMeal(meal)}
                variant={selectedMeal === meal ? 'filled' : 'outlined'}
                color={selectedMeal === meal ? 'primary' : 'default'}
                sx={{ fontWeight: selectedMeal === meal ? 700 : 400, borderRadius: 50 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => { setMealDialogOpen(false); setSelectedMeal(''); }} variant="outlined" color="inherit" sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedMeal}
            onClick={handleGenerateFromFavorites}
            startIcon={<AutoAwesomeRoundedIcon />}
            sx={{ borderRadius: 50 }}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI result dialog */}
      <Dialog open={aiResultOpen} onClose={() => { setAiResultOpen(false); setAiError(''); setAiAnswer(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Fredoka One', cursive", color: aiError ? 'error.main' : 'primary.main', fontSize: 22 }}>
          {aiError ? 'Oops!' : 'Your Personalized Recipe'}
        </DialogTitle>
        <DialogContent>
          {aiError ? (
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {aiError}
            </Typography>
          ) : (
          <Box sx={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7 }}>
            {aiAnswer.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <Box key={i} sx={{ height: 6 }} />;
              if (/^#{1,3} /.test(trimmed)) {
                return (
                  <Typography key={i} sx={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: 'primary.main', mt: 1.5, mb: 0.5 }}>
                    {trimmed.replace(/^#{1,3}\s+/, '')}
                  </Typography>
                );
              }
              if (/^\d+\./.test(trimmed)) {
                return (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 22, height: 22, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '2px', flexShrink: 0 }}>
                      {trimmed.match(/^(\d+)/)?.[1]}
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{trimmed.replace(/^\d+\.\s*/, '')}</Typography>
                  </Box>
                );
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                    <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>•</Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{trimmed.slice(2)}</Typography>
                  </Box>
                );
              }
              return <Typography key={i} variant="body2" sx={{ lineHeight: 1.7, mb: 0.25 }}>{trimmed}</Typography>;
            })}
          </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAiResultOpen(false)} variant="contained" sx={{ borderRadius: 50 }}>Done</Button>
        </DialogActions>
      </Dialog>

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
