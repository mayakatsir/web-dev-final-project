import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { RECIPE_CATEGORIES } from '../data/categories';

interface Props {
  open: boolean;
  selectedMeal: string;
  onSelectMeal: (meal: string) => void;
  onClose: () => void;
  onGenerate: () => void;
}

export default function MealPickerDialog({ open, selectedMeal, onSelectMeal, onClose, onGenerate }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Fredoka One', cursive", color: 'primary.main', fontSize: 22 }}>
        What are you in the mood for?
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 1 }}>
          {RECIPE_CATEGORIES.map((meal) => (
            <Chip
              key={meal}
              label={meal}
              onClick={() => onSelectMeal(meal)}
              variant={selectedMeal === meal ? 'filled' : 'outlined'}
              color={selectedMeal === meal ? 'primary' : 'default'}
              sx={{ fontWeight: selectedMeal === meal ? 700 : 400, borderRadius: 50 }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!selectedMeal}
          onClick={onGenerate}
          startIcon={<AutoAwesomeRoundedIcon />}
          sx={{ borderRadius: 50 }}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
