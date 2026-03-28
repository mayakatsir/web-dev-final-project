import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import type { Recipe, User } from '../types';

interface Props {
  recipe: Recipe;
  author: User;
  commentCount: number;
  liked: boolean;
  onLike: () => void;
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

export default function RecipeFeedCard({ recipe, author, commentCount, liked, onLike }: Props) {
  const navigate = useNavigate();

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
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
