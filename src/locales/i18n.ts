import { initReactI18next } from 'react-i18next';

import i18next from 'i18next';

import commonEN from './en/common.json';
import commonKO from './ko/common.json';
import commonVN from './vn/common.json';

import { SETTINGS } from '@/settings';

const resources = {
  en: {
    common: commonEN,
  },
  ko: {
    common: commonKO,
  },
  vn: {
    common: commonVN,
  },
};

// eslint-disable-next-line import/no-named-as-default-member
i18next.use(initReactI18next).init({
  ns: ['common'],
  resources,
  lng: 'ko',
  fallbackLng: 'en',
  debug: SETTINGS.isDevMode,
  interpolation: { escapeValue: true },
  returnObjects: true,
  returnEmptyString: true,
  returnNull: true,
});

export default i18next;
