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
import AddIcon from '@mui/icons-material/Add';
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
  postedAt: '',
};

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

  // TODO: reserch more pagination options
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          // Simulate network delay
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
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Profile Header */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 3, sm: 5 },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          textAlign: { xs: 'center', sm: 'left' },
          pb: 4,
          borderBottom: 1,
          borderColor: 'divider',
          mb: 4,
        }}
      >
        <Avatar
          src={user.avatarUrl}
          alt={user.name}
          sx={{
            width: 120,
            height: 120,
            border: '3px solid',
            borderColor: 'primary.main',
            flexShrink: 0,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight={500} gutterBottom>
            @{user.username}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 480, mt: 0.5, mb: 0.5 }}
          >
            {user.bio}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Joined {user.joinedDate}
          </Typography>

          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              mt: 2,
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            {[
              { value: recipes.length, label: 'Recipes' },
              { value: user.followersCount.toLocaleString(), label: 'Followers' },
              { value: user.followingCount, label: 'Following' },
            ].map((stat, i, arr) => (
              <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                  >
                    {stat.label}
                  </Typography>
                </Box>
                {i < arr.length - 1 && <Divider orientation="vertical" flexItem />}
              </Box>
            ))}
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setEditOpen(true)}
            sx={{ mt: 2, textTransform: 'none', borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* Recipes Grid */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
      >
        <Typography variant="h6" fontWeight={600}>
          My Recipes
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setEditingRecipe(BLANK_RECIPE)}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          New Recipe
        </Button>
      </Box>

      {pageLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : recipes.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ py: 4, textAlign: 'center' }}>
          No recipes yet. Create your first one!
        </Typography>
      ) : (
        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
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
      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {loading && <CircularProgress size={28} />}
        {!hasMore && !loading && !pageLoading && recipes.length > 0 && (
          <Typography variant="caption" color="text.disabled">
            All recipes loaded
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
        <DialogTitle>Delete recipe?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{deletingRecipe?.title}</strong> will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeletingRecipe(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRecipe}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
