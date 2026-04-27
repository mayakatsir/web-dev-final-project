import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

interface TabButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function TabButton({ active, icon, label, onClick }: TabButtonProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        px: 2.5,
        py: 1.2,
        mb: '-2px',
        cursor: 'pointer',
        borderBottom: '2px solid',
        borderColor: active ? 'primary.main' : 'transparent',
        color: active ? 'primary.main' : 'text.secondary',
        fontWeight: active ? 700 : 400,
        fontSize: 14,
        fontFamily: active ? "'Fredoka One', cursive" : 'inherit',
        letterSpacing: active ? 0.5 : 0,
        transition: 'all 0.15s',
        '&:hover': { color: 'primary.main' },
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

interface Props {
  tab: 'mine' | 'favorites';
  onTabChange: (tab: 'mine' | 'favorites') => void;
  aiLoading: boolean;
  favTotal: number;
  onNewRecipe: () => void;
  onInspireMe: () => void;
}

export default function ProfileTabs({ tab, onTabChange, aiLoading, favTotal, onNewRecipe, onInspireMe }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 3, borderBottom: '2px solid', borderColor: 'divider' }}>
      <TabButton
        active={tab === 'mine'}
        icon={<MenuBookRoundedIcon sx={{ fontSize: 17 }} />}
        label="My Recipes"
        onClick={() => onTabChange('mine')}
      />
      <TabButton
        active={tab === 'favorites'}
        icon={<FavoriteRoundedIcon sx={{ fontSize: 17 }} />}
        label="Favorites"
        onClick={() => onTabChange('favorites')}
      />

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pb: 1 }}>
        {tab === 'mine' ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onNewRecipe}
            sx={{ px: 2 }}
          >
            New Recipe
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={aiLoading ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeRoundedIcon />}
            onClick={onInspireMe}
            disabled={aiLoading || favTotal === 0}
            sx={{ px: 2, borderRadius: 50, fontFamily: "'Fredoka One', cursive", letterSpacing: 0.5, fontWeight: 400 }}
          >
            {aiLoading ? 'Generating...' : 'Inspire Me!'}
          </Button>
        )}
      </Box>
    </Box>
  );
}
