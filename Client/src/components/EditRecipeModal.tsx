import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import type { Recipe } from '../types';

interface Props {
  open: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onSave: (id: string, updated: Pick<Recipe, 'title' | 'description' | 'imageUrl'>) => void;
}

export default function EditRecipeModal({ open, recipe, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (open && recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description);
      setImageUrl(recipe.imageUrl);
    }
  }, [open, recipe]);

  if (!recipe) return null;

  function handleSave() {
    onSave(recipe!.id, { title: title.trim(), description: description.trim(), imageUrl });
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
