import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Stack, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, username);
    if (error) {
      setError(error.message || 'Failed to sign up');
      setLoading(false);
    } else {
      localStorage.setItem('username', username);
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>Sign Up</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoComplete="username"
            />
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
              autoComplete="new-password"
              helperText="At least 6 characters"
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Log in</Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

