import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { currentUser } from '../data/mockData';

export default function Navbar() {
  const navItems = [
    { path: '/', icon: <HomeIcon fontSize="small" />, label: 'Home' },
    { path: '/profile', icon: <PersonIcon fontSize="small" />, label: 'Profile' },
  ];  
  
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary" sx={{ flexGrow: 1, letterSpacing: -0.5 }}>
          EATing
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {navItems.map(({ path, icon, label }) => (
            <NavLink key={path} to={path} end style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'primary.50' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 14,
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </Box>
              )}
            </NavLink>
          ))}
        </Box>

        <Avatar
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          sx={{ width: 34, height: 34, ml: 1 }}
        />
      </Toolbar>
    </AppBar>
  );
}
