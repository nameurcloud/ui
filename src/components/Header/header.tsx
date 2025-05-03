import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../context/themecontext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          color: theme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ mr: 2 }}
            component={Link} to="/"
          >
         <img src="/images/5.png" style={{ height: '40px' }} alt="Logo" />

          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Name Your Cloud
          </Typography>

          <Button
            color="inherit"
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              },
            }}
             component={Link} to="login"
          >
            Login
          </Button>

          <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 2 }}>
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
