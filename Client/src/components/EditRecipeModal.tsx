import { useEffect, useRef, useState } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES } from '../data/categories';

interface Props {
  open: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onSave: (
    id: string,
    updated: Pick<Recipe, 'title' | 'description' | 'imageUrl' | 'category' | 'cookingTime' | 'difficulty'>,
    imageFile?: File,
  ) => void;
}

const DIFFICULTIES: Recipe['difficulty'][] = ['Easy', 'Medium', 'Hard'];

const styles = {
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: 20,
    pb: 1,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    mt: 0.5,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover',
    borderRadius: 3,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: 3,
    bgcolor: 'rgba(232,99,26,0.05)',
    border: '2px dashed',
    borderColor: 'rgba(232,99,26,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    color: 'text.disabled',
    cursor: 'pointer',
    '&:hover': { borderColor: 'rgba(232,99,26,0.5)', bgcolor: 'rgba(232,99,26,0.08)' },
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
  },
  changeOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'rgba(0,0,0,0.45)',
    opacity: 0,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
    '&:hover': { opacity: 1 },
  },
  categoryRow: {
    display: 'flex',
    gap: 2,
  },
  difficultySelect: {
    minWidth: 130,
  },
  dialogActions: {
    px: 3,
    py: 2,
    gap: 1,
  },
} satisfies Record<string, SxProps<Theme>>;

export default function EditRecipeModal({ open, recipe, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [previewSrc, setPreviewSrc] = useState('');
  const [category, setCategory] = useState('');
  const [cookingTime, setCookingTime] = useState(30);
  const [difficulty, setDifficulty] = useState<Recipe['difficulty']>('Easy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description);
      setImageUrl(recipe.imageUrl);
      setImageFile(undefined);
      setPreviewSrc(recipe.imageUrl);
      setCategory(recipe.category);
      setCookingTime(recipe.cookingTime);
      setDifficulty(recipe.difficulty);
    }
  }, [open, recipe]);

  if (!recipe) return null;

  const isNew = recipe.id === '';

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewSrc(URL.createObjectURL(file));
  }

  function handleSave() {
    onSave(
      recipe!.id,
      { title: title.trim(), description: description.trim(), imageUrl, category, cookingTime, difficulty },
      imageFile,
    );
    onClose();
  }

  const isValid = title.trim().length > 0 && description.trim().length > 0 && category.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={styles.dialogTitle}>
        {isNew ? 'Share a Recipe' : 'Edit Recipe'}
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={styles.fields}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {previewSrc ? (
            <Box sx={styles.imageWrapper}>
              <Box component="img" src={previewSrc} alt="preview" sx={styles.imagePreview} />
              <Box sx={styles.changeOverlay} onClick={() => fileInputRef.current?.click()}>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FileUploadRoundedIcon fontSize="small" /> Change photo
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={styles.imagePlaceholder} onClick={() => fileInputRef.current?.click()}>
              <ImageRoundedIcon sx={{ fontSize: 36, opacity: 0.4 }} />
              <Typography variant="caption">Click to upload a photo</Typography>
            </Box>
          )}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            fullWidth
            required
            slotProps={{ htmlInput: { maxLength: 100 } }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            fullWidth
            required
            multiline
            rows={3}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            helperText={`${description.length} / 500`}
          />
          <Box sx={styles.categoryRow}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              fullWidth
            >
              {RECIPE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Recipe['difficulty'])}
              size="small"
              sx={styles.difficultySelect}
            >
              {DIFFICULTIES.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
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

      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          {isNew ? 'Share Recipe' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
