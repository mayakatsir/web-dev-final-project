import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from '../types';

interface Props {
  open: boolean;
  user: User;
  onClose: () => void;
  onSave: (updated: Pick<User, 'name' | 'username' | 'bio' | 'avatarUrl'>) => void;
}

export default function EditProfileModal({ open, user, onClose, onSave }: Props) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  // Reset fields when modal opens with latest user data
  useEffect(() => {
    if (open) {
      setName(user.name);
      setUsername(user.username);
      setBio(user.bio);
      setAvatarUrl(user.avatarUrl);
    }
  }, [open, user]);

  function handleSave() {
    onSave({ name: name.trim(), username: username.trim(), bio: bio.trim(), avatarUrl });
    onClose();
  }

  const isValid = name.trim().length > 0 && username.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Edit Profile
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Avatar preview */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar src={avatarUrl} alt={name} sx={{ width: 90, height: 90 }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            size="small"
            fullWidth
            placeholder="https://…"
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            fullWidth
            required
            inputProps={{ maxLength: 60 }}
          />
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
            size="small"
            fullWidth
            required
            inputProps={{ maxLength: 30 }}
            slotProps={{ input: { startAdornment: <Box component="span" sx={{ color: 'text.disabled', mr: 0.5 }}>@</Box> } }}
          />
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 160 }}
            helperText={`${bio.length}/160`}
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
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
