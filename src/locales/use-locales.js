import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
// utils
import { localStorageGetItem } from 'src/utils/storage-available';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { allLangs, defaultLang } from './config-lang';

// ----------------------------------------------------------------------

export default function useLocales() {
  const { i18n, t } = useTranslation();

  const settings = useSettingsContext();

  const langStorage = localStorageGetItem('i18nextLng');

  const currentLang = allLangs.find((lang) => lang.value === langStorage) || defaultLang;

  const onChangeLang = useCallback(
    (newlang) => {
      const lang = allLangs.find((l) => l.value === newlang) || defaultLang;
      i18n.changeLanguage(newlang);
      settings.onChangeDirectionByLang(newlang);
      // Update the document's HTML lang attribute
      document.documentElement.lang = newlang;
      // Store the language in localStorage
      localStorage.setItem('i18nextLng', newlang);
    },
    [i18n, settings]
  );

  return {
    allLangs,
    t,
    currentLang,
    onChangeLang,
  };
}
