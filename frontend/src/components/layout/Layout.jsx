import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme, createTheme, ThemeProvider } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarVariant, setSidebarVariant] = useState(isMobile ? 'temporary' : 'permanent');
  
  // Karanlık/aydınlık mod
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  // Tema değiştirildiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  
  // Ekran boyutu değiştiğinde sidebar durumunu güncelle
  useEffect(() => {
    setSidebarVariant(isMobile ? 'temporary' : 'permanent');
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Sidebar toggle işlevi
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Tema değiştirme
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Dinamik tema oluştur
  const customTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: isDarkMode ? 'dark' : 'light',
      primary: theme.palette.primary,
      secondary: theme.palette.secondary
    }
  });
  
  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Header */}
        <Header 
          onToggleSidebar={handleToggleSidebar} 
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
        />
        
        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          variant={sidebarVariant}
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Ana içerik */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
            ml: { sm: sidebarOpen ? '240px' : 0 },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar /> {/* Header yüksekliği kadar boşluk */}
          <Box sx={{ p: 3 }}>
            <Outlet /> {/* Sayfa içeriği buraya render edilir */}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;