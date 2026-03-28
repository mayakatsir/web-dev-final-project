import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { currentUser } from '../data/mockData';

const navItems = [
  { path: '/', icon: <GridViewRoundedIcon sx={{ fontSize: 19 }} />, label: 'Feed' },
  { path: '/profile', icon: <PersonRoundedIcon sx={{ fontSize: 19 }} />, label: 'Profile' },
];

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ minHeight: '60px !important', px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Typography
          sx={{
            flexGrow: 1,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: { xs: 21, sm: 23 },
            color: 'primary.main',
            letterSpacing: '-0.5px',
            userSelect: 'none',
          }}
        >
          EATing
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 0.5, mr: 1.5 }}>
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
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {label}
                  </Box>
                </Box>
              )}
            </NavLink>
          ))}
        </Box>

        {/* Avatar */}
        <NavLink to="/profile" style={{ textDecoration: 'none', display: 'flex' }}>
          <Avatar
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            sx={{
              width: 36,
              height: 36,
              border: '2.5px solid',
              borderColor: 'primary.light',
              transition: 'border-color 0.15s',
              '&:hover': { borderColor: 'primary.main' },
            }}
          />
        </NavLink>
      </Toolbar>
    </AppBar>
  );
}
