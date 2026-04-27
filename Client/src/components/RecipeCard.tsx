import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Recipe } from '../types';
import { formatCookingTime } from '../utils/formatTimeUtils';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop';

interface Props {
  recipe: Recipe;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const difficultyColor: Record<Recipe['difficulty'], 'success' | 'warning' | 'error'> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

const styles = {
  card: {
    cursor: 'pointer',
    transition: 'transform 0.22s, box-shadow 0.22s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 32px rgba(28,24,20,0.13)',
    },
    '&:hover .edit-overlay': { opacity: 1 },
    overflow: 'hidden',
  },
  imageWrapper: { position: 'relative' },
  cardImage: { aspectRatio: '4/3', objectFit: 'cover', display: 'block' },
  gradientOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(to top, rgba(20,10,4,0.82) 0%, rgba(20,10,4,0.15) 50%, transparent 100%)',
    p: 1.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  overlayTitle: {
    color: '#fff',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1.3,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    mb: 0.5,
  },
  overlayMeta: { display: 'flex', gap: 0.75, alignItems: 'center', flexWrap: 'wrap' },
  overlayTimeRow: { display: 'flex', alignItems: 'center', gap: 0.3 },
  editOverlay: {
    position: 'absolute',
    inset: 0,
    bgcolor: 'rgba(0,0,0,0.42)',
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  editButton: {
    bgcolor: 'white',
    color: 'text.primary',
    '&:hover': { bgcolor: 'primary.main', color: 'white' },
  },
  deleteButton: {
    bgcolor: 'white',
    color: 'error.main',
    '&:hover': { bgcolor: 'error.main', color: 'white' },
  },
  footer: {
    px: 1.5,
    py: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    bgcolor: 'background.paper',
  },
  footerLikes: { display: 'flex', alignItems: 'center', gap: 0.4 },
} satisfies Record<string, SxProps<Theme>>;

export default function RecipeCard({ recipe, onEdit, onDelete, onClick }: Props) {
  return (
    <Card sx={styles.card} onClick={onClick}>
      <Box sx={styles.imageWrapper}>
        <CardMedia
          component="img"
          image={recipe.imageUrl || FALLBACK_IMAGE}
          alt={recipe.title}
          sx={styles.cardImage}
        />

        <Box sx={styles.gradientOverlay}>
          <Typography sx={styles.overlayTitle}>
            {recipe.title}
          </Typography>
          <Box sx={styles.overlayMeta}>
            <Box sx={styles.overlayTimeRow}>
              <AccessTimeRoundedIcon sx={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>
                {formatCookingTime(recipe.cookingTime)}
              </Typography>
            </Box>
            <Chip
              label={recipe.difficulty}
              size="small"
              color={difficultyColor[recipe.difficulty]}
              sx={{ height: 18, fontSize: 10 }}
            />
          </Box>
        </Box>

        {(onEdit || onDelete) && (
          <Box
            className="edit-overlay"
            sx={styles.editOverlay}
          >
            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                sx={styles.editButton}
              >
                <EditRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                sx={styles.deleteButton}
              >
                <DeleteRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      <Box sx={styles.footer}>
        <Chip label={recipe.category || 'General'} size="small" variant="outlined" />
        <Box sx={styles.footerLikes}>
          <FavoriteRoundedIcon sx={{ fontSize: 12, color: 'error.light' }} />
          <Typography variant="caption" color="text.secondary">
            {recipe.likesCount.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
