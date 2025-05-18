import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider,
  Alert
} from '@mui/material';

const LanguageSettings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'tr');
  const [successMessage, setSuccessMessage] = useState('');

  // Mevcut dili seçili olarak göster
  useEffect(() => {
    setLanguage(i18n.language || localStorage.getItem('i18nextLng') || 'tr');
  }, [i18n.language]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSave = () => {
    // Dili güncelle
    i18n.changeLanguage(language);
    // localStorage'a kaydet
    localStorage.setItem('i18nextLng', language);
    // Başarı mesajı göster
    setSuccessMessage(t('settings.saveSuccess'));
    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('settings.language')}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography variant="subtitle2" gutterBottom>
              {t('settings.language')}
            </Typography>
            <Select
              value={language}
              onChange={handleLanguageChange}
            >
              <MenuItem value="tr">Türkçe</MenuItem>
              <MenuItem value="en">English</MenuItem>
              {/* Daha fazla dil eklenebilir */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          {t('common.save')}
        </Button>
      </Box>
    </Paper>
  );
};

export default LanguageSettings;