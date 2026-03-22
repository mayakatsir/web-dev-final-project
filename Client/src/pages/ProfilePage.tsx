import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { currentUser, userRecipes } from '../data/mockData';
import RecipeCard from '../components/RecipeCard';

const PAGE_SIZE = 3;

export default function ProfilePage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < userRecipes.length;

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
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, userRecipes.length));
            setLoading(false);
          }, 600);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const visibleRecipes = userRecipes.slice(0, visibleCount);

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
          src={currentUser.avatarUrl}
          alt={currentUser.name}
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
            {currentUser.name}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight={500} gutterBottom>
            @{currentUser.username}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 480, mt: 0.5, mb: 0.5 }}
          >
            {currentUser.bio}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Joined {currentUser.joinedDate}
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
              { value: currentUser.recipesCount, label: 'Recipes' },
              { value: currentUser.followersCount.toLocaleString(), label: 'Followers' },
              { value: currentUser.followingCount, label: 'Following' },
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
            sx={{ mt: 2, textTransform: 'none', borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* Recipes Grid */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        My Recipes
      </Typography>
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {visibleRecipes.map((recipe, i) => (
          <Grid key={`${recipe.id}-${i}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>

      {/* Sentinel + loader */}
      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {loading && <CircularProgress size={28} />}
        {!hasMore && !loading && (
          <Typography variant="caption" color="text.disabled">
            All recipes loaded
          </Typography>
        )}
      </Box>
    </Container>
  );
}
