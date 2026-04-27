import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { AuthUser } from '../context/AuthContext';

interface Props {
  user: AuthUser;
  onEditClick: () => void;
}

export default function ProfileHero({ user, onEditClick }: Props) {
  return (
    <Box
      sx={{
        mx: { xs: -3, sm: -3 },
        background: 'linear-gradient(180deg, #D94F1A 0%, #E8631A 28%, #F0703A 52%, #fdf0e8 80%, #ffffff 100%)',
        pt: { xs: 5, sm: 7 },
        pb: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', top: -20, right: 70, width: 150, height: 150, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: 20, right: -20, width: 180, height: 180, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: 15, left: 40, width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />

      <Button
        variant="outlined"
        size="small"
        onClick={onEditClick}
        sx={{
          position: 'absolute',
          top: 14,
          right: 16,
          color: 'white',
          borderColor: 'rgba(255,255,255,0.65)',
          '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.15)' },
        }}
      >
        Edit Profile
      </Button>

      <Avatar
        src={user.avatarUrl}
        alt={user.name}
        sx={{ width: 110, height: 110, border: '4px solid #ffffff', boxShadow: '0 6px 24px rgba(28,24,20,0.22)', zIndex: 1 }}
      />

      <Box sx={{ textAlign: 'center', mt: 2, mb: 0, px: 2 }}>
        <Typography
          variant="h5"
          sx={{ lineHeight: 1.2, mb: 0.3, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
        >
          {user.name}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight={600} sx={{ mb: 0.75 }}>
          @{user.username}
        </Typography>
        {user.bio && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 0.75 }}>
            {user.bio}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
