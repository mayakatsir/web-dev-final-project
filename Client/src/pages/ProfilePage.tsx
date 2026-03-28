import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Recipe, User } from '../types';
import { currentUser } from '../data/mockData';
import { createPost, deletePost, fetchUserPosts, updatePost } from '../api/postsApi';
import EditProfileModal from '../components/EditProfileModal';
import EditRecipeModal from '../components/EditRecipeModal';
import RecipeCard from '../components/RecipeCard';

const PAGE_SIZE = 9;

const BLANK_RECIPE: Recipe = {
  id: '',
  authorId: currentUser.id,
  title: '',
  description: '',
  category: 'General',
  cookingTime: 30,
  difficulty: 'Easy',
  imageUrl: '',
  likesCount: 0,
  likedBy: [],
  commentsCount: 0,
  postedAt: '',
};

const styles = {
  banner: {
    height: { xs: 130, sm: 180 },
    background: 'linear-gradient(135deg, #E8631A 0%, #F5A53B 55%, #E84040 100%)',
    borderRadius: { xs: 0, sm: 3 },
    mx: { xs: -3, sm: 0 },
    mt: { xs: 0, sm: 3 },
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -30,
    right: 60,
    width: 150,
    height: 150,
    bgcolor: 'rgba(255,255,255,0.08)',
    borderRadius: '50%',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -50,
    right: -20,
    width: 180,
    height: 180,
    bgcolor: 'rgba(255,255,255,0.06)',
    borderRadius: '50%',
  },
  decorCircle3: {
    position: 'absolute',
    top: 20,
    left: 40,
    width: 80,
    height: 80,
    bgcolor: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
  },
  avatarRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    mt: '-48px',
    mb: 2,
    px: { xs: 2, sm: 0 },
  },
  avatar: {
    width: 96,
    height: 96,
    border: '4px solid',
    borderColor: 'background.paper',
    boxShadow: '0 4px 14px rgba(28,24,20,0.14)',
  },
  profileInfo: { px: { xs: 2, sm: 0 }, mb: 3 },
  nameHeading: { lineHeight: 1.2, mb: 0.3 },
  username: { mb: 0.75 },
  bio: { maxWidth: 440, mb: 0.75 },
  statsBox: {
    display: 'flex',
    width: 'fit-content',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 3,
    overflow: 'hidden',
    mb: 4,
    mx: { xs: 2, sm: 0 },
  },
  statCell: { px: { xs: 2.5, sm: 3.5 }, py: 1.5, textAlign: 'center' },
  statValue: { lineHeight: 1.2, fontSize: { xs: 18, sm: 20 } },
  statLabel: { textTransform: 'uppercase', letterSpacing: 0.6 },
  recipesHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
    px: { xs: 2, sm: 0 },
  },
  recipeCount: { ml: 1, fontSize: 14, color: 'text.disabled', fontFamily: 'inherit' },
  loadingBox: { display: 'flex', justifyContent: 'center', py: 10 },
  emptyBox: {
    textAlign: 'center',
    py: 8,
    border: '2px dashed',
    borderColor: 'divider',
    borderRadius: 3,
  },
  emptyText: { mb: 2 },
  recipeGrid: { px: { xs: 2, sm: 0 } },
  sentinel: { display: 'flex', justifyContent: 'center', py: 4 },
  dialogTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
  },
  dialogActions: { px: 3, pb: 2, gap: 1 },
} satisfies Record<string, SxProps<Theme>>;

export default function ProfilePage() {
  const [user, setUser] = useState<User>(currentUser);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < recipes.length;

  useEffect(() => {
    fetchUserPosts(currentUser.id).then((posts) => {
      setRecipes(posts);
      setPageLoading(false);
    });
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

  async function handleSaveRecipe(
    id: string,
    updated: Pick<Recipe, 'title' | 'description' | 'imageUrl' | 'category' | 'cookingTime' | 'difficulty'>,
  ) {
    if (id === '') {
      const newRecipe = await createPost(updated, currentUser.id);
      setRecipes((prev) => [newRecipe, ...prev]);
    } else {
      await updatePost(id, updated, currentUser.id);
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    }
  }

  async function handleDeleteRecipe() {
    if (!deletingRecipe) return;
    await deletePost(deletingRecipe.id);
    setRecipes((prev) => prev.filter((r) => r.id !== deletingRecipe.id));
    setDeletingRecipe(null);
  }

  const visibleRecipes = recipes.slice(0, visibleCount);

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      {/* Banner */}
      <Box sx={styles.banner}>
        {/* Decorative circles */}
        <Box sx={styles.decorCircle1} />
        <Box sx={styles.decorCircle2} />
        <Box sx={styles.decorCircle3} />
      </Box>

      {/* Avatar + Edit button row */}
      <Box sx={styles.avatarRow}>
        <Avatar
          src={user.avatarUrl}
          alt={user.name}
          sx={styles.avatar}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => setEditOpen(true)}
          sx={{ mb: 0.5, px: 2 }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Name, username, bio */}
      <Box sx={styles.profileInfo}>
        <Typography variant="h5" sx={styles.nameHeading}>
          {user.name}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight={600} sx={styles.username}>
          @{user.username}
        </Typography>
        {user.bio && (
          <Typography variant="body2" color="text.secondary" sx={styles.bio}>
            {user.bio}
          </Typography>
        )}
        <Typography variant="caption" color="text.disabled">
          Joined {user.joinedDate}
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={styles.statsBox}>
        {[
          { value: recipes.length, label: 'Recipes' },
          { value: user.followersCount.toLocaleString(), label: 'Followers' },
          { value: user.followingCount, label: 'Following' },
        ].map((stat, i) => (
          <Box key={stat.label}>
            <Box sx={styles.statCell}>
              <Typography variant="h6" sx={styles.statValue}>
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={styles.statLabel}
              >
                {stat.label}
              </Typography>
            </Box>
            {i < 2 && (
              <Divider orientation="vertical" flexItem sx={{ position: 'absolute' }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Recipes section */}
      <Box sx={styles.recipesHeader}>
        <Typography variant="h6" sx={{ fontSize: 18 }}>
          My Recipes
          {recipes.length > 0 && (
            <Box component="span" sx={styles.recipeCount}>
              ({recipes.length})
            </Box>
          )}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() => setEditingRecipe(BLANK_RECIPE)}
          sx={{ px: 2 }}
        >
          New Recipe
        </Button>
      </Box>

      {pageLoading ? (
        <Box sx={styles.loadingBox}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : recipes.length === 0 ? (
        <Box sx={styles.emptyBox}>
          <Typography sx={{ fontSize: 36, mb: 1 }}>👨‍🍳</Typography>
          <Typography variant="body2" color="text.disabled" sx={styles.emptyText}>
            No recipes yet. Share your first dish!
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => setEditingRecipe(BLANK_RECIPE)}
          >
            Add Recipe
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2} sx={styles.recipeGrid}>
          {visibleRecipes.map((recipe, i) => (
            <Grid key={`${recipe.id}-${i}`} size={{ xs: 12, sm: 6, md: 4 }}>
              <RecipeCard
                recipe={recipe}
                onEdit={() => setEditingRecipe(recipe)}
                onDelete={() => setDeletingRecipe(recipe)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Sentinel + loader */}
      <Box ref={sentinelRef} sx={styles.sentinel}>
        {loading && <CircularProgress size={26} sx={{ color: 'primary.main' }} />}
        {!hasMore && !loading && !pageLoading && recipes.length > 0 && (
          <Typography variant="caption" color="text.disabled">
            All recipes loaded ✓
          </Typography>
        )}
      </Box>

      <EditProfileModal
        open={editOpen}
        user={user}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
      />

      <EditRecipeModal
        open={editingRecipe !== null}
        recipe={editingRecipe}
        onClose={() => setEditingRecipe(null)}
        onSave={handleSaveRecipe}
      />

      <Dialog open={deletingRecipe !== null} onClose={() => setDeletingRecipe(null)}>
        <DialogTitle sx={styles.dialogTitle}>
          Delete recipe?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{deletingRecipe?.title}</strong> will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button
            onClick={() => setDeletingRecipe(null)}
            variant="outlined"
            color="inherit"
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteRecipe}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
