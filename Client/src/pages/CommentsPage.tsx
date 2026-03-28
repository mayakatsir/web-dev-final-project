import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import type { Comment } from '../types';
import { currentUser } from '../data/mockData';
import { createComment, fetchComments } from '../api/commentsApi';

export default function CommentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchComments(id)
      .then(setComments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit() {
    const trimmed = commentText.trim();
    if (!trimmed || !id) return;

    setSubmitting(true);
    try {
      const newComment = await createComment(id, currentUser.id, trimmed);
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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
        {loading ? '…' : `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}
      </Typography>

      {/* Comment list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {comments.length === 0 && (
            <Typography variant="body2" color="text.disabled">
              No comments yet. Be the first!
            </Typography>
          )}
          {comments.map((c) => (
            <Box key={c.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar
                src={`https://i.pravatar.cc/150?u=${c.authorId}`}
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
                  {c.authorId}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  {c.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

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
                disabled={!commentText.trim() || submitting}
                edge="end"
              >
                {submitting ? <CircularProgress size={14} /> : <SendIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Container>
  );
}
