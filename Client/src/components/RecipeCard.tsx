import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Recipe } from '../types';
import { formatCookingTime, formatDate } from '../utils/formatTimeUtils';

interface Props {
  recipe: Recipe;
}

const difficultyColor: Record<Recipe['difficulty'], 'success' | 'warning' | 'error'> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

export default function RecipeCard({ recipe }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 },
        cursor: 'pointer',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={recipe.imageUrl}
          alt={recipe.title}
          sx={{ aspectRatio: '4/3', objectFit: 'cover' }}
        />
        <Chip
          label={recipe.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      </Box>

      <CardContent sx={{ pb: '16px !important' }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {recipe.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {recipe.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FavoriteIcon sx={{ fontSize: 13, color: 'error.main' }} />
            <Typography variant="caption" color="text.secondary">
              {recipe.likesCount.toLocaleString()}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>
            {formatDate(recipe.postedAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
