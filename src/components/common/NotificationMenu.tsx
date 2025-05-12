// components/NotificationMenu.tsx
import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from '../../context/NotificationContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

const getIcon = (severity: string) => {
  switch (severity) {
    case 'success': return <CheckCircleIcon color="success" />;
    case 'error': return <ErrorIcon color="error" />;
    case 'info': return <InfoIcon color="info" />;
    case 'warning': return <WarningIcon color="warning" />;
    default: return null;
  }
};

const NotificationMenu = () => {
  const { notifications, removeNotification } = useNotification();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDismiss = (id: number) => {
    removeNotification(id);
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label={`show ${notifications.length} notifications`}
        color="inherit"
        onClick={handleOpen}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={() => handleDismiss(notif.id)}>
              <ListItemIcon>{getIcon(notif.severity)}</ListItemIcon>
              <ListItemText primary={notif.message} />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
