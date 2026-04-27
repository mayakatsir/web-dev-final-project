import { useEffect, useRef, useState } from 'react';
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
import type { SxProps, Theme } from '@mui/material/styles';
import type { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { createComment, fetchComments } from '../api/commentsApi';

const styles = {
  container: { py: 3, display: 'flex', flexDirection: 'column', minHeight: 'calc(100svh - 60px)' },
  backButton: { alignSelf: 'flex-start', mb: 2, color: 'text.secondary', px: 1 },
  heading: { mb: 2.5, fontSize: 18 },
  loadingBox: { display: 'flex', justifyContent: 'center', py: 8, flex: 1 },
  commentList: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 },
  emptyBox: { textAlign: 'center', py: 6 },
  commentRow: { display: 'flex', gap: 1.5, alignItems: 'flex-start' },
  stickyInput: {
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
  },
  outlinedInput: {
    borderRadius: 50,
    fontSize: 13.5,
    bgcolor: 'grey.50',
    '& fieldset': { borderColor: 'divider' },
  },
} satisfies Record<string, SxProps<Theme>>;

export default function CommentsPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    if (page === 1) setLoading(true);
    fetchComments(id, page)
      .then(({ comments: newComments, hasMore: more }) => {
        if (cancelled) return;
        setComments((prev) => page === 1 ? newComments : [...prev, ...newComments]);
        setHasMore(more);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !submitting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, submitting]);

  async function handleSubmit() {
    const trimmed = commentText.trim();
    if (!trimmed || !id) return;

    setSubmitting(true);
    try {
      const newComment = await createComment(id, user?._id ?? '', trimmed);
      newComment.authorName = user?.name || user?.username || newComment.authorId;
      newComment.authorAvatar = user?.avatarUrl ?? '';
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={styles.container}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(-1)}
        sx={styles.backButton}
      >
        Back
      </Button>

      <Typography variant="h6" sx={styles.heading}>
        {loading ? 'Comments' : `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}
      </Typography>

      {loading ? (
        <Box sx={styles.loadingBox}>
          <CircularProgress size={28} sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        <Box sx={styles.commentList}>
          {comments.length === 0 && (
            <Box sx={styles.emptyBox}>
              <Typography sx={{ fontSize: 32, mb: 1 }}>💬</Typography>
              <Typography variant="body2" color="text.disabled">
                No comments yet. Start the conversation!
              </Typography>
            </Box>
          )}

          {comments.map((c) => {
            const isMe = c.authorId === user?._id;
            return (
              <Box key={c.id} sx={styles.commentRow}>
                <Avatar
                  src={isMe ? user?.avatarUrl : c.authorAvatar}
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
                    {c.authorName}
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

      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        {hasMore && loading && <CircularProgress size={22} sx={{ color: 'primary.main' }} />}
      </Box>

      <Box sx={styles.stickyInput}>
        <Avatar
          src={user?.avatarUrl}
          alt={user?.name ?? user?.username}
          sx={{ width: 34, height: 34, flexShrink: 0 }}
        />
        <OutlinedInput
          fullWidth
          size="small"
          placeholder="Write a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          sx={styles.outlinedInput}
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
