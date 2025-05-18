import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const LanguageSelector = ({ variant = 'standard', size = 'small' }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    // Dil tercihini localStorage'a kaydet
    localStorage.setItem('i18nextLng', language);
  };

  // Mevcut dil
  const currentLanguage = i18n.language || localStorage.getItem('i18nextLng') || 'tr';

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth variant={variant} size={size}>
        <InputLabel id="language-select-label">Dil / Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={currentLanguage}
          onChange={changeLanguage}
          label="Dil / Language"
        >
          <MenuItem value="tr">Türkçe</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;