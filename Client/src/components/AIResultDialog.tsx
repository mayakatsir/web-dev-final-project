import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import AIAnswerRenderer from './AIAnswerRenderer';

interface Props {
  open: boolean;
  answer: string;
  error: string;
  onClose: () => void;
}

export default function AIResultDialog({ open, answer, error, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: "'Fredoka One', cursive",
          color: error ? 'error.main' : 'primary.main',
          fontSize: 22,
        }}
      >
        {error ? 'Oops!' : 'Your Personalized Recipe'}
      </DialogTitle>
      <DialogContent>
        {error ? (
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {error}
          </Typography>
        ) : (
          <Box sx={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7 }}>
            <AIAnswerRenderer answer={answer} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 50 }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
