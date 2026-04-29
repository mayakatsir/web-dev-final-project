import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import AvatarPicker from '../components/AvatarPicker';

type SignInData = { username: string; password: string };
type RegisterData = { username: string; email: string; password: string; confirmPassword: string };

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
  const { login, register: authRegister, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [regAvatar, setRegAvatar] = useState<File | undefined>(undefined);
  const [regAvatarPreview, setRegAvatarPreview] = useState('');

  const signInForm = useForm<SignInData>();
  const registerForm = useForm<RegisterData>();

  async function handleSignIn(data: SignInData) {
    setServerError('');
    setLoading(true);
    try {
      await login(data.username, data.password);
      navigate('/');
    } catch (err: any) {
      setServerError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data: RegisterData) {
    setServerError('');
    setLoading(true);
    try {
      await authRegister(data.username, data.email, data.password, regAvatar);
      navigate('/');
    } catch (err: any) {
      setServerError(err.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(credential: string) {
    setServerError('');
    setLoading(true);
    try {
      await googleLogin(credential);
      navigate('/');
    } catch (err: any) {
      setServerError(err.message ?? 'Google login failed');
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
            onChange={(_, v) => { setTab(v); setServerError(''); }}
            variant="fullWidth"
            sx={styles.tabs}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

          {tab === 0 && (
            <Box component="form" onSubmit={signInForm.handleSubmit(handleSignIn)} sx={styles.form}>
              <TextField
                label="Username"
                {...signInForm.register('username', { required: 'Username is required' })}
                error={!!signInForm.formState.errors.username}
                helperText={signInForm.formState.errors.username?.message}
                fullWidth
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                {...signInForm.register('password', { required: 'Password is required' })}
                error={!!signInForm.formState.errors.password}
                helperText={signInForm.formState.errors.password?.message}
                fullWidth
              />
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={styles.submitBtn}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={registerForm.handleSubmit(handleRegister)} sx={styles.form}>
              <AvatarPicker
                preview={regAvatarPreview}
                onChange={(file, url) => { setRegAvatar(file); setRegAvatarPreview(url); }}
              />
              <TextField
                label="Username"
                {...registerForm.register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                })}
                error={!!registerForm.formState.errors.username}
                helperText={registerForm.formState.errors.username?.message}
                fullWidth
                autoFocus
              />
              <TextField
                label="Email"
                type="email"
                {...registerForm.register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                })}
                error={!!registerForm.formState.errors.email}
                helperText={registerForm.formState.errors.email?.message}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                {...registerForm.register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
                error={!!registerForm.formState.errors.password}
                helperText={registerForm.formState.errors.password?.message}
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                {...registerForm.register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === registerForm.watch('password') || 'Passwords do not match',
                })}
                error={!!registerForm.formState.errors.confirmPassword}
                helperText={registerForm.formState.errors.confirmPassword?.message}
                fullWidth
              />
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={styles.submitBtn}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>
          )}

          <Divider sx={styles.divider}>or continue with Google</Divider>

          <Box sx={styles.googleWrapper}>
            <GoogleLogin
              onSuccess={(res) => res.credential && handleGoogle(res.credential)}
              onError={() => setServerError('Google login failed')}
              shape="pill"
              size="large"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
