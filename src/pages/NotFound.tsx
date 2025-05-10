// src/pages/NotFound.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

const HEADER_HEIGHT = 65;


const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = "Not Found";
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
      404 - Page Not Found
      </Typography>
      <Typography textAlign="center" fontWeight={600}>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link to="/">Go Home</Link>
      </Typography>
 </Paper>
 </Box>

    )
};

export default NotFound;
