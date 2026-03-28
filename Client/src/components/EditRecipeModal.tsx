import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import type { Recipe } from '../types';

interface Props {
  open: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onSave: (
    id: string,
    updated: Pick<Recipe, 'title' | 'description' | 'imageUrl' | 'category' | 'cookingTime' | 'difficulty'>,
  ) => void;
}

const DIFFICULTIES: Recipe['difficulty'][] = ['Easy', 'Medium', 'Hard'];

export default function EditRecipeModal({ open, recipe, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [cookingTime, setCookingTime] = useState(30);
  const [difficulty, setDifficulty] = useState<Recipe['difficulty']>('Easy');

  useEffect(() => {
    if (open && recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description);
      setImageUrl(recipe.imageUrl);
      setCategory(recipe.category);
      setCookingTime(recipe.cookingTime);
      setDifficulty(recipe.difficulty);
    }
  }, [open, recipe]);

  if (!recipe) return null;

  function handleSave() {
    onSave(recipe!.id, {
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      category: category.trim(),
      cookingTime,
      difficulty,
    });
    onClose();
  }

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {recipe.id === '' ? 'New Recipe' : 'Edit Recipe'}
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Image preview */}
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt="preview"
              sx={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 2 }}
            />
          )}
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            size="small"
            fullWidth
            placeholder="https://…"
          />
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            fullWidth
            required
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            fullWidth
            required
            multiline
            rows={4}
            inputProps={{ maxLength: 500 }}
            helperText={`${description.length}/500`}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ htmlInput: { maxLength: 40 } }}
            />
            <TextField
              select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Recipe['difficulty'])}
              size="small"
              sx={{ minWidth: 130 }}
            >
              {DIFFICULTIES.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            label="Cooking time (minutes)"
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(Math.max(1, Number(e.target.value)))}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isValid}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          {recipe.id === '' ? 'Create' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
