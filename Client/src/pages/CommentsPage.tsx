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
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
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
    <Container
      maxWidth="sm"
      sx={{ py: 3, display: 'flex', flexDirection: 'column', minHeight: 'calc(100svh - 60px)' }}
    >
      {/* Back */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(-1)}
        sx={{ alignSelf: 'flex-start', mb: 2, color: 'text.secondary', px: 1 }}
      >
        Back
      </Button>

      {/* Header */}
      <Typography
        variant="h6"
        sx={{ mb: 2.5, fontSize: 18 }}
      >
        {loading ? 'Comments' : `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}
      </Typography>

      {/* Comment list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, flex: 1 }}>
          <CircularProgress size={28} sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {comments.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ fontSize: 32, mb: 1 }}>💬</Typography>
              <Typography variant="body2" color="text.disabled">
                No comments yet. Start the conversation!
              </Typography>
            </Box>
          )}

          {comments.map((c) => {
            const isMe = c.authorId === currentUser.id;
            return (
              <Box key={c.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Avatar
                  src={
                    isMe
                      ? currentUser.avatarUrl
                      : `https://i.pravatar.cc/150?u=${c.authorId}`
                  }
                  sx={{ width: 34, height: 34, mt: 0.25, flexShrink: 0 }}
                />
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: isMe ? 'rgba(232,99,26,0.07)' : 'grey.100',
                    borderRadius: 2.5,
                    borderTopLeftRadius: 4,
                    px: 1.75,
                    py: 1.1,
                    borderLeft: isMe ? '3px solid' : 'none',
                    borderColor: 'primary.light',
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    display="block"
                    color={isMe ? 'primary.dark' : 'text.primary'}
                    sx={{ mb: 0.25 }}
                  >
                    {isMe ? currentUser.name : c.authorId}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    {c.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Sticky comment input */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          pt: 1.5,
          pb: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 1.25,
          alignItems: 'center',
        }}
      >
        <Avatar
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          sx={{ width: 34, height: 34, flexShrink: 0 }}
        />
        <OutlinedInput
          fullWidth
          size="small"
          placeholder="Write a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          sx={{
            borderRadius: 50,
            fontSize: 13.5,
            bgcolor: 'grey.50',
            '& fieldset': { borderColor: 'divider' },
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleSubmit}
                disabled={!commentText.trim() || submitting}
                edge="end"
                sx={{
                  color: commentText.trim() ? 'primary.main' : 'text.disabled',
                  transition: 'color 0.15s',
                }}
              >
                {submitting ? (
                  <CircularProgress size={16} sx={{ color: 'primary.main' }} />
                ) : (
                  <SendRoundedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Container>
  );
}
