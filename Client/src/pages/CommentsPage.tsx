import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import type { Comment } from '../types';
import { currentUser, feedRecipes, otherUsers, seedComments } from '../data/mockData';
import { formatCookingTime } from '../utils/formatTimeUtils';

const userMap = Object.fromEntries(otherUsers.map((u) => [u.id, u]));

const difficultyColor: Record<'Easy' | 'Medium' | 'Hard', 'success' | 'warning' | 'error'> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

export default function CommentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const recipe = feedRecipes.find((r) => r.id === id);
  const author = recipe ? userMap[recipe.authorId] : null;

  const [comments, setComments] = useState<Comment[]>(
    seedComments.filter((c) => c.recipeId === id),
  );
  const [commentText, setCommentText] = useState('');

  function handleSubmit() {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        recipeId: id!,
        authorId: currentUser.id,
        text: trimmed,
        postedAt: new Date().toISOString(),
      },
    ]);
    setCommentText('');
  }

  if (!recipe || !author) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">Recipe not found.</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2, textTransform: 'none' }}>
          Back to feed
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ textTransform: 'none', mb: 2, color: 'text.secondary' }}
      >
        Back
      </Button>

      {/* Author row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Avatar src={author.avatarUrl} alt={author.name} sx={{ width: 40, height: 40 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={600} lineHeight={1.2}>
            {author.name}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            @{author.username}
          </Typography>
        </Box>
        <Chip label={recipe.category} size="small" variant="outlined" sx={{ ml: 'auto', fontSize: 11 }} />
      </Box>

      {/* Image */}
      <CardMedia
        component="img"
        image={recipe.imageUrl}
        alt={recipe.title}
        sx={{ aspectRatio: '16/9', objectFit: 'cover', borderRadius: 2, mb: 2 }}
      />

      {/* Recipe info */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {recipe.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {recipe.description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {formatCookingTime(recipe.cookingTime)}
          </Typography>
        </Box>
        <Chip
          label={recipe.difficulty}
          size="small"
          color={difficultyColor[recipe.difficulty]}
          variant="outlined"
          sx={{ height: 20, fontSize: 11 }}
        />
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Comments header */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </Typography>

      {/* Comment list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {comments.length === 0 && (
          <Typography variant="body2" color="text.disabled">
            No comments yet. Be the first!
          </Typography>
        )}
        {comments.map((c) => {
          const commentAuthor =
            c.authorId === currentUser.id ? currentUser : userMap[c.authorId];
          return (
            <Box key={c.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar
                src={commentAuthor?.avatarUrl ?? `https://i.pravatar.cc/150?u=${c.authorId}`}
                sx={{ width: 32, height: 32, mt: 0.25 }}
              />
              <Box
                sx={{
                  flex: 1,
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography variant="caption" fontWeight={600} display="block">
                  {commentAuthor?.name ?? c.authorId}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  {c.text}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Add comment */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <Avatar src={currentUser.avatarUrl} alt={currentUser.name} sx={{ width: 32, height: 32 }} />
        <OutlinedInput
          fullWidth
          size="small"
          placeholder="Add a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          sx={{ borderRadius: 3, fontSize: 13 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleSubmit}
                disabled={!commentText.trim()}
                edge="end"
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Container>
  );
}
