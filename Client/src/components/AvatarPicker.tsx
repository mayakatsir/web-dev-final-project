import { useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

interface Props {
  preview: string;
  onChange: (file: File, previewUrl: string) => void;
}

export default function AvatarPicker({ preview, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file, URL.createObjectURL(file));
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{ position: 'relative', cursor: 'pointer', '&:hover .av-overlay': { opacity: 1 } }}
      >
        <Avatar
          src={preview}
          sx={{ width: 80, height: 80, border: '3px solid', borderColor: 'primary.light' }}
        />
        <Box
          className="av-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            bgcolor: 'rgba(0,0,0,0.48)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
        >
          <FileUploadRoundedIcon sx={{ fontSize: 22, color: '#fff' }} />
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
            {preview ? 'Change' : 'Upload'}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.disabled">
        {preview ? 'Click to change photo' : 'Click to add a profile photo (optional)'}
      </Typography>
    </Box>
  );
}
