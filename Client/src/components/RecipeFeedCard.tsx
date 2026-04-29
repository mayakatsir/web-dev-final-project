import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Recipe, User } from '../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop';

interface Props {
  recipe: Recipe;
  author?: User;
  commentCount?: number;
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
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const styles = {
  authorRow: { display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 },
  authorBox: { flex: 1, minWidth: 0 },
  cardImage: { aspectRatio: '4/3', objectFit: 'cover' },
  actionsRow: { px: 1, pt: 0.75, pb: 0, display: 'flex', gap: 0.25 },
  commentButton: {
    color: 'text.secondary',
    fontWeight: 500,
    fontSize: 13,
    px: 1,
    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
  },
  contentBox: { px: 2, pt: 1, pb: 2 },
  title: {
    fontSize: 17,
    lineHeight: 1.35,
    mb: 0.5,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },
  description: {
    mb: 1.5,
    lineHeight: 1.55,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  metaRow: { display: 'flex', gap: 1.5, alignItems: 'center' },
  timeRow: { display: 'flex', alignItems: 'center', gap: 0.4 },
} satisfies Record<string, SxProps<Theme>>;

export default function RecipeFeedCard({ recipe, author, commentCount, liked, onLike }: Props) {
  const navigate = useNavigate();

  const displayName = author?.name ?? (recipe.authorName || recipe.authorUsername);
  const displayUsername = author?.username ?? recipe.authorUsername;
  const avatarSrc = author?.avatarUrl || recipe.authorAvatar || '';

  return (
    <Card>
      <Box sx={styles.authorRow}>
        <Avatar src={avatarSrc} alt={displayName} sx={{ width: 42, height: 42 }} />
        <Box sx={styles.authorBox}>
          <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2} noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            @{displayUsername} · {timeAgo(recipe.postedAt)}
          </Typography>
        </Box>
        {recipe.category && (
          <Chip
            label={recipe.category}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ flexShrink: 0 }}
          />
        )}
      </Box>

      <CardMedia
        component="img"
        image={recipe.imageUrl || FALLBACK_IMAGE}
        alt={recipe.title}
        sx={styles.cardImage}
      />

      <Box sx={styles.actionsRow}>
        <Button
          size="small"
          startIcon={
            liked ? (
              <FavoriteRoundedIcon sx={{ fontSize: '18px !important' }} />
            ) : (
              <FavoriteBorderRoundedIcon sx={{ fontSize: '18px !important' }} />
            )
          }
          onClick={onLike}
          sx={{
            color: liked ? 'error.main' : 'text.secondary',
            fontWeight: liked ? 700 : 500,
            fontSize: 13,
            px: 1,
            '&:hover': { color: 'error.main', bgcolor: 'transparent' },
          }}
        >
          {recipe.likesCount}
        </Button>
        <Button
          size="small"
          startIcon={
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: '17px !important' }} />
          }
          onClick={() => navigate(`/recipe/${recipe.id}`)}
          sx={styles.commentButton}
        >
          {commentCount ?? 0}
        </Button>
      </Box>

      <Box sx={styles.contentBox}>
        <Typography variant="h6" sx={styles.title}>
          {recipe.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={styles.description}
        >
          {recipe.description}
        </Typography>

        <Box sx={styles.metaRow}>
          <Box sx={styles.timeRow}>
            <AccessTimeRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {formatCookingTime(recipe.cookingTime)}
            </Typography>
          </Box>
          <Chip
            label={recipe.difficulty}
            size="small"
            color={difficultyColor[recipe.difficulty]}
            variant="outlined"
          />
        </Box>
      </Box>
    </Card>
  );
}
