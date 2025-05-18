import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  ListItemButton,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Spa as SpaIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ open, variant, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [appointmentsOpen, setAppointmentsOpen] = React.useState(false);

  const handleAppointmentsClick = () => {
    setAppointmentsOpen(!appointmentsOpen);
  };

  // Ana navigasyon öğeleri
  const mainNavItems = [
    { 
      path: '/', 
      name: t('navigation.dashboard'), 
      icon: <DashboardIcon />,
      exact: true
    },
    { 
      path: '/appointments', 
      name: t('navigation.appointments'), 
      icon: <EventIcon />,
      subItems: [
        { 
          path: '/appointments', 
          name: t('appointments.list'), 
          exact: true
        },
        { 
          path: '/appointments/calendar', 
          name: t('appointments.calendar'), 
          exact: true
        },
        { 
          path: '/appointments/new', 
          name: t('appointments.new'), 
          exact: true
        }
      ]
    },
    { 
      path: '/customers', 
      name: t('navigation.customers'), 
      icon: <PeopleIcon />,
      exact: true
    },
    { 
      path: '/services', 
      name: t('navigation.services'), 
      icon: <SpaIcon />,
      exact: true
    },
    { 
      path: '/staff', 
      name: t('navigation.staff'), 
      icon: <PersonIcon />,
      exact: true
    },
    { 
      path: '/reports', 
      name: t('navigation.reports'), 
      icon: <AssessmentIcon />,
      exact: true
    }
  ];

  // Ayarlar navigasyon öğeleri
  const settingsNavItems = [
    { 
      path: '/settings', 
      name: t('navigation.settings'), 
      icon: <SettingsIcon />,
      exact: true
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {mainNavItems.map((item) => (
          <React.Fragment key={item.path}>
            {item.subItems ? (
              <>
                <ListItemButton onClick={handleAppointmentsClick} selected={isActive(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                  {appointmentsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={appointmentsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.path}
                        component={RouterLink}
                        to={subItem.path}
                        sx={{ pl: 4 }}
                        selected={isActive(subItem.path, subItem.exact)}
                      >
                        <ListItemText primary={subItem.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem 
                button 
                component={RouterLink} 
                to={item.path} 
                selected={isActive(item.path, item.exact)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider />
      <List>
        {settingsNavItems.map((item) => (
          <ListItem 
            button 
            key={item.path} 
            component={RouterLink} 
            to={item.path} 
            selected={isActive(item.path, item.exact)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobil çekmece */}
      <Drawer
        variant="temporary"
        open={variant === 'temporary' ? open : false}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Mobil performansı iyileştirir
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Masaüstü çekmece */}
      <Drawer
        variant="permanent"
        open={variant === 'permanent' ? open : false}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;