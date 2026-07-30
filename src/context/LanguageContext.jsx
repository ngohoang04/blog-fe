import React, { createContext, useState, useContext, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'vi' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  }, []);

  const setLang = useCallback((lang) => {
    localStorage.setItem('lang', lang);
    setLanguage(lang);
  }, []);

  // t('hero.title') => translations[language].hero.title
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found
          }
        }
        return fallback;
      }
    }
    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
