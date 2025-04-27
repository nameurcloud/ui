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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Changed to 'sm' for better mobile behavior

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await registerUser(email, password, firstName, lastName, mobile, dob);
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
    minHeight: isMobile ? '100%' : `calc(90vh - ${HEADER_HEIGHT}px)`,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: isMobile ? 'flex-start' : 'center',
    overflow: 'hidden',
    p: 2,
    gap: 1,
  }}
>
  {/* Subscriptions */}
  <Box
    sx={{
      flex: 1,
      width: '100%',
      mb: isMobile ? 4 : 0, // Margin bottom on mobile to separate sections
    }}
  >
    <Typography variant="h5" fontWeight={600} mb={2} textAlign="center">
      Subscriptions
    </Typography>
    <Stack spacing={2} alignItems="center">
      {subscriptionOptions.map((option, idx) => (
        <Paper
          key={idx}
          elevation={2}
          sx={{
            p: 2,
            textAlign: 'center',
            width: isMobile ? '90%' : '70%',
          }}
        >
          {option}
        </Paper>
      ))}
    </Stack>
  </Box>

  {/* Registration Form */}
  <Box
    sx={{
      flex: 1,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h6" textAlign="center" mb={3}>
        Create Your Account
      </Typography>

      <Stack spacing={2}>
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
      </Stack>
    </Paper>
  </Box>

  {/* Snackbar for feedback */}
  <Snackbar
    open={snackbar.open}
    autoHideDuration={4000}
    onClose={handleCloseSnackbar}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
