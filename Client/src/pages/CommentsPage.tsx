import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import type { Comment } from '../types';
import { currentUser, feedRecipes, otherUsers, seedComments } from '../data/mockData';

const userMap = Object.fromEntries(otherUsers.map((u) => [u.id, u]));

export default function CommentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const recipe = feedRecipes.find((r) => r.id === id);

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

  if (!recipe) {
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
