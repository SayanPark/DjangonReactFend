import { useTranslation } from 'react-i18next';

// Custom hook to provide consistent translation access across the app
export const useGlobalTranslation = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  
  const getCurrentLanguage = () => i18n.language;
  
  return { t, changeLanguage, getCurrentLanguage };
};

// Helper function for components that need to access translations
export const translate = (key, options = {}) => {
  const { t } = useTranslation();
  return t(key, options);
};
