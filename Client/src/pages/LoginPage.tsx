import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FEFCF9 0%, #FDE8D8 100%)',
    p: 2,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 4,
    boxShadow: '0 8px 40px rgba(232,99,26,0.12)',
  },
  logo: {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
    color: 'primary.main',
    fontSize: '2.4rem',
    textAlign: 'center',
    mb: 0.5,
  },
  tagline: {
    textAlign: 'center',
    color: 'text.secondary',
    fontSize: '0.9rem',
    mb: 2,
  },
  tabs: {
    mb: 3,
    '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  divider: {
    my: 2.5,
    color: 'text.disabled',
    fontSize: '0.8rem',
  },
  googleWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  submitBtn: {
    py: 1.3,
    fontWeight: 600,
    fontSize: '1rem',
    borderRadius: 50,
  },
} satisfies Record<string, SxProps<Theme>>;

export default function LoginPage() {
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // sign in fields
  const [siUsername, setSiUsername] = useState('');
  const [siPassword, setSiPassword] = useState('');

  // register fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(siUsername, siPassword);
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(regUsername, regEmail, regPassword);
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(credential: string) {
    setError('');
    setLoading(true);
    try {
      await googleLogin(credential);
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'Google login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={styles.root}>
      <Card sx={styles.card}>
        <CardContent sx={{ p: 4 }}>
          <Typography sx={styles.logo}>EATing</Typography>
          <Typography sx={styles.tagline}>Share recipes. Inspire kitchens.</Typography>

          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            variant="fullWidth"
            sx={styles.tabs}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {tab === 0 && (
            <Box component="form" onSubmit={handleSignIn} sx={styles.form}>
              <TextField
                label="Username"
                value={siUsername}
                onChange={(e) => setSiUsername(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={siPassword}
                onChange={(e) => setSiPassword(e.target.value)}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={styles.submitBtn}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister} sx={styles.form}>
              <TextField
                label="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={styles.submitBtn}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>
          )}

          <Divider sx={styles.divider}>or continue with Google</Divider>

          <Box sx={styles.googleWrapper}>
            <GoogleLogin
              onSuccess={(res) => res.credential && handleGoogle(res.credential)}
              onError={() => setError('Google login failed')}
              shape="pill"
              size="large"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
