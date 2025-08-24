import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  
  const getCurrentLanguage = () => i18n.language;
  
  return (
    <TranslationContext.Provider value={{ t, changeLanguage, getCurrentLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useGlobalTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useGlobalTranslation must be used within TranslationProvider');
  }
  return context;
};
