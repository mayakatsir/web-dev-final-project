import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { createComment, fetchComments } from '../api/commentsApi';
import CommentItem from '../components/CommentItem';
import CommentInput from '../components/CommentInput';

const styles = {
  container: { py: 3, display: 'flex', flexDirection: 'column', minHeight: 'calc(100svh - 60px)' },
  backButton: { alignSelf: 'flex-start', mb: 2, color: 'text.secondary', px: 1 },
  heading: { mb: 2.5, fontSize: 18 },
  loadingBox: { display: 'flex', justifyContent: 'center', py: 8, flex: 1 },
  commentList: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 },
  emptyBox: { textAlign: 'center', py: 6 },
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
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)} sx={styles.backButton}>
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
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUserId={user?._id}
              currentUserAvatarUrl={user?.avatarUrl}
            />
          ))}
        </Box>
      )}

      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        {hasMore && loading && <CircularProgress size={22} sx={{ color: 'primary.main' }} />}
      </Box>

      <CommentInput
        value={commentText}
        onChange={setCommentText}
        onSubmit={handleSubmit}
        submitting={submitting}
        userAvatarUrl={user?.avatarUrl}
        userName={user?.name ?? user?.username}
      />
    </Container>
  );
}
