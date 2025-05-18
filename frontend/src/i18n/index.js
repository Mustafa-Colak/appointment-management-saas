import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import trTranslation from './locales/tr/translation.json';
import enTranslation from './locales/en/translation.json';

// Çeviriler
const resources = {
  tr: {
    translation: trTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  // Dil algılama
  .use(LanguageDetector)
  // React ile entegrasyon
  .use(initReactI18next)
  // Başlangıç konfigürasyonu
  .init({
    resources,
    fallbackLng: 'tr',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React zaten XSS koruması yapıyor
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;