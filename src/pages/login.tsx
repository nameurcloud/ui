import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { Link } from 'react-router-dom';
import {
  Snackbar,
  Alert,
  Box,
  Paper,
  TextField,
  Button,
  Typography
} from '@mui/material';

const HEADER_HEIGHT = 65;
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const navigate = useNavigate();

  const handleClose = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/insider/dashboard');
    } else {
      setSnackbar({ open: true, message: 'Login failed', severity: 'error' });
    }
  };
   useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <Box
      sx={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        display: 'flex',
        justifyContent: 'center',
        
        alignItems: 'center',
        
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          boxShadow : 20,
          gap: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={600}>
          Sign in to your account
        </Typography>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TextField
            label="Email"
            type="email"
            variant="standard"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="standard"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="outlined" color="primary" type="submit" fullWidth>
            Sign In
          </Button>
        </form>

        <Typography variant="body2" textAlign="center">
          Don&apos;t have an account?{' '}
          <Button component={Link} to="/register" >
            Register
          </Button>
        </Typography>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={snackbar.severity as 'error' | 'success'} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Login;
