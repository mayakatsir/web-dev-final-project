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
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        Edit Profile
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Avatar preview */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 1 }}>
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              width: 96,
              height: 96,
              border: '3px solid',
              borderColor: 'primary.light',
              mb: 1,
            }}
          />
          <Typography variant="caption" color="text.disabled">
            Paste an image URL below to change your photo
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            size="small"
            fullWidth
            placeholder="https://…"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              fullWidth
              required
              slotProps={{ htmlInput: { maxLength: 60 } }}
            />
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              size="small"
              fullWidth
              required
              slotProps={{
                htmlInput: { maxLength: 30 },
                input: {
                  startAdornment: (
                    <Box component="span" sx={{ color: 'text.disabled', mr: 0.5, fontSize: 14 }}>
                      @
                    </Box>
                  ),
                },
              }}
            />
          </Box>
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={3}
            slotProps={{ htmlInput: { maxLength: 160 } }}
            helperText={`${bio.length} / 160`}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
