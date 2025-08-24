import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import globalTranslations from '../translations/global.json';

// Translation resources
const resources = globalTranslations;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fa', // default language
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
