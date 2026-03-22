import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import type { Comment, Recipe, User } from '../types';
import { currentUser } from '../data/mockData';

interface Props {
  recipe: Recipe;
  author: User;
  comments: Comment[];
  liked: boolean;
  onLike: () => void;
  onAddComment: (text: string) => void;
}

const difficultyColor: Record<Recipe['difficulty'], 'success' | 'warning' | 'error'> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

function formatCookingTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function RecipeFeedCard({
  recipe,
  author,
  comments,
  liked,
  onLike,
  onAddComment,
}: Props) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  function handleSubmitComment() {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setCommentText('');
  }

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
      {/* Author row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, pb: 1.5 }}>
        <Avatar src={author.avatarUrl} alt={author.name} sx={{ width: 40, height: 40 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} lineHeight={1.2}>
            {author.name}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            @{author.username} · {timeAgo(recipe.postedAt)}
          </Typography>
        </Box>
        <Chip
          label={recipe.category}
          size="small"
          variant="outlined"
          sx={{ fontSize: 11 }}
        />
      </Box>

      {/* Image */}
      <CardMedia
        component="img"
        image={recipe.imageUrl}
        alt={recipe.title}
        sx={{ aspectRatio: '16/9', objectFit: 'cover' }}
      />

      {/* Body */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: 17 }}>
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {recipe.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
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

        <Divider sx={{ mb: 1 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            size="small"
            startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={onLike}
            sx={{
              textTransform: 'none',
              color: liked ? 'error.main' : 'text.secondary',
              fontWeight: liked ? 600 : 400,
              '&:hover': { color: 'error.main', bgcolor: 'error.50' },
            }}
          >
            {recipe.likesCount + (liked ? 1 : 0)}
          </Button>
          <Button
            size="small"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={() => setShowComments((v) => !v)}
            sx={{
              textTransform: 'none',
              color: showComments ? 'primary.main' : 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </Button>
        </Box>
      </Box>

      {/* Comments */}
      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ px: 2, pt: 1.5, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {comments.length === 0 && (
            <Typography variant="caption" color="text.disabled">
              No comments yet. Be the first!
            </Typography>
          )}
          {comments.map((c) => (
            <Box key={c.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar
                src={`https://i.pravatar.cc/150?u=${c.authorId}`}
                sx={{ width: 28, height: 28, mt: 0.25 }}
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
                  {c.authorId === currentUser.id ? currentUser.name : `@${c.authorId}`}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  {c.text}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Add comment */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
            <Avatar
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              sx={{ width: 28, height: 28 }}
            />
            <OutlinedInput
              fullWidth
              size="small"
              placeholder="Add a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
              sx={{ borderRadius: 3, fontSize: 13 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    edge="end"
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}
