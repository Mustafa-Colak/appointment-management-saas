import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import LanguageSelector from '../common/LanguageSelector';

const Header = ({ onToggleSidebar, isDarkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('app.name')}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Dil Seçici */}
          <Box sx={{ mr: 2 }}>
            <LanguageSelector variant="outlined" />
          </Box>
          
          {/* Karanlık/Aydınlık Mod Düğmesi */}
          <Tooltip title={isDarkMode ? t('settings.lightMode') : t('settings.darkMode')}>
            <IconButton color="inherit" onClick={onToggleTheme} sx={{ mr: 1 }}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          {/* Bildirimler */}
          <Tooltip title={t('settings.notifications')}>
            <IconButton color="inherit" onClick={handleOpenNotificationsMenu} sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Kullanıcı Menüsü */}
          <Tooltip title={t('navigation.profile')}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {user?.avatar ? (
                <Avatar alt={user.firstName} src={user.avatar} />
              ) : (
                <Avatar>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</Avatar>
              )}
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Bildirimler Menüsü */}
        <Menu
          id="notifications-menu"
          anchorEl={anchorElNotifications}
          keepMounted
          open={Boolean(anchorElNotifications)}
          onClose={handleCloseNotificationsMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              width: 350,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Typography variant="h6">{t('settings.notifications')}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseNotificationsMenu}>
            {t('appointments.new')} - John Doe
          </MenuItem>
          <MenuItem onClick={handleCloseNotificationsMenu}>
            {t('appointments.cancelled')} - Jane Smith
          </MenuItem>
          <MenuItem onClick={handleCloseNotificationsMenu}>
            {t('customers.new')} - Sam Wilson
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            handleCloseNotificationsMenu();
          }}>
            <Typography sx={{ textAlign: 'center', width: '100%' }}>{t('dashboard.viewAll')}</Typography>
          </MenuItem>
        </Menu>
        
        {/* Kullanıcı Menüsü */}
        <Menu
          id="user-menu"
          anchorEl={anchorElUser}
          keepMounted
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '& .MuiMenuItem-root': {
                minWidth: 180,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => {
            handleCloseUserMenu();
            navigate('/settings/profile');
          }}>
            <PersonIcon sx={{ mr: 2 }} />
            <Typography textAlign="center">{t('navigation.profile')}</Typography>
          </MenuItem>
          <MenuItem onClick={() => {
            handleCloseUserMenu();
            navigate('/settings');
          }}>
            <SettingsIcon sx={{ mr: 2 }} />
            <Typography textAlign="center">{t('navigation.settings')}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            handleCloseUserMenu();
            handleLogout();
          }}>
            <LogoutIcon sx={{ mr: 2 }} />
            <Typography textAlign="center">{t('navigation.logout')}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;