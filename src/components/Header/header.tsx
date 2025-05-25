import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useTheme } from '../../context/themecontext'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        
        sx={{
          backgroundColor: 'transparent',
          color: theme === 'dark' ? '#fff' : '#000',
          height: '45px'
        }}
      >
        <Toolbar>
           <IconButton  edge="start" color="inherit" aria-label="logo"  style={{ marginTop: '-5px' , marginLeft: '5px'}}>
            <img src="/images/logo.png"  alt="Logo" height='50px'  />
          </IconButton>

          <Typography component="div" sx={{ flexGrow: 1 }}>
           
          </Typography>

          <Button
            color="inherit"
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              },
            }}
            component={Link}
            to="login"
          >
            Login
          </Button>

          <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 0 }}>
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
