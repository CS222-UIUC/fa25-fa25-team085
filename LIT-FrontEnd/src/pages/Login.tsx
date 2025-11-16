import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Stack, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      localStorage.setItem('username', email.split('@')[0]);
      // Small delay to ensure auth state updates
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>Log In</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              Don't have an account? <Link to="/signup" style={{ color: '#3b82f6' }}>Sign up</Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

