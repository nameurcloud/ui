import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useTheme } from '../../context/themecontext'
import { logoutUser } from '../../services/authService'
import { Link, useNavigate } from 'react-router-dom'
import {
  Badge,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import QuizIcon from '@mui/icons-material/Quiz'
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import ApiIcon from '@mui/icons-material/Api'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import RecommendIcon from '@mui/icons-material/Recommend'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const handleMyAccount = () => {
    navigate('/insider/profile')
  }

  const [open, setOpen] = React.useState(false)
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const menuItems = [
    {
      key: 'Dashboard',
      label: 'Dashboard',
      icon: <DashboardCustomizeIcon />,
      path: '../insider/dashboard',
    },
    {
      key: 'Names',
      label: 'Names',
      icon: <DriveFileRenameOutlineIcon />,
      path: '../insider/names',
    },
    {
      key: 'Configuration',
      label: 'Configuration',
      icon: <PermDataSettingIcon />,
      path: '/insider/config',
    },
    { key: 'API', label: 'API', icon: <ApiIcon />, path: '/insider/api' },
    { key: 'Payment', label: 'Payment', icon: <CurrencyRupeeIcon />, path: '/insider/payment' },
  ]

  const secondaryItems = [
    {
      key: 'Reccomendation',
      label: 'Reccomendation',
      icon: <RecommendIcon />,
      path: '/insider/recom',
    },
    { key: 'FAQ', label: 'FAQ', icon: <QuizIcon />, path: '/insider/faq' },
    { key: 'Support', label: 'Support', icon: <SupportAgentIcon />, path: '/insider/support' },
  ]

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
      <List>
        {menuItems.map(({ key, label, icon, path }) => (
          <ListItem key={key} disablePadding>
            <ListItemButton component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondaryItems.map(({ key, label, icon, path }) => (
          <ListItem key={key} disablePadding>
            <ListItemButton component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMyAccount}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  )
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={toggleTheme}>
        <IconButton size="large" color="inherit">
          {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <p>Theme</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 1 new notifications" color="inherit">
          <Badge badgeContent={1} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

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
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            open={open}
            onClose={toggleDrawer(false)}
            anchor="right"
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                borderRadius: 4, // All corners rounded
                width: 250,
                height: '95vh', // Optional: shorter height for a floating look
                mt: 2, // Top margin (optional)
                mb: 2, // Bottom margin (optional)
                mr: 2, // Right gap
                boxShadow: 6, // Optional: enhance the floating effect
              },
            }}
          >
            {DrawerList}
          </Drawer>
          <IconButton size="large" edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }}>
            <img src="/images/5.png" style={{ height: '40px' }} alt="Logo" />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Name Your Cloud
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 2 }}>
              {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}

export default Header
