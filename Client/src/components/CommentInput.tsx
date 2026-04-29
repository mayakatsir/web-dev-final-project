import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import type { SxProps, Theme } from '@mui/material/styles';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  userAvatarUrl?: string;
  userName?: string;
}

const stickyInput: SxProps<Theme> = {
  position: 'sticky',
  bottom: 0,
  bgcolor: 'background.paper',
  pt: 1.5,
  pb: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  gap: 1.25,
  alignItems: 'center',
};

export default function CommentInput({ value, onChange, onSubmit, submitting, userAvatarUrl, userName }: Props) {
  return (
    <Box sx={stickyInput}>
      <Avatar
        src={userAvatarUrl}
        alt={userName}
        sx={{ width: 34, height: 34, flexShrink: 0 }}
      />
      <OutlinedInput
        fullWidth
        size="small"
        placeholder="Write a comment…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSubmit()}
        sx={{
          borderRadius: 50,
          fontSize: 13.5,
          bgcolor: 'grey.50',
          '& fieldset': { borderColor: 'divider' },
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={onSubmit}
              disabled={!value.trim() || submitting}
              edge="end"
              sx={{
                color: value.trim() ? 'primary.main' : 'text.disabled',
                transition: 'color 0.15s',
              }}
            >
              {submitting ? (
                <CircularProgress size={16} sx={{ color: 'primary.main' }} />
              ) : (
                <SendRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
}
