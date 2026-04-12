import { useEffect, useRef, useState } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
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
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import type { AuthUser } from '../context/AuthContext';

interface Props {
  open: boolean;
  user: AuthUser;
  onClose: () => void;
  onSave: (
    updated: Pick<AuthUser, 'name' | 'username' | 'bio' | 'avatarUrl'>,
    avatarFile?: File,
  ) => void;
}

const styles = {
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pb: 1,
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: 20,
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mb: 3,
    mt: 1,
  },
  avatarWrapper: {
    position: 'relative',
    mb: 1,
    cursor: 'pointer',
  },
  avatar: {
    width: 96,
    height: 96,
    border: '3px solid',
    borderColor: 'primary.light',
  },
  changeOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'rgba(0,0,0,0.48)',
    opacity: 0,
    transition: 'opacity 0.2s',
    '&:hover': { opacity: 1 },
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  nameRow: {
    display: 'flex',
    gap: 2,
  },
  atPrefix: {
    color: 'text.disabled',
    mr: 0.5,
    fontSize: 14,
  },
  dialogActions: {
    px: 3,
    py: 2,
    gap: 1,
  },
} satisfies Record<string, SxProps<Theme>>;

export default function EditProfileModal({ open, user, onClose, onSave }: Props) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [previewSrc, setPreviewSrc] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(user.name);
      setUsername(user.username);
      setBio(user.bio);
      setAvatarUrl(user.avatarUrl);
      setAvatarFile(undefined);
      setPreviewSrc(user.avatarUrl);
    }
  }, [open, user]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewSrc(URL.createObjectURL(file));
  }

  function handleSave() {
    onSave({ name: name.trim(), username: username.trim(), bio: bio.trim(), avatarUrl }, avatarFile);
    onClose();
  }

  const isValid = name.trim().length > 0 && username.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={styles.dialogTitle}>
        Edit Profile
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={styles.avatarSection}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Avatar with hover overlay */}
          <Box sx={styles.avatarWrapper} onClick={() => fileInputRef.current?.click()}>
            <Avatar src={previewSrc} alt={name} sx={styles.avatar} />
            <Box sx={styles.changeOverlay}>
              <FileUploadRoundedIcon sx={{ fontSize: 22, color: '#fff' }} />
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10, mt: 0.3 }}>
                Change
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.disabled">
            Click photo to upload a new one
          </Typography>
        </Box>

        <Box sx={styles.fields}>
          <Box sx={styles.nameRow}>
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
                  startAdornment: <Box component="span" sx={styles.atPrefix}>@</Box>,
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

      <DialogActions sx={styles.dialogActions}>
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
