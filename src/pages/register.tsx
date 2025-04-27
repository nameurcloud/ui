import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';

const HEADER_HEIGHT = 65;

const subscriptionOptions = [
  'Our Way',
  'Your Way',
  'Our Way + Integration',
  'Your Way + Integration',
  'Trial',
];

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success',
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await registerUser(email, password,firstName,lastName,mobile,dob);
      if (res.ok) {
        setSnackbar({
          open: true,
          message: 'Registration successful!',
          severity: 'success',
        });
        setTimeout(() => navigate('/pages/login'), 1000);
      } else if (res.status === 400) {
        setSnackbar({
          open: true,
          message: 'User already exists',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Registration failed',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Network error. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        overflow: 'hidden',
        p: 2,
        gap: 4,
      }}
    >
      {/* Left side: Subscription Options */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 1,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={2}>
          Subscriptions
        </Typography>
        <Stack spacing={2}>
          {subscriptionOptions.map((option, idx) => (
            <Paper
              key={idx}
              elevation={3}
              sx={{ p: 2, textAlign: 'center', width: '80%' }}
            >
              {option}
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Right side: Registration Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: isMobile ? 'flex-start' : 'center',
          width: '20%',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 300,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" textAlign="center">
            Create Your Account
          </Typography>

          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Mobile Number"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Register
          </Button>
        </Box>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
