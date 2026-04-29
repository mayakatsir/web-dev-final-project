import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import type { Recipe } from '../types';

interface Props {
  recipe: Recipe | null;
  onClose: () => void;
}

export default function RecipeViewDialog({ recipe, onClose }: Props) {
  return (
    <Dialog open={recipe !== null} onClose={onClose} maxWidth="sm" fullWidth>
      {recipe && (
        <>
          {recipe.imageUrl && (
            <Box
              component="img"
              src={recipe.imageUrl}
              alt={recipe.title}
              sx={{ width: '100%', maxHeight: 260, objectFit: 'cover' }}
            />
          )}
          <DialogTitle
            sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 22, pb: 0.5 }}
          >
            {recipe.title}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={recipe.category} size="small" color="primary" variant="outlined" sx={{ borderRadius: 50 }} />
              <Chip
                label={recipe.difficulty}
                size="small"
                color={recipe.difficulty === 'Easy' ? 'success' : recipe.difficulty === 'Medium' ? 'warning' : 'error'}
                variant="outlined"
                sx={{ borderRadius: 50 }}
              />
              <Chip label={`⏱ ${recipe.cookingTime} min`} size="small" variant="outlined" sx={{ borderRadius: 50 }} />
              <Chip label={`♥ ${recipe.likesCount}`} size="small" variant="outlined" sx={{ borderRadius: 50 }} />
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              {recipe.description}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant="contained" sx={{ borderRadius: 50 }}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
