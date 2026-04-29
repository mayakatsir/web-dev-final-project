import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const styles = {
  appBar: { bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' },
  toolbar: { minHeight: '60px !important', px: { xs: 2, sm: 3 } },
  logo: {
    flexGrow: 1,
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: { xs: 21, sm: 23 },
    color: 'primary.main',
    letterSpacing: '-0.5px',
    userSelect: 'none',
  },
  navLinksBox: { display: 'flex', gap: 0.5, mr: 1.5 },
  navLinkLabel: { display: { xs: 'none', sm: 'inline' } },
  avatar: {
    width: 36,
    height: 36,
    border: '2.5px solid',
    borderColor: 'primary.light',
    transition: 'border-color 0.15s',
    '&:hover': { borderColor: 'primary.main' },
  },
} satisfies Record<string, SxProps<Theme>>;

const navItems = [
  { path: '/', icon: <GridViewRoundedIcon sx={{ fontSize: 19 }} />, label: 'Feed' },
  { path: '/profile', icon: <PersonRoundedIcon sx={{ fontSize: 19 }} />, label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={styles.appBar}
    >
      <Toolbar sx={styles.toolbar}>
        <Typography sx={{ ...styles.logo, cursor: 'pointer' }} onClick={() => navigate('/')}>
          EATing
        </Typography>

        <Box sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 0.5,
        }}>
          {navItems.map(({ path, icon, label }) => (
            <NavLink key={path} to={path} end style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6,
                    px: { xs: 1.2, sm: 1.8 },
                    py: 0.8,
                    borderRadius: 50,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'rgba(232,99,26,0.09)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 14,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                  }}
                >
                  {icon}
                  <Box component="span" sx={styles.navLinkLabel}>
                    {label}
                  </Box>
                </Box>
              )}
            </NavLink>
          ))}
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <NavLink to="/profile" style={{ textDecoration: 'none', display: 'flex' }}>
            <Avatar
              src={user?.avatarUrl}
              alt={user?.name ?? user?.username}
              sx={styles.avatar}
            />
          </NavLink>

          <Tooltip title="Logout">
            <IconButton size="small" onClick={handleLogout} sx={{ color: 'text.secondary' }}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
