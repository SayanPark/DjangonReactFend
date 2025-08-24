// Utility to ensure Persian is used as default language
import i18n from '../i18n';

export const ensurePersianDefault = () => {
  // Force Persian as default language
  const currentLang = localStorage.getItem('i18nextLng');
  if (!currentLang || currentLang !== 'fa') {
    i18n.changeLanguage('fa');
    localStorage.setItem('i18nextLng', 'fa');
  }
};

// Call this on app initialization
export const initLanguage = () => {
  ensurePersianDefault();
};
